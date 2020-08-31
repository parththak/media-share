const {
  DateTimeResolver,
  EmailAddressResolver,
  URLResolver,
} = require("graphql-scalars");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET || "SoSecureProbablyGottaChangeThis";
const { AuthenticationError } = require("apollo-server-express");
const { User, Lobby } = require("../models/models");
const { paginateResults } = require("../utils");

let secureCookie = !(process.env.NODE_ENV !== "production");

//  Resolvers which handle server calls => link to MongoDB
const resolvers = {
  Query: {
    isLoggedIn: async (_root, _args, context) => {
      return context.user !== null;
    },
    userStatus: async (_root, _args, context) => {
      return {
        loggedIn: context.user !== null,
        currentUser: context.user,
      };
    },
    // User Information
    currentUser: async (_root, _args, context) => {
      return context.user;
    },
    myInfo: async (_root, _args, context) => {
      // verifyLoggedIn(context.user);
      return await User.findOne({ username: context.user.username }).exec();
    },
    userInfo: async (_root, { username }) =>
      await User.findOne({ username: username }).exec(),
    lobbyInfo: async (_root, { id }) => await Lobby.findOne({ _id: id }).exec(),
    publicLobbies: async (_root, { after, categories }) => {
      let results = [];
      if (categories.length === 0) {
        results = await Lobby.find({
          access: "PUBLIC",
        })
          .sort({ created_at: -1 })
          .exec();
      } else {
        results = await Lobby.find({
          access: "PUBLIC",
          categories: {
            $elemMatch: {
              $in: categories,
            },
          },
        })
          .sort({ created_at: -1 })
          .exec();
      }

      let get_cursor_lobby_url = function (lobby) {
        return lobby.url;
      };

      let paginated_results = paginateResults({
        results,
        after,
        pageSize: 1,
        getCursor: get_cursor_lobby_url,
      });

      return {
        lobbies: paginated_results,
        cursor: paginated_results.length
          ? paginated_results[paginated_results.length - 1].url
          : null,
        // if the cursor of the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: paginated_results.length
          ? paginated_results[paginated_results.length - 1].url !==
            results[results.length - 1].url
          : false,
      };
    },
    getFriends: async (_, { username, after }) => {
      let user = await User.findOne({ username });
      let user_obj = user.toObject();
      delete Object.assign(user_obj, { id: user_obj["_id"] })["_id"];
      let results = user_obj.friends;

      let get_cursor_friends = function (username) {
        return username;
      };

      let paginated_results = paginateResults({
        results,
        after,
        pageSize: 1,
        getCursor: get_cursor_friends,
      });

      return {
        friends: paginated_results,
        cursor: paginated_results.length
          ? paginated_results[paginated_results.length - 1]
          : null,
        // if the cursor of the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: paginated_results.length
          ? paginated_results[paginated_results.length - 1] !==
            results[results.length - 1]
          : false,
      };
    },
  },
  Mutation: {
    // User Authentication Resolvers
    register: async (_root, attributes, context) => {
      try {
        verifyLoggedOut(context.user);
      } catch (e) {
        return {
          user: null,
          errors: [e.name],
        };
      }
      try {
        // make sure email and username are unique
        let email_check = await User.findOne({
          email: attributes.email,
        }).exec();
        if (email_check !== null) {
          return {
            user: null,
            errors: ["email"],
          };
        }

        let username_check = await User.findOne({
          username: attributes.username,
        }).exec();
        if (username_check !== null) {
          return {
            user: null,
            errors: ["username"],
          };
        }

        // create empty friends list for new user
        attributes.friends = [];
        let response = await User.create(attributes);
        return {
          user: response,
          errors: [],
        };
      } catch (e) {
        return e.message;
      }
    },
    login: async (_root, { username, password }, context) => {
      try {
        verifyLoggedOut(context.user);
      } catch (e) {
        return {
          token: null,
          user: null,
          errors: [e.name],
        };
      }
      let user = await User.findOne({ username: username }).exec();
      if (user === null) {
        // return "Invalid username";
        return {
          token: null,
          user,
          errors: ["username"],
        };
      }

      let success = await user
        .verifyPassword(password)
        .then(function (valid) {
          if (valid) {
            // generate a token to store in secure, HttpOnly cookie
            let user_obj = user.toObject();
            delete Object.assign(user_obj, { id: user_obj["_id"] })["_id"];
            const token = jwt.sign(user_obj, SECRET_KEY, { expiresIn: "7d" });

            // Set cookie
            context.res.cookie("token", String(token), {
              path: "/",
              httpOnly: true,
              secure: secureCookie,
              sameSite: true,
              maxAge: 60 * 60 * 24 * 7, // 1 week
            });

            // return "Correct pw";
            return {
              token,
              user: user_obj,
              errors: [],
            };
          } else {
            // return "Incorrect pw";
            return {
              token: null,
              user: null,
              errors: ["password"],
            };
          }
        })
        .catch(function (err) {
          console.log(err);
        });
      return success;
    },
    logout: async (_, __, context) => {
      verifyLoggedIn(context.user);
      context.res.clearCookie("token");
      return true;
    },
    updateProfile: async (_, { email, password }, context) => {
      verifyLoggedIn(context.user);
      // get current user from context
      let user = context.user;
      const filter = { username: user.username };
      const update = { email, password };
      if (email === null) {
        delete update.email;
      }
      if (password === null) {
        delete update.password;
      }

      if (update === {}) {
        return context.user;
      }
      let updated = await User.findOneAndUpdate(filter, update, {
        new: true,
      });

      return updated;
    },
    addFriend: async (_, { username }, context) => {
      let user_to_add = await User.findOne({ username });
      let user_adding = await User.findById(context.user.id);
      if (user_to_add === null || user_adding === null) {
        return false;
      }
      let user_to_add_current_friends = user_to_add.friends;
      let user_adding_current_friends = user_adding.friends;
      // otherwise update
      // console.log(user_to_add, user_adding);
      if (user_adding.friends.includes(user_to_add.username)) {
        return false;
      }
      user_adding_current_friends.push(user_to_add.username);
      user_to_add_current_friends.push(user_adding.username);

      await user_to_add.save();
      await user_adding.save();

      return true;
    },
    removeFriend: async (_, { username }, context) => {
      let user_to_delete = await User.findOne({ username });
      let user_deleting = await User.findById(context.user.id);
      if (user_to_delete === null || user_deleting === null) {
        return false;
      }
      let user_to_delete_current_friends = user_to_delete.friends;
      let user_deleting_current_friends = user_deleting.friends;
      // otherwise update
      // console.log(user_to_delete, user_deleting);
      if (!user_deleting.friends.includes(user_to_delete.username)) {
        return false;
      }

      let del1 = user_deleting_current_friends.indexOf(user_to_delete.username);
      if (del1 > -1) {
        user_deleting_current_friends.splice(del1, 1);
        user_deleting.friends = user_deleting_current_friends;
      }
      let del2 = user_to_delete_current_friends.indexOf(user_deleting.username);
      if (del2 > -1) {
        user_to_delete_current_friends.splice(del2, 1);
        user_to_delete.friends = user_to_delete_current_friends;
      }

      await user_to_delete.save();
      await user_deleting.save();

      return true;
    },

    //  Lobby Resolvers
    createLobby: async (_root, args) => {
      try {
        let new_lobby = await Lobby.create({
          host_id: args.host_id,
          host_username: args.host_username,
          name: args.name,
          access: args.access,
          limit: args.limit,
          others_usernames: [],
          others_sockets: [],
          categories: args.categories,
          playlist: args.playlist,
          url: args.url,
        });
        new_lobby.others = new_lobby.others_usernames;
        return new_lobby;
      } catch (e) {
        return { lobby: null, errors: [e.message] };
      }
    },
    joinLobby: async (_root, { username, url, sid }) => {
      try {
        // get lobby by url
        let lobby = await Lobby.findOne({ url }).exec();
        console.log(lobby);
        let host_name = lobby.host_username;
        let others = lobby.others_usernames;
        let others_sockets = lobby.others_sockets;

        // console.log(username, url);
        if (host_name === username || others.includes(username)) {
          if (host_name === username) {
            lobby.host_id = sid;
            lobby = await lobby.save();
          } else {
            let index = others.indexOf(username);
            others_sockets[index] = sid;
            lobby = await lobby.save();
          }
          lobby.others = others;
          return lobby;
        }

        if (others.length === 3) {
          return null;
        }

        console.log("NO ERRORS");

        // otherwise update document and return lobby
        others.push(username);
        others_sockets.push(sid);
        lobby.others_usernames = others;
        lobby.others_sockets = others_sockets;
        console.log("SET OTHERS");
        try {
          lobby = await lobby.save();
        } catch (e) {
          console.log(e.message);
          throw e;
        }
        console.log(lobby);
        lobby.others = others;

        return lobby;
      } catch (e) {
        return e.message;
      }
    },
    leaveLobby: async (_root, { username, url }) => {
      try {
        // get lobby by url
        let lobby = await Lobby.findOne({ url }).exec();
        let current_host_username = lobby.host_username;
        let others = lobby.others_usernames;
        let others_sockets = lobby.others_sockets;
        console.log(url, lobby, current_host_username, others, username);

        if (current_host_username !== username && !others.includes(username)) {
          console.log("CANT LEAVE IF YOU CANT EVEN GET IN");
          return null;
        }
        // check if user is host
        if (current_host_username === username) {
          // check if any users are left
          if (others.length > 0) {
            console.log("IM THE HOST, TIME TO PASS ON");
            let new_host = others.splice(0, 1)[0];
            let new_host_socket = others_sockets.splice(0, 1)[0];
            console.log(new_host);
            lobby.host_username = new_host;
            lobby.host_id = new_host_socket;
          } else {
            console.log("IM THE ONLY ONE IN HERE");
            await Lobby.deleteOne({ url: url });
            return null;
          }
        }
        // else user is in others
        else {
          console.log("IM AN OTHER");
          let index = others.indexOf(username);
          // console.log(index);
          others.splice(index, 1);
          others_sockets.splice(index, 1);
          // let index = others.indexOf(username);
          // others.splice(index, 1);
        }

        // update document
        lobby.others_usernames = others;
        lobby.others_sockets = others_sockets;
        console.log(lobby);
        lobby = await lobby.save();
        lobby.others = others;
        return lobby;
      } catch (e) {
        return e.message;
      }
    },
    deleteLobby: async (_root, { id }) => {
      try {
        let response = await Lobby.findByIdAndRemove(id).exec();
        return response;
      } catch (e) {
        return e.message;
      }
    },
    addToPlaylist: async (_, args) => {
      let lobby_url = args.lobby_url;
      let new_url = args.video_url;
      // console.log("MID: ", args);
      // console.log(args);
      let lobby = await Lobby.findOne({ url: lobby_url }).exec();
      // console.log("LOBBY", lobby);
      let current_playlist = lobby.playlist;
      // console.log(current_playlist);
      if (!current_playlist.includes(new_url)) {
        current_playlist.push(new_url);
      }
      lobby.playlist = current_playlist;
      lobby = await lobby.save();
      return current_playlist;
    },
    removeFromPlaylist: async (_, args) => {
      let lobby_url = args.lobby_url;
      let video_to_delete = args.video_url;
      // console.log("MID: ", args);
      // console.log(args);
      let lobby = await Lobby.findOne({ url: lobby_url }).exec();
      // console.log("LOBBY", lobby);
      let current_playlist = lobby.playlist;
      // console.log(current_playlist);
      if (current_playlist.includes(video_to_delete)) {
        let index = current_playlist.indexOf(video_to_delete);
        current_playlist.splice(index, 1);
      }
      lobby.playlist = current_playlist;
      // console.log("LOBBY", lobby);
      lobby = await lobby.save();
      return current_playlist;
    },

    // User modifications
    deleteUser: async (_root, { id }) => {
      try {
        let response = await User.findByIdAndRemove(id).exec();
        return response;
      } catch (e) {
        return e.message;
      }
    },
  },

  // For custom GraphQL scalars:
  EmailAddress: EmailAddressResolver,
  URL: URLResolver,
  DateTime: DateTimeResolver,
};

function verifyLoggedIn(user) {
  if (!user) {
    throw new AuthenticationError("Not logged in!");
  }
}

function verifyLoggedOut(user) {
  if (user) {
    throw new AuthenticationError("Already logged in!");
  }
}

module.exports = resolvers;

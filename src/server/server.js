const express = require("express");
const { ApolloServer, AuthenticationError } = require("apollo-server-express");
const typeDefs = require("./schemas/types");
const resolvers = require("./schemas/resolvers");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const sslRedirect = require("heroku-ssl-redirect");
const socketio = require("socket.io");
const fetchGraphql = require("./etc/fetch-graphql");

require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "SoSecureProbablyGottaChangeThis";
// process.env.JWT_SECRET generated with: https://www.grc.com/passwords.htm
const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 4000;
require("./config"); // executes the code in config to connect to mongo server

// TODO for server
// Improving schemas, resolvers, finding use for subscriptions
// Validating input

const context = ({ req, res }) => {
  const token = req.cookies.token;
  const user = getUser(token);

  return {
    user,
    res,
  };
};

const getUser = function (token) {
  try {
    if (token) {
      return jwt.verify(token, SECRET_KEY);
    }
    return null;
  } catch (err) {
    throw new AuthenticationError(
      "Token for authentication is invalid! Try again."
    );
  }
};

let show_server_stuff = false;
if (process.env.NODE_ENV !== "production") {
  show_server_stuff = true;
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  playground: show_server_stuff,
  introspection: show_server_stuff,
});

const corsConfig =
  process.env.NODE_ENV !== "production"
    ? {
        // origin: `http://localhost:4000`, // npm run local
        origin: `http://localhost:3000`, // npm run frontEnd
        credentials: true,
      }
    : {
        origin: process.env.CLIENT_URL,
        credentials: true,
      };

const app = express();
// enable ssl redirect if in prod
if (process.env.NODE_ENV === "production") {
  app.use(sslRedirect());
}
app.use(express.static(path.join(__dirname, "..", "..", "build")));

app.get("*", function (req, res, next) {
  if (req.url === "/graphql") return next();
  res.sendFile(path.join(__dirname, "..", "..", "build", "index.html"));
});

app.use(cors(corsConfig));
app.use(cookieParser());
server.applyMiddleware({
  app,
  cors: false, // apollo-server-express was overwriting cors config
});

// HTTP Setup:
const http = app.listen({ port: PORT }, () =>
  console.log(
    process.env.NODE_ENV !== "production"
      ? `HTTP server on http://localhost:${PORT}${server.graphqlPath}`
      : `HTTP server on https://crewtube.herokuapp.com${server.graphqlPath} SSL redirected to HTTPS`
  )
);

// Attach socket.io to the server instance
const io = socketio(http);
io.on("connection", (socket) => {
  console.log(socket.id, "ENTERED THE BUILDING");

  socket.on("disconnecting", () => {
    // on leaving room
    console.log(socket.id, "LEAVING THE BUILDING");
    socket.emit("leave-room");
  });

  // Error handling
  socket.on("error", function (err) {
    console.log(err);
  });

  // User creates room or
  // User enters room (based on room availability)
  socket.on("join_room", function (data) {
    let room = data.room;
    let username = data.user.username;
    let isHost = false;
    let url = data.url;
    let playlist = [];
    let users = [];
    let host = username;
    let sid = socket.id;

    console.log(username + " asked to join");

    fetchGraphql
      .getLobbyDetails(url)
      .then((databaseData) => {
        console.log("DBDATA", JSON.stringify(databaseData));
        if (databaseData.data.lobbyInfo) {
          fetchGraphql.joinLobby(username, url, sid).then((joinData) => {
            console.log("lobby joined: " + JSON.stringify(joinData));
            if (joinData.data.joinLobby === null || joinData.data.joinLobby.name === null) {
              return;
            }
            host = joinData.data.joinLobby.host_username;
            users = joinData.data.joinLobby.others;
            playlist = joinData.data.joinLobby.playlist;
            console.log(joinData.data.joinLobby);
            socket.emit("update-playlist", {
              playlist: playlist,
            });
            socket.emit("lobby-info", {
              host: host,
              users: users,
              isHost: isHost,
            });
            socket.to(url).emit("user-join", { user: data.user }); // notify others
          });
        } else {
          fetchGraphql
            .makeLobby(room, socket.id, username, "PRIVATE", 4, url)
            .then((createData) => {
              console.log("lobby created: " + JSON.stringify(createData));
              databaseData = createData;
              socket.emit("lobby-info", {
                host: host,
                users: users,
                isHost: isHost,
              });
              socket.to(url).emit("user-join", { user: data.user }); // notify others
            });
          isHost = true;
        }

        console.log(socket.id, "is now in", url);
        socket.join(url);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });

  // User leaves room
  socket.on("user-leave-lobby", function (data, callback) {
    let room = data.room;
    let username = data.username;

    fetchGraphql.leaveLobby(username, room).then((leaveData) => {
      console.log("lobby left: " + JSON.stringify(leaveData));
      if (leaveData.data.leaveLobby === null) {
        // lobby is now empty and deleted
        return;
      }
      let host = leaveData.data.leaveLobby.host_username;
      let users = leaveData.data.leaveLobby.others;
      socket.to(room).emit("lobby-info", {
        host: host,
        users: users,
        isHost: host === username,
      });
      socket.leave(room);
      socket.to(room).emit("user-leave", {
        user: username,
      });
      socket.disconnect();
    });
  });

  // User sends message in room
  socket.on("SendNewMessage", function (data, callback) {
    let url = data.url;
    io.sockets.in(url).emit("GetNewMessage", {
      msg: data.message,
      user: data.username,
      datetime: data.datetime,
    });
  });

  // get host played time
  socket.on("sync-to-host", function (data) {
    let url = data.url;
    let roomHost = "";

    fetchGraphql.getLobbyDetails(url).then((dbData) => {
      console.log(JSON.stringify(dbData));
      if (dbData.data) {
        roomHost = dbData.data.lobbyInfo.host_id;
      }
      console.log("Socket #: " + socket.id + " asked to sync");
      console.log(roomHost);
      io.to(`${roomHost}`).emit("host-location", {
        userSocket: socket.id,
      });
    });
  });

  // send host played time
  socket.on("host-sync", function (data) {
    console.log("Synced to host at seconds: " + data.playedSeconds);
    io.to(`${data.userSocket}`).emit("get-host-location", {
      playedSeconds: data.playedSeconds,
    });
  });

  // Video Controls
  // Host plays video
  socket.on("play_video", function (data) {
    // console.log(data);
    console.log(socket.id, "playing at", data.playedSeconds);
    io.in(data.room).emit("host-play", {
      url: data.video_url,
      playedSeconds: data.playedSeconds,
    });
  });
  // Host pauses video
  socket.on("pause_video", function (data) {
    console.log(data);
    console.log(socket.id, "paused at", data.playedSeconds);
    io.in(data.url).emit("host-pause", { playedSeconds: data.playedSeconds });
  });
  // Host seeks in video
  socket.on("seek_video", function (data) {
    console.log(socket.id, "seeked to", data);
    io.in(data.url).emit("get-host-location", {
      playedSeconds: data.playedSeconds,
    });
  });

  // Playlist Controls
  // Add
  socket.on("add-to-playlist", function (data) {
    // console.log("BEFORE:", data);

    fetchGraphql.addToPlaylist(data.room, data.url).then((response) => {
      // console.log("AFTER: ", response);
      io.in(data.room).emit("update-playlist", {
        playlist: response.data.addToPlaylist,
      });
    });
  });

  //Remove
  socket.on("remove-from-playlist", function (data) {
    // console.log("DATA FROM FE: ", data);
    fetchGraphql.removeFromPlaylist(data.room, data.url).then((response) => {
      // console.log("AFTER: ", response);
      io.in(data.room).emit("update-playlist", {
        playlist: response.data.removeFromPlaylist,
      });
    });
  });
});

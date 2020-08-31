const { gql } = require("apollo-server");

const typeDefs = gql`
  # Main Server Interaction:
  type Query {
    userStatus: Status
    currentUser: User
    userInfo(username: String!): User
    myInfo: User
    lobbyInfo(url: String!): Lobby
    isLoggedIn: Boolean!
    publicLobbies(after: String, categories: [Category]!): PublicLobbiesResponse!
    getFriends(username: String, after: String): GetFriendsResponse!
  }

  type Mutation {
    register(
      username: String
      first_name: String
      last_name: String
      email: EmailAddress
      password: String
    ): UserRegistrationResponse
    login(username: String, password: String): LoginResponse # login token
    createLobby(
      name: String
      categories: [String]
      url: String
      host_id: String
      host_username: String
      access: String
      limit: Int
      playlist: [String]
      others: [String]
    ): Lobby
    joinLobby(url: String, username: String, sid: String): Lobby
    leaveLobby(url: String, username: String): Lobby
    # addToPlaylist(url: String): [URL]!
    # removeFromPlaylist(url: String): [URL]!
    deleteLobby(id: String): Lobby
    deleteUser(id: String): User
    addToPlaylist(lobby_url: String, video_url: URL): [URL]
    removeFromPlaylist(lobby_url: String, video_url: URL): [URL]
    logout: Boolean
    updateProfile(email: EmailAddress, password: String): User
    addFriend(username: String): Boolean
    removeFriend(username: String): Boolean
  }

  # Datatypes
  # User Stuff
  type User {
    id: ID!
    username: String!
    first_name: String!
    last_name: String!
    email: String!
    friends: [String]!
  }

  type Status {
    loggedIn: Boolean!
    currentUser: User
  }

  # Lobby Stuff
  type Lobby {
    id: ID # Lobby ID
    name: String # Lobby Name
    host_id: String # Host ID
    host_username: String # Host ID
    url: String # URL ending of lobby
    limit: Int # Max participants
    others: [String] # List of user IDs
    categories: [String]
    access: Lobby_Access
    playlist: [URL]
  }

  enum Category {
    SPORTS
    VIDEOGAMES
    POLITICS
    JUSTCHATTING
    CELEBRITY
    MUSIC
  }

  enum Lobby_Access {
    PUBLIC
    PRIVATE
  }

  enum Lobby_Roles {
    HOST
    PRESENTER
    MEMBER
  }

  enum AuthenticationErrorMessages {
    username
    email
    password
  }

  # Responses
  type UserRegistrationResponse {
    user: User
    errors: [AuthenticationErrorMessages]!
  }

  type LoginResponse {
    token: String
    user: User
    errors: [AuthenticationErrorMessages]!
  }

  type PublicLobbiesResponse {
    cursor: String
    hasMore: Boolean!
    lobbies: [Lobby]!
  }

  type GetFriendsResponse {
    cursor: String
    hasMore: Boolean!
    friends: [String]!
  }

  # Custom Types
  scalar DateTime
  scalar EmailAddress
  scalar URL
`;

module.exports = typeDefs;

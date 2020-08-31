# Crewtube API

## Queries

**userStatus: Status**

Description: loggedIn tells us if the current user is logger in or not, where currentUser is the object for that currentUser

**currentUser: User**

Description: Gets all user info for the current user.

**userInfo(username: String!): User**

Description: Gets all user info for a user with a given name.

**myInfo: User**

Description: Gets all user info for the current logged in user.

**lobbyInfo(id: ID!): Lobby**

Description: Gets all lobby info for a lobby with a given ID.

**isLoggedIn: Boolean!**

Description: Tells us if the current user is logged in.

**publicLobbies(after: String, categories: [Category]!): PublicLobbiesResponse!**

Description: Gives a list of public lobbies that contain any of the given categories. True if query was successful, false if not.
**getFriends(username: String, after: String)): GetFriendsResponse!**

Description: Gives a list of all friends of a given user. True if query was sucessful, false otherwise.

## Mutations

**register(username: String, first_name: String, last_name: String, email: EmailAddress, password: String): UserRegistrationResponse**

Description: Adds a new user, true if successful, false otherwise.

**login(username: String, password: String): LoginResponse**

Description: Logs the user into the account with given username and password. True if successful, false otherwise.

**createLobby(name: String, categories: [String]!, url_id: String): Lobby**

Description: Creates a lobby with given name, a list of categories for querying, and the url for later access.

**joinLobby(id: string): Lobby**

Description: Joins and navigates to a lobby with a given id.

**leaveLobby(id: String): Lobby**

Description: User leaves the lobby with the given Id if they're part of it.

**deleteLobby(id: String): Lobby**

Description: Delete lobby with given id from the database

**deleteUser(id: String): User**

Description: Delete user with give id from the database

**logout: Boolean**

Description: log the current user out. True if successful, false otherwise.

**updateProfile(email: EmailAddress, password: String): User**

Description: Updates the email and password of the current user to the given email and password. Returns a user object with updated data.

**addFriend(username: String): Boolean**

Description: Adds a user with given username to the current user's friend list. True if successful, false otherwise.

**removeFriend(username: String): Boolean**

Description: Adds a user with given username to the current user's friend list. True if successful, false otherwise.

## Schema
### User Stuff
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

### Lobby Stuff
type Lobby {

    id: ID # Lobby ID
    
    name: String # Lobby Name
    
    host: String # Host ID
    
    url: String # URL ending of lobby
    
    limit: Int # Max participants
    
    others: [String] # List of user IDs
    
    access: Lobby_Access
    
    categories: [Category]
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

### Responses
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

### Custom Types

  scalar DateTime
  
  scalar EmailAddress
  
  scalar URL
  
`;

##How the app works

Crewtube uses GraphQL, Apollo, React and socket.io to implement an application that allows you to share youtube media synchronized between your friends while you video/text chat.
youtube link: https://youtu.be/TtAvPYAC3vw
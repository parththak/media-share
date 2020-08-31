require("dotenv").config();
// const gql = gql_tag.gql;
const fetch = require("node-fetch");

const URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:4000/graphql"
    : process.env.CLIENT_URL + "graphql";

const credentials = "include";
const mode = "same-origin";

// const FETCH_OPTS_QUERY = {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ query: "INSERT QUERY HERE" }),
// };

// const FETCH_OPTS_MUTATION = {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ query: "INSERT MUTATION HERE" }),
// };

// Reference: https://moonhighway.com/fetching-data-from-a-graphql-api

const GET_LOBBY_DETAILS = `
  query getLobbyDetails($url: String!) {
    lobbyInfo(url: $url) {
      name
      url
      host_id
      host_username
      limit
      others
      categories
      access
      playlist
    }
  }
`;

const CREATE_LOBBY = `
  mutation newLobby(
    $name: String
    $access: String
    $host_id: String
    $host_username: String
    $limit: Int
    $url:String
    $playlist: [String]
    $others: [String]
    $categories: [String]
  ) {
    createLobby(
      name: $name
      access: $access
      host_id: $host_id
      host_username: $host_username
      limit: $limit
      url: $url
      playlist: $playlist
      others: $others
      categories: $categories
    ) {
      name
      host_id
      host_username
      limit
      others
      access
      url
      playlist
      categories
    }
  }
`;

const JOIN_LOBBY = `
  mutation addUserLobby($lobby_url: String, $username: String, $sid: String) {
    joinLobby(url: $lobby_url, username: $username, sid: $sid) {
      name
      host_id
      host_username
      limit
      others
      access
      url
      playlist
    }
  }
`;

const LEAVE_LOBBY = `
  mutation leaveLobby($lobby_url: String, $username: String) {
    leaveLobby(url: $lobby_url, username: $username) {
      name
      host_id
      host_username
      others
    }
  }
`;

const ADD_TO_PLAYLIST = `
  mutation addVideo($lobby_url: String, $video_url: URL) {
    addToPlaylist(lobby_url: $lobby_url, video_url: $video_url)
  }
`;

const REMOVE_FROM_PLAYLIST = `
  mutation removeVideo($lobby_url: String, $video_url: URL) {
    removeFromPlaylist(lobby_url: $lobby_url, video_url: $video_url)
  }
`;

async function makeLobby(
  name,
  host_id,
  host_username,
  access,
  limit,
  url,
  others = [],
  playlist = [],
  categories = []
) {
  
  const response = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials,
    mode,
    body: JSON.stringify({
      query: CREATE_LOBBY,
      variables: {
        name,
        access,
        host_id,
        host_username,
        limit,
        url,
        others,
        playlist,
        categories,
      },
    }),
  });

  return response.json();
}

async function getLobbyDetails(url) {
  const response = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials,
    mode,
    body: JSON.stringify({
      query: GET_LOBBY_DETAILS,
      variables: { url },
    }),
  });

  return response.json();
}

async function joinLobby(username, lobby_url, sid) {
  const response = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials,
    mode,
    body: JSON.stringify({
      query: JOIN_LOBBY,
      variables: { username, lobby_url, sid },
    }),
  });

  return response.json();
}

async function leaveLobby(username, lobby_url) {
  const response = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials,
    mode,
    body: JSON.stringify({
      query: LEAVE_LOBBY,
      variables: { username, lobby_url },
    }),
  });

  return response.json();
}

async function addToPlaylist(lobby_url, video_url) {
  const response = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials,
    mode,
    body: JSON.stringify({
      query: ADD_TO_PLAYLIST,
      variables: { lobby_url, video_url },
    }),
  });

  return response.json();
}

async function removeFromPlaylist(lobby_url, video_url) {
  const response = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials,
    mode,
    body: JSON.stringify({
      query: REMOVE_FROM_PLAYLIST,
      variables: { lobby_url, video_url },
    }),
  });

  return response.json();
}

module.exports = {
  makeLobby,
  getLobbyDetails,
  joinLobby,
  leaveLobby,
  addToPlaylist,
  removeFromPlaylist,
};

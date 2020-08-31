import React from "react";
import ReactDOM from "react-dom";
import "./client/style/index.css";
import App from "./client/js/App";
import * as serviceWorker from "./client/js/serviceWorker";

import { ApolloClient, HttpLink, gql } from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider, useQuery } from "react-apollo";

const cache = new InMemoryCache();
cache.addTypename = false;

let uri =
  process.env.REACT_APP_NODE_ENV === "development" ||
  process.env.REACT_APP_NODE_ENV !== undefined
    ? "http://localhost:4000/graphql"
    : `https://crewtube.herokuapp.com/graphql`;

const link = new HttpLink({
  uri,
  credentials: "include",
  headers: {
    "client-name": "Crewtube [web]",
    "client-version": "1.0.0"
  }
});

const client = new ApolloClient({
  cache,
  link,
  credentials: "include",
  resolvers: {}
});

// Init cache
const init_data = {
  isLoggedIn: false,
  currentUser: null
};

const USER_STATUS = gql`
  query userStatus {
    isLoggedIn
    currentUser {
      id
      username
    }
  }
`;

// populate cache with current user logged in status on page loading
client.query({ query: USER_STATUS, fetchPolicy: "network-only" }).then(data => {
  // console.log(data);
  if (data.data === null) {
    cache.writeData({ data: init_data });
  } else {
    let user_data = init_data;
    user_data.isLoggedIn = data.data.isLoggedIn;
    user_data.currentUser = data.data.currentUser;
    cache.writeData({ data: user_data });
  }
});

function HomePage() {
  let logged_in_status = false;
  let user = null;

  const { data } = useQuery(USER_STATUS, { fetchPolicy: "cache-only" });
  // console.log(data);

  if (typeof data !== "undefined") {
    logged_in_status = data.isLoggedIn;
    user = data.currentUser;
  } else {
    cache.writeData({ data: init_data });
  }
  return <App loggedIn={logged_in_status} current_user={user} key={1000} />;
}

ReactDOM.render(
  <ApolloProvider client={client} key={1001}>
    <HomePage key={1002} />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

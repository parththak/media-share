import React from "react";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";

import LoginForm from "../components/login-form";

const LOGIN_QUERY = gql`
  mutation loginUser($username: String, $password: String) {
    login(username: $username, password: $password) {
      user {
        id
        username
        first_name
        last_name
        email
        friends
      }
      token
      errors
    }
  }
`;

export default function Login() {
  const client = useApolloClient();
  const [login, { loading, error, data }] = useMutation(LOGIN_QUERY, {
    onCompleted({ login }) {
      if (login.user !== null) {
        // successful
        client.writeData({
          data: { isLoggedIn: true, currentUser: login.user }
        });
        // client.reFetchObservableQueries();
      }
    }
  });

  if (loading) {
    return null;
  }
  if (error) {
    console.error(error);
  }
  if (data) {
    console.log(
      data.login.errors.length === 0 ? "Logged in!" : data.login.errors[0]
    );
  }

  return <LoginForm login={login} />;
}

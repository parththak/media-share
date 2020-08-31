import React from "react";

import { useMutation, useApolloClient } from "@apollo/react-hooks";
import "../../style/header.css";
import gql from "graphql-tag";

const LOGOUT_QUERY = gql`
  mutation logoutUser {
    logout
  }
`;

export default function LogoutButton() {
  const [logout] = useMutation(LOGOUT_QUERY);
  const client = useApolloClient();

  return (
    <div
      className="btn noselect"
      onClick={async () => {
        logout();
        client.writeData({
          data: {
            isLoggedIn: false,
            currentUser: null
          }
        });
      }}
    >
      Logout
    </div>
  );
}

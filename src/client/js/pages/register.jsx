import React from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import SignupForm from "../components/signup-form";

const REGISTER_QUERY = gql`
  mutation createNewUser(
    $username: String
    $first_name: String
    $last_name: String
    $email: EmailAddress
    $password: String
  ) {
    register(
      username: $username
      first_name: $first_name
      last_name: $last_name
      email: $email
      password: $password
    ) {
      user {
        id
        username
        first_name
        last_name
        email
        friends
      }
      errors
    }
  }
`;

export default function Register() {
  const [signup, { loading, error, data }] = useMutation(REGISTER_QUERY, {
    onCompleted({signup}) {
    }
  });

  if (loading) {
    return null;
  }
  if (error) {
    console.error(error);
  }
  if (data) {
    console.log(data.register.errors.length === 0 ? "Signed Up!" : data.register.errors[0])
  }

  return <SignupForm register={signup} />;
}

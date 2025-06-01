import { gql } from "@apollo/client";

export const CREATE_MESSAGE = gql`
  mutation CreateMessage(
    $message: String!
    $password: String
    $email: String
    $display: Int!
  ) {
    createMessage(
      message: $message
      password: $password
      email: $email
      display: $display
    ) {
      id
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: ID!) {
    deleteMessage(id: $id) {
      message
    }
  }
`;
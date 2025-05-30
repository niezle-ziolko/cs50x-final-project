import { gql } from "@apollo/client";

export const GET_MESSAGE = gql`
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
      message
    }
  }
`;
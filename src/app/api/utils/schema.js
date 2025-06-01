export const typeDefs = `
  type MessageResponse {
    message: String!
  }

  type IdResponse {
    id: String!
  }

  type Query {
    getMessage(id: ID!): MessageResponse
  }

  type Mutation {
    createMessage(
      message: String!
      password: String
      email: String
      display: Int
    ): IdResponse

    deleteMessage(id: ID!): MessageResponse
  }
`;
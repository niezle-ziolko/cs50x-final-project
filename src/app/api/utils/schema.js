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
    deleteMessage(id: ID!): MessageResponse
    verifyPassword(id: String!, password: String!): MessageResponse!
    createMessage(message: String!, password: String, email: String, display: Int): IdResponse
  }
`;
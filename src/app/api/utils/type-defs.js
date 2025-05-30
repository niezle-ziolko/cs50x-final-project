export const typeDefs = `
  type Message {
    id: ID!
    message: String!
    password: String
    email: String
    display: Int!
    seen: Int!
  }

  type Query {
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(
      message: String!
      password: String
      email: String
      display: Int!
      seen: Int!
    ): Message

    deleteMessage(id: ID!): Boolean!
  }
`;
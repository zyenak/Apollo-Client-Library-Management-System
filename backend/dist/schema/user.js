export const userTypeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    password: String!
    role: String!
    borrowedBooks: [Book!]
  }

  input CreateUserInput {
    username: String!
    password: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    id: String!
    username: String!
    role: String!
  }

  type Query {
    users: [User!]
    user(id: ID!): User
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    deleteUser(id: ID!): User
    loginUser(username: String!, password: String!): AuthPayload
    borrowBook(userId: ID!, isbn: String!): User
    returnBook(userId: ID!, isbn: String!): User
  }
`;

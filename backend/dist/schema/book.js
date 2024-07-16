export const bookTypeDefs = `#graphql
  type Book {
    isbn: String!
    name: String!
    category: String!
    price: Float!
    quantity: Int!
  }

  input CreateBookInput {
    isbn: String!
    name: String!
    category: String!
    price: Float!
    quantity: Int!
  }

  input UpdateBookInput {
    name: String
    category: String
    price: Float
    quantity: Int
  }

  type Query {
    books: [Book!]
    book(isbn: String!): Book
  }

  type Mutation {
    addBook(input: CreateBookInput!): Book
    updateBook(isbn: String!, input: UpdateBookInput!): Book
    deleteBook(isbn: String!): Book
  }
`;

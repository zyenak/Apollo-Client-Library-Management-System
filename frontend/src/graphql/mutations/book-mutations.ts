import { gql } from '@apollo/client';

export const ADD_BOOK = gql`
  mutation AddBook($input: CreateBookInput!) {
    addBook(input: $input) {
      isbn
      name
      category
      price
      quantity
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($isbn: String!, $input: UpdateBookInput!) {
    updateBook(isbn: $isbn, input: $input) {
      isbn
      name
      category
      price
      quantity
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($isbn: String!) {
    deleteBook(isbn: $isbn) {
      isbn
      name
    }
  }
`;

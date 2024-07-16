import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
  query GetBooks {
    books {
      isbn
      name
      category
      price
      quantity
    }
  }
`;

export const GET_BOOK = gql`
  query GetBook($isbn: String!) {
    book(isbn: $isbn) {
      isbn
      name
      category
      price
      quantity
    }
  }
`;

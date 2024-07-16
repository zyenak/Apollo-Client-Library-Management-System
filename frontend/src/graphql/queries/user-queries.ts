import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      role
      borrowedBooks {
        isbn
        name
        category
        price
        quantity
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      username
      role
      borrowedBooks {
        isbn
        name
        category
        price
        quantity
      }
    }
  }
`;

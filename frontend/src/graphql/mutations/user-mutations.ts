import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      role
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      username
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
        token
        id
    }
  }
`;

export const BORROW_BOOK = gql`
  mutation BorrowBook($userId: ID!, $isbn: String!) {
    borrowBook(userId: $userId, isbn: $isbn) {
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

export const RETURN_BOOK = gql`
  mutation ReturnBook($userId: ID!, $isbn: String!) {
    returnBook(userId: $userId, isbn: $isbn) {
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

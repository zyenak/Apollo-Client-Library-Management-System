import { gql } from '@apollo/client';

export const BOOK_ADDED = gql`
  subscription BookAdded {
    bookAdded {
      isbn
      name
      category
      price
      quantity
    }
  }
`;
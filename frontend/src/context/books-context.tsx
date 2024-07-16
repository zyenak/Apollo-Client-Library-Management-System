import React, { createContext, useState, useEffect, FC, ReactNode } from 'react';
import { useSnackbar } from './snackbar-context';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOOKS } from '../graphql/queries/book-queries';
import { UPDATE_BOOK, ADD_BOOK, DELETE_BOOK } from '../graphql/mutations/book-mutations';

export interface Book {
  isbn: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface BooksContextType {
  books: Book[];
  fetchBooks: () => void;
  addBook: (newBook: Book) => void;
  updateBook: (updatedBook: Book) => void;
  deleteBook: (isbn: string) => void;
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

export const BooksContext = createContext<BooksContextType>({
  books: [],
  fetchBooks: () => { },
  addBook: () => { },
  updateBook: () => { },
  deleteBook: () => { },
  setBooks: () => { },
});

export const BooksProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { showMessage } = useSnackbar();
  const { loading, data, refetch } = useQuery(GET_BOOKS);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    console.log(loading, data)
    if (!loading && data) {
      setBooks(data.books);
    }
  }, [loading, data]);

  const [addBookMutation] = useMutation(ADD_BOOK, {
    onError: (error) => {
      console.error('Failed to add book', error);
    },
    onCompleted: () => {
      showMessage('New Book Added Successfully');
      refetch();
    },
  });

  const [updateBookMutation] = useMutation(UPDATE_BOOK, {
    onError: (error) => {
      console.error('Failed to update book', error);
    },
    onCompleted: () => {
      showMessage('Book Updated Successfully');
      refetch();
    },
  });

  const [deleteBookMutation] = useMutation(DELETE_BOOK, {
    onError: (error) => {
      console.error('Failed to delete book', error);
      showMessage('Book Deletion Unsuccessful');
    },
    onCompleted: () => {
      showMessage('Book Deleted Successfully');
      refetch();
    },
  });

  const fetchBooks = () => {
    refetch();
  };

  const addBook = async (newBook: Book) => {
    try {
      await addBookMutation({
        variables: {
          input: {
            isbn: newBook.isbn,
            name: newBook.name,
            category: newBook.category,
            price: parseInt(newBook.price.toString()),
            quantity: parseInt(newBook.quantity.toString()),
          },
        },
      });
    } catch (error) {
      console.error('Failed to add book', error);
    }
  };

  const updateBook = async (updatedBook: Book) => {
    try {
      await updateBookMutation({
        variables: {
          isbn: updatedBook.isbn,
          input: {
            name: updatedBook.name,
            category: updatedBook.category,
            price: parseInt(updatedBook.price.toString()),
            quantity: parseInt(updatedBook.quantity.toString()),
          }
        }
      });
    } catch (error) {
      console.error('Failed to update book', error);
    }
  };
  const deleteBook = async (isbn: string) => {
    try {
      await deleteBookMutation({ variables: { isbn } });
    } catch (error) {
      console.error('Failed to delete book', error);
    }
  };

  const contextValue: BooksContextType = {
    books,
    fetchBooks,
    addBook,
    updateBook,
    deleteBook,
    setBooks,
  };

  return <BooksContext.Provider value={contextValue}>{children}</BooksContext.Provider>;
};

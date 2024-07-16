import React, { createContext, useState, useEffect, FC, ReactNode } from 'react';
import { useSnackbar } from './snackbar-context';
import { useGqlQuery } from '../hooks/useGqlQuery';
import { GET_BOOKS } from '../graphql/queries/book-queries';
import { ADD_BOOK, UPDATE_BOOK, DELETE_BOOK } from '../graphql/mutations/book-mutations';

export interface Book {
  isbn: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}
export type BookUpdateInput = Omit<Book, 'isbn'>;

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
  fetchBooks: () => {},
  addBook: () => {},
  updateBook: () => {},
  deleteBook: () => {},
  setBooks: () => {},
});

export const BooksProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { showMessage } = useSnackbar();

  const { data: booksData, loading: booksLoading, save: saveBookMutation, refetch: refetchBooks } = useGqlQuery<{ books: Book[] }, { input: Book }>({
    query: GET_BOOKS,
    mutation: ADD_BOOK,
  });

  const { save: updateBookMutation } = useGqlQuery<{ books: Book[] }, { isbn: string; input: BookUpdateInput }>({
    query: GET_BOOKS,
    mutation: UPDATE_BOOK,
  });

  const { save: deleteBookMutation } = useGqlQuery<{ books: Book[] }, { isbn: string }>({
    query: GET_BOOKS,
    mutation: DELETE_BOOK,
  });

  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (booksData) {
      console.log("booksData:", booksData);
      setBooks(booksData.books);
    }
  }, [booksData]);

  const fetchBooks = () => {
    refetchBooks();
  };

  const addBook = async (newBook: Book) => {
    try {
      await saveBookMutation({
        input: {
          isbn: newBook.isbn,
          name: newBook.name,
          category: newBook.category,
          price: newBook.price,
          quantity: newBook.quantity,
        },
      });
      fetchBooks();
      showMessage('New Book Added Successfully');
    } catch (error) {
      console.error('Failed to add book', error);
    }
  };

  const updateBook = async (updatedBook: Book) => {
    try {
      await updateBookMutation({
        isbn: updatedBook.isbn,
        input: {
          name: updatedBook.name,
          category: updatedBook.category,
          price: updatedBook.price,
          quantity: updatedBook.quantity,
        },
      });
      fetchBooks();
      showMessage('Book Updated Successfully');
    } catch (error) {
      console.error('Failed to update book', error);
    }
  };

  const deleteBook = async (isbn: string) => {
    try {
      await deleteBookMutation({ isbn });
      fetchBooks();
      showMessage('Book Deleted Successfully');
    } catch (error) {
      console.error('Failed to delete book', error);
      showMessage('Book Deletion Unsuccessful');
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

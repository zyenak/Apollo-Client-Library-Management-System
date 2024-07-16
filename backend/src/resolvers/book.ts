import { Book as BookModel } from '../models/index.js';
import { CreateBookInput, UpdateBookInput, Context } from '../types/types';

export const bookResolvers = {
  Query: {
    books: async () => {
      return await BookModel.findAll();
    },
    book: async (_: any, { isbn }: { isbn: string }) => {
      return await BookModel.findByPk(isbn);
    },
  },
  Mutation: {
    addBook: async (_: any, { input }: { input: CreateBookInput }, { currentUser }: Context) => {
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Not authorized');
      }
      const newBook = await BookModel.create(input);
      return newBook;
    },
    updateBook: async (_: any, { isbn, input }: { isbn: string; input: UpdateBookInput }, { currentUser }: Context) => {
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Not authorized');
      }
      const book = await BookModel.findByPk(isbn);
      if (!book) {
        throw new Error('Book not found');
      }
      await book.update(input);
      return book;
    },
    deleteBook: async (_: any, { isbn }: { isbn: string }, { currentUser }: Context) => {
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Not authorized');
      }
      const book = await BookModel.findByPk(isbn);
      if (!book) {
        throw new Error('Book not found');
      }
      await book.destroy();
      return book;
    },
  },
};

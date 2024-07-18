import { PubSub } from 'graphql-subscriptions';
import { Book as BookModel } from '../models/index.js';
const pubsub = new PubSub();
export const bookResolvers = {
    Query: {
        books: async () => {
            return await BookModel.findAll();
        },
        book: async (_, { isbn }) => {
            return await BookModel.findByPk(isbn);
        },
    },
    Mutation: {
        addBook: async (_, { input }, { currentUser }) => {
            if (!currentUser || currentUser.role !== 'admin') {
                throw new Error('Not authorized');
            }
            const newBook = await BookModel.create(input);
            pubsub.publish('BOOK_ADDED', { bookAdded: newBook });
            return newBook;
        },
        updateBook: async (_, { isbn, input }, { currentUser }) => {
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
        deleteBook: async (_, { isbn }, { currentUser }) => {
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
    Subscription: {
        bookAdded: {
            // subscribe: async (_: any, __: any) => {
            //   // if (!currentUser) {
            //   //   throw new Error('Not authorized');
            //   // }
            //   console.log('Subscribing to BOOK_ADDED');
            //   const asyncIterator = await pubsub.asyncIterator(['BOOK_ADDED']);
            //   console.log('Async Iterator:', asyncIterator);
            //   return asyncIterator;
            // },
            // bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
            // },
        },
    },
};

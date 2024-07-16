import { User } from './user.js';
import Book from './book.js';
// Define associations
User.belongsToMany(Book, { through: 'UserBooks', as: 'borrowedBooks' });
Book.belongsToMany(User, { through: 'UserBooks' });
export { User, Book };

import { User as UserModel, Book as BookModel } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const userResolvers = {
    Query: {
        users: async (_, __, { currentUser }) => {
            if (!currentUser || currentUser.role !== 'admin') {
                throw new Error('Not authenticated');
            }
            return await UserModel.findAll({
                include: [{ model: BookModel, as: 'borrowedBooks' }],
            });
        },
        user: async (_, { id }, { currentUser }) => {
            if (!currentUser) {
                throw new Error('Not authenticated');
            }
            return await UserModel.findByPk(id, {
                include: [{ model: BookModel, as: 'borrowedBooks' }],
            });
        },
    },
    Mutation: {
        createUser: async (_, { input }) => {
            const hashedPassword = await bcrypt.hash(input.password, 10);
            const newUser = await UserModel.create(Object.assign(Object.assign({}, input), { password: hashedPassword }));
            return newUser;
        },
        deleteUser: async (_, { id }, { currentUser }) => {
            if (!currentUser || currentUser.role !== 'admin') {
                throw new Error('Not authenticated');
            }
            const user = await UserModel.findByPk(id);
            if (!user)
                return null;
            await user.destroy();
            return user;
        },
        loginUser: async (_, { username, password }) => {
            const user = await UserModel.findOne({ where: { username } });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new Error('Invalid credentials');
            }
            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            // Optionally fetch borrowedBooks for the user
            const userlogin = await UserModel.findByPk(user.id, {
                include: [{ model: BookModel, as: 'borrowedBooks' }],
            });
            return {
                token,
                id: user.id,
                username: user.username,
                role: user.role
            };
        },
        borrowBook: async (_, { userId, isbn }, { currentUser }) => {
            if (!currentUser) {
                throw new Error('Not authenticated');
            }
            const user = await UserModel.findByPk(userId);
            const book = await BookModel.findByPk(isbn);
            if (!user || !book) {
                throw new Error('User or book not found');
            }
            await user.addBorrowedBook(book);
            book.quantity -= 1;
            await book.save();
            return user;
        },
        returnBook: async (_, { userId, isbn }, { currentUser }) => {
            if (!currentUser) {
                throw new Error('Not authenticated');
            }
            const user = await UserModel.findByPk(userId);
            const book = await BookModel.findByPk(isbn);
            if (!user || !book) {
                throw new Error('User or book not found');
            }
            await user.removeBorrowedBook(book);
            book.quantity += 1;
            await book.save();
            return user;
        },
    },
};

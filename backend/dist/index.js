import dotenv from 'dotenv';
dotenv.config();
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServer } from '@apollo/server';
import { typeDefs } from './schema/index.js';
import { resolvers } from './resolvers/index.js';
import sequelize from './config/db.js';
import jwt from 'jsonwebtoken';
import { User as UserModel } from './models/index.js';
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');
        let currentUser = null;
        if (token) {
            try {
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "JWT_SECRET");
                const user = await UserModel.findByPk(decodedToken.userId);
                if (user) {
                    currentUser = user.get({ plain: true });
                }
            }
            catch (err) {
                console.error('Invalid token', err);
            }
        }
        return { currentUser };
    },
    listen: { port: 4000 },
});
sequelize.authenticate().then(() => {
    console.log('Database connected');
    sequelize.sync();
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});
console.log(`🚀  Server ready at: ${url}`);

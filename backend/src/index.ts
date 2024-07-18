import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './schema/index.js';
import { resolvers } from './resolvers/index.js';
import sequelize from './config/db.js';
import jwt from 'jsonwebtoken';
import { User as UserModel } from './models/index.js';
import { Context, User } from './types/types';
import { PubSub } from 'graphql-subscriptions';


const pubsub = new PubSub();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

console.log(schema);

(async function () {

  const app = express();
  const httpServer = createServer(app);


  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/subscription',
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx, msg, args) => {
        const authHeader = ctx.connectionParams?.authentication || '';
        console.log("Auth: ", authHeader)
        const token = authHeader
     
        // let currentUser: User | null = null;

        // if (token) {
        //   try {
        //     const decodedToken = jwt.verify(token, process.env.JWT_SECRET! || 'JWT_SECRET') as { userId: string };
        //     const user = await UserModel.findByPk(decodedToken.userId);
        //     if (user) {
        //       currentUser = user.get({ plain: true }) as User;
        //     }
        //   } catch (err) {
        //     console.error('Invalid token', err);
        //   }
        // }

        return { pubsub };
      },
    },
    wsServer
  );

  const server = new ApolloServer<Context>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');
        let currentUser: User | null = null;

        if (token) {
          try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET! || 'JWT_SECRET') as { userId: string };
            const user = await UserModel.findByPk(decodedToken.userId);
            if (user) {
              currentUser = user.get({ plain: true }) as User;
            }
          } catch (err) {
            console.error('Invalid token', err);
          }
        }

        return { currentUser, pubsub };
      },
    })
  );

  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);

  sequelize.authenticate().then(() => {
    console.log('Database connected');
    sequelize.sync();
  }).catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
})();

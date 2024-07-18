import { userResolvers } from "./user.js";
import { bookResolvers } from "./book.js";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...bookResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...bookResolvers.Mutation,
  },
  Subscription: {
    ...bookResolvers.Subscription, 
  },
};

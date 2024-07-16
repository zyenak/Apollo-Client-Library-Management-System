import { userResolvers } from "./user.js";
import { bookResolvers } from "./book.js";
export const resolvers = {
    Query: Object.assign(Object.assign({}, userResolvers.Query), bookResolvers.Query),
    Mutation: Object.assign(Object.assign({}, userResolvers.Mutation), bookResolvers.Mutation),
};

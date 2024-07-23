import { mergeTypeDefs } from "@graphql-tools/merge";
import { userTypeDefs } from "./user.js";
import { bookTypeDefs } from "./book.js";
const mergedTypeDefs = mergeTypeDefs([
    userTypeDefs,
    bookTypeDefs,
]);
export { mergedTypeDefs as typeDefs };

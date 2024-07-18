import { mergeTypeDefs } from "@graphql-tools/merge";
import { userTypeDefs } from "./user.js";
import { bookTypeDefs } from "./book.js";
// const baseTypeDefs = `#graphql
//   type Subscription {
//     _empty: String
//   }
// `;
const mergedTypeDefs = mergeTypeDefs([
    // baseTypeDefs,
    userTypeDefs,
    bookTypeDefs,
]);
export { mergedTypeDefs as typeDefs };

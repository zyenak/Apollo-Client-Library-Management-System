import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

// WebSocket link to handle subscriptions
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/subscription',
  connectionParams: {
    authentication: localStorage.getItem('token'),
  },
}));

// Authentication link to set the headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Split links, directing subscription operations to the wsLink and other operations to the httpLink
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// Apollo Client setup
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;

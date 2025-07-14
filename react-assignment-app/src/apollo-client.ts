// src/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql", // your GraphQL backend URL
});

// Set the Authorization header dynamically on each request
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Apollo client setup
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;

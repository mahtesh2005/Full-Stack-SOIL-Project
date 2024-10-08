import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { ApolloClient, InMemoryCache } from "@apollo/client";


const GRAPHQL_ENDPOINT = "ws://localhost:4000/graphql";
// Define WebSocket link
const link = new GraphQLWsLink(
    createClient({
      url: GRAPHQL_ENDPOINT,
    })
);


const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache
});

export default client;


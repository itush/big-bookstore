// src/lib/apollo-client.ts

// Purpose: Configures and exports a pre-configured Apollo Client instance.
// This instance knows how to connect to our GraphQL server endpoint (/api/graphql)
// and handles data caching. It's separated for modularity and reusability.

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Determine if running in a browser environment. This is useful for SSR configurations.
// For our current setup, it helps clarify `ssrMode`.
const isBrowser = typeof window !== 'undefined';

// Define the GraphQL endpoint. For Next.js API routes, it's a relative path.
const GRAPHQL_ENDPOINT = '/api/graphql';

// Create an HttpLink. This is how Apollo Client knows where to send GraphQL requests.
// It acts as the network interface to your GraphQL server.
const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
});

// Create an InMemoryCache instance.
// This cache stores the results of GraphQL queries in memory. Apollo Client
// uses it to optimize performance by serving data from cache when available,
// and to update UI components automatically when mutations change cached data.
const cache = new InMemoryCache();

// Create the Apollo Client instance.
const client = new ApolloClient({
  link: httpLink,   // The link defines how GraphQL operations are sent to the server.
  cache,            // The cache manages the local data store.
  // ssrMode: If true, the client is being initialized for server-side rendering.
  // This affects how the cache is hydrated and serialized. For basic client-side
  // fetching, it's typically false, but for a Next.js fullstack app, it's often true
  // on the server side to enable SSR data fetching. For our current "bare minimum"
  // client-side driven example, we'll set it based on `isBrowser`.
  ssrMode: isBrowser ? false : true,
});

export default client;
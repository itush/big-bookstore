// src/app/api/graphql/route.ts

// Purpose: This file creates a Next.js API route that acts as our GraphQL endpoint.
// It initializes an Apollo Server with our schema and resolvers, making our GraphQL API accessible.
// This version uses Apollo Server and its Next.js integration library (@as-integrations/next).

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next'; // The integration library

import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers'; // barrel import 
import dbConnect from '@/lib/mongoose';

// Define the type for the expected context object for static App Router API routes.
// For routes without dynamic parameters, `params` is an empty object.


// Create an instance of ApolloServer.
// It takes our schema (typeDefs) and resolver functions as configuration.
// You can also add plugins, data sources, and context functions here.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Apollo Server automatically provides Apollo Sandbox in development
  // when you visit the endpoint in a browser.
});

// Create the Next.js API handler from the Apollo Server instance.
// This function bridges Apollo Server's request/response handling with Next.js's API route structure.
// The `context` function here is executed for every request and can be used to pass
// request-specific data (like authentication tokens or database connections) to resolvers.
const apolloServerHandler = startServerAndCreateNextHandler(server, {
  context: async () => {
    // For now, our context is empty. Later, this is where user authentication details
    // or database client instances would be added, making them accessible to all resolvers.
    await dbConnect();
    return {};
  },
});

// Export the handler for both GET and POST requests.
// GraphQL operations are typically sent via POST, but GET is used by the Apollo Sandbox.
// export { handler as GET, handler as POST };


// Explicitly define GET and POST functions that match Next.js App Router's expected signature.
// We provide a default for 'context' to satisfy TypeScript if it might be undefined for static routes,
// but the main point is the signature matches.
export async function GET(request: Request) {
  // Pass the NextRequest object to the Apollo handler.
  // The Apollo handler will process it and return a Next.js Response.
  return apolloServerHandler(request);
}

export async function POST(request: Request) {
  return apolloServerHandler(request);
}

// Optional: Configure route segment to not use cache, which is good for APIs.
// This ensures that your API responses are always fresh and not cached by Next.js or Vercel's CDN.
export const dynamic = 'force-dynamic';
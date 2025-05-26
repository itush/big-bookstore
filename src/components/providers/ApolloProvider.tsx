// src/components/providers/ApolloProvider.tsx

// Purpose: A client component that wraps the entire application with ApolloProvider.
// This makes the Apollo Client instance available to all descendant React components,
// enabling them to use Apollo's hooks (e.g., useQuery, useMutation).
// The 'use client' directive is essential because ApolloProvider relies on client-side context.

'use client'; // This directive marks the component as a Client Component.

import { ApolloProvider as OriginalApolloProvider } from '@apollo/client';
import client from '@/lib/apollo-client'; // Our pre-configured Apollo Client instance.

// Define props for clarity and type safety.
interface ApolloProviderProps {
  children: React.ReactNode;
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  // The OriginalApolloProvider from @apollo/client takes our configured client
  // and places it into React Context, making it accessible to all components
  // rendered within its children.
  return (
    <OriginalApolloProvider client={client}>
      {children}
    </OriginalApolloProvider>
  );
}
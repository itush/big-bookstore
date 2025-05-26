// src/app/page.tsx

// Purpose: The main page of our application. For this step, it serves as a simple test
// to verify Apollo Client's connection to the GraphQL server by fetching and displaying books.
// This page is a Server Component by default, but we will render a Client Component inside it.

// Import necessary modules for a Client Component.
'use client'; // Mark this file as a Client Component, as it uses React hooks.

import { gql, useQuery } from '@apollo/client';

// Define the GraphQL query to fetch books.
// We're requesting the 'id', 'title', and the nested 'author's 'name'.
const GET_BOOKS_TEST_QUERY = gql`
  query GetBooksTest {
    books {
      id
      title
      author {
        name
      }
    }
  }
`;

// Define an interface for the Book type, matching our GraphQL schema.
interface Book {
  id: string;
  title: string;
  author: {
    name: string;
  } | null; // Author can be null as per our schema
}

export default function Home() {
  // Use the useQuery hook from Apollo Client to execute the GraphQL query.
  // It returns `loading`, `error`, and `data` states.
  const { loading, error, data } = useQuery<{ books: Book[] }>(GET_BOOKS_TEST_QUERY);

  // Render different states based on the query status.
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
        <p className="text-gray-700 text-lg">Loading books...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
        <p className="text-red-500 text-lg">Error loading books: {error.message}</p>
      </main>
    );
  }

  // If data is successfully loaded, display it.
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Books from GraphQL API</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Available Books:</h2>
        <ul className="list-disc pl-5 space-y-2">
          {data?.books.map((book) => (
            <li key={book.id} className="text-gray-600">
              <span className="font-medium">{book.title}</span> by{' '}
              <span className="italic">{book.author ? book.author.name : 'Unknown Author'}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
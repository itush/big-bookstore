// src/components/books/BookList.tsx

// Purpose: Displays a list of books fetched from our GraphQL API.
// It demonstrates using Apollo Client's useQuery hook for data fetching
// and rendering the results.
// This component needs to be a client component because it uses Apollo hooks.

'use client'; // This directive marks the component as a Client Component.

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link'; // To link to author detail pages

// Define the GraphQL query using gql tag.
// We are asking for all books, and for each book, its ID, title, and its author's name and ID.
// This directly demonstrates the nested query capability!
export const GET_BOOKS_QUERY = gql`
  query GetBooks {
    books {
      id
      title
      author { # Nested field!
        id
        name
      }
    }
  }
`;

// Define interfaces for type safety, matching our GraphQL schema.
interface Book {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  } | null; // Author can be null if not found
}

export function BookList() {
  // useQuery hook sends the query and manages loading and error states.
  const { loading, error, data } = useQuery<{ books: Book[] }>(GET_BOOKS_QUERY);

  // Purpose: Manages loading and error states for the UI.
  if (loading) return <p className="text-center py-4 text-gray-700">Loading books...</p>;
  if (error) return <p className="text-red-500 text-center py-4">Error loading books: {error.message}</p>;

  // Purpose: Renders the fetched book data.
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Books</h2>
      <ul className="space-y-3">
        {data?.books.map((book) => (
          <li key={book.id} className="border-b border-gray-200 pb-2 last:border-b-0">
            <span className="font-semibold text-gray-700">{book.title}</span> by{' '}
            {/* Link to the author's detail page */}
            {book.author ? (
              <Link href={`/authors/${book.author.id}`} className="italic text-blue-600 hover:underline">
                {book.author.name}
              </Link>
            ) : (
              <span className="italic text-gray-600">Unknown Author</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
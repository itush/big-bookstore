// src/components/authors/AuthorDetails.tsx

// Purpose: Fetches and displays details for a specific author, including their books.
// This is a client component that uses Apollo Client's useQuery hook and
// accepts an author ID as a prop.

'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

// Define the GraphQL query to get a single author by ID, along with their nested books.
export const GET_AUTHOR_DETAILS_QUERY = gql`
  query GetAuthorDetails($authorId: ID!) {
    author(id: $authorId) {
      id
      name
      books { # Nested field: get all books by this author
        id
        title
      }
    }
  }
`;

// Define interfaces for type safety, matching our GraphQL schema.
interface AuthorDetailsData {
  author: {
    id: string;
    name: string;
    books: {
      id: string;
      title: string;
    }[];
  } | null; // Author can be null if not found
}

interface AuthorDetailsProps {
  authorId: string; // The ID of the author to fetch
}

export function AuthorDetails({ authorId }: AuthorDetailsProps) {
  // Use useQuery hook, passing the authorId as a variable.
  const { loading, error, data } = useQuery<AuthorDetailsData>(GET_AUTHOR_DETAILS_QUERY, {
    variables: { authorId }, // Pass the dynamic authorId to the query
  });

  if (loading) return <p className="text-center py-4 text-gray-700">Loading author details...</p>;
  if (error) return <p className="text-red-500 text-center py-4">Error loading author: {error.message}</p>;

  // If author is null (not found), display a message.
  if (!data?.author) return <p className="text-center py-4 text-gray-700">Author not found.</p>;

  const author = data.author;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">{author.name}</h2>
      <p className="text-gray-600 mb-4">ID: {author.id}</p>

      <h3 className="text-xl font-semibold mb-3 text-gray-700">Books by {author.name}:</h3>
      {author.books.length === 0 ? (
        <p className="text-gray-600 italic">No books found for this author.</p>
      ) : (
        <ul className="list-disc list-inside space-y-2">
          {author.books.map((book) => (
            <li key={book.id} className="text-gray-600">
              {/* Link back to the book's detail page (if we create one later) */}
              <Link href={`/books/${book.id}`} className="hover:underline text-blue-600">
                {book.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 text-center">
        <Link href="/authors" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          ← Back to Authors
        </Link>
      </div>
    </div>
  );
}
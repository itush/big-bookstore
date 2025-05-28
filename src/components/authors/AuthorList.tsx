// src/components/authors/AuthorList.tsx

// Purpose: Displays a list of authors fetched from our GraphQL API.
// It demonstrates using Apollo Client's useQuery hook for data fetching
// and rendering the results. Each author's name will link to their detail page.
// This component needs to be a client component because it uses Apollo hooks.

'use client'; // This directive marks the component as a Client Component.

import { useQuery } from '@apollo/client';
import Link from 'next/link'; 
import { GET_AUTHORS_WITH_BOOKS } from '@/graphql/operations';

// Define an interface for the Author type, matching our GraphQL schema.
interface Author {
  id: string;
  name: string;
  bio?: string; // Add bio
  books?: { // Add books
    id: string;
    title: string;
    synopsis?: string; // Add synopsis
  }[];
}

export function AuthorList() {
  // useQuery hook sends the query and manages loading and error states.
  // const { loading, error, data } = useQuery<{ authors: Author[] }>(GET_AUTHORS_QUERY);

  const { loading, error, data,  } = useQuery<{ authors: Author[] }>(GET_AUTHORS_WITH_BOOKS); // Add refetch for later use

  // Purpose: Manages loading and error states for the UI.
  if (loading) return <p className="text-center py-4 text-gray-700">Loading authors...</p>;
  if (error) return <p className="text-red-500 text-center py-4">Error loading authors: {error.message}</p>;

  // Purpose: Renders the fetched author data.
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Authors</h2>
      {data?.authors.length === 0 ? (
        <p className="text-gray-600">No authors found.</p>
      ) : (
        <ul className="space-y-3">
          {data?.authors.map((author) => (
            <li key={author.id} className="border-b border-gray-200 pb-2 last:border-b-0">
              {/* Link to the author's dynamic detail page */}
              <Link href={`/authors/${author.id}`} className="font-semibold text-blue-600 hover:underline text-lg">
                {author.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
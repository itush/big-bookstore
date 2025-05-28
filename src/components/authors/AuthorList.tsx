// src/components/authors/AuthorList.tsx

// Purpose: Displays a list of authors fetched from our GraphQL API.
// It demonstrates using Apollo Client's useQuery hook for data fetching
// and rendering the results. Each author's name will link to their detail page.
// This component needs to be a client component because it uses Apollo hooks.

'use client'; // This directive marks the component as a Client Component.

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { GET_AUTHORS_WITH_BOOKS, GET_BOOKS_WITH_AUTHORS, DELETE_AUTHOR_MUTATION } from '@/graphql/operations';
import { EditAuthorForm } from '@/components/forms/EditAuthorForm';

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

  const { loading, error, data, } = useQuery<{ authors: Author[] }>(GET_AUTHORS_WITH_BOOKS); // Add refetch for later use
  const [editingAuthorId, setEditingAuthorId] = useState<string | null>(null);
  // Setup delete mutation
  const [deleteAuthor, { loading: deleting, error: deleteError }] = useMutation(DELETE_AUTHOR_MUTATION, {
    // Option 1: Refetch all relevant queries after mutation. Simple but can be inefficient for large datasets.
    refetchQueries: [
      { query: GET_AUTHORS_WITH_BOOKS }, // Re-fetch authors list
      { query: GET_BOOKS_WITH_AUTHORS }  // Re-fetch books list, as author deletion might affect books
    ],

    // Option 2 (More advanced & efficient): Update the cache directly.
    // update(cache, { data: { deleteAuthor } }) {
    //   // Read the current data for authors
    //   const existingAuthors: { authors: Author[] } | null = cache.readQuery({
    //     query: GET_AUTHORS_WITH_BOOKS,
    //   });
    //   if (existingAuthors && deleteAuthor) {
    //     // Filter out the deleted author
    //     const newAuthors = existingAuthors.authors.filter(author => author.id !== deleteAuthor);
    //     cache.writeQuery({
    //       query: GET_AUTHORS_WITH_BOOKS,
    //       data: { authors: newAuthors },
    //     });
    //     // Optionally, also remove associated books from cache if you want full consistency without refetching
    //     // This gets complex, refetchQueries is often sufficient for initial setup
    //   }
    // }

  });

  const handleDeleteAuthor = async (authorId: string, authorName: string) => {
    if (!confirm(`Are you sure you want to delete the author "${authorName}" and all their associated books?`)) {
      return;
    }
    try {
      await deleteAuthor({ variables: { id: authorId } });
      console.log(`Author "${authorName}" deleted successfully.`);
      // refetchQueries will handle UI update
    } catch (err) {
      console.error('Error deleting author:', err);
    }
  };

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
              <div className="flex space-x-2">
                
                <button
                  onClick={() => setEditingAuthorId(author.id)} // Set the ID to show the edit form
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-3 rounded-md"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteAuthor(author.id, author.name)}
                  className="bg-red-300 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md disabled:opacity-50 cursor-pointer"
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {deleteError && <p className="text-red-500 text-sm mt-2">Delete Error: {deleteError.message}</p>}

      {editingAuthorId && (
        <EditAuthorForm
          authorId={editingAuthorId}
          onClose={() => setEditingAuthorId(null)} // Function to close the form
        />
      )}
    </div>
  );
}
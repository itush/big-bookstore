// src/components/forms/AddAuthorForm.tsx

// Purpose: Provides a form to add new authors to our GraphQL API.
// It demonstrates using Apollo Client's useMutation hook to send data
// and automatically update the cache to reflect the new data without a full page reload.
// This component needs to be a client component because it uses Apollo hooks.

'use client';

import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

// Define the GraphQL mutation for adding an author.
// We expect the 'name' of the author as an argument and want the 'id' and 'name' back.
const ADD_AUTHOR_MUTATION = gql`
  mutation AddAuthor($name: String!) {
    addAuthor(name: $name) {
      id
      name
    }
  }
`;

// It's good practice to also define the query we want to refetch after a mutation
// so the UI updates automatically. This must match the exact query used in AuthorList.
const GET_AUTHORS_QUERY_FOR_REFETCH = gql`
  query GetAuthors {
    authors {
      id
      name
    }
  }
`;

export function AddAuthorForm() {
  const [authorName, setAuthorName] = useState('');

  // useMutation hook. 'refetchQueries' tells Apollo to re-run specific queries
  // after the mutation, ensuring the UI (e.g., AuthorList) is up-to-date with the new data.
  const [addAuthor, { loading, error }] = useMutation(ADD_AUTHOR_MUTATION, {
    refetchQueries: [{ query: GET_AUTHORS_QUERY_FOR_REFETCH }],
  });

  // Purpose: Handles form submission.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default browser form submission
    if (!authorName.trim()) return; // Don't submit if input is empty

    try {
      await addAuthor({
        variables: { name: authorName }, // Pass the author name as a variable to the mutation
      });
      setAuthorName(''); // Clear the input field on success
      console.log('Author added successfully!'); // For debugging
    } catch (err) {
      console.error('Error adding author:', err);
      // The `error` state from `useMutation` will handle displaying the error message in the UI.
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Author</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="authorName" className="block text-gray-700 text-sm font-bold mb-2">
            Author Name:
          </label>
          <input
            type="text"
            id="authorName"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={loading} // Disable input while loading
            required // HTML5 validation for required field
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Adding...' : 'Add Author'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">Error: {error.message}</p>}
      </form>
    </div>
  );
}
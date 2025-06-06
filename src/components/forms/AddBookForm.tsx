// src/components/forms/AddBookForm.tsx

// Purpose: Provides a form to add new books to our GraphQL API.
// It demonstrates using Apollo Client's useMutation hook to send data
// and automatically update the cache to reflect the new data without a full page reload.
// This component needs to be a client component because it uses Apollo hooks.

'use client';

import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { GET_BOOKS_WITH_AUTHORS, GET_AUTHORS_WITH_BOOKS, ADD_BOOK_MUTATION } from '@/graphql/operations';



export function AddBookForm() {
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [synopsis, setSynopsis] = useState('');

  // useMutation hook. 'refetchQueries' tells Apollo to re-run specific queries
  // after the mutation. This ensures the BookList and AuthorList (if a new author
  // was created implicitly) are up-to-date with the new data.
  const [addBook, { loading, error }] = useMutation(ADD_BOOK_MUTATION, {
    refetchQueries: [
      { query: GET_BOOKS_WITH_AUTHORS },      // Re-fetch all books to update the list
      { query: GET_AUTHORS_WITH_BOOKS },    // Re-fetch all authors in case a new one was implicitly created
    ],
  });

  // Purpose: Handles form submission.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authorName.trim()) return;

    try {
      await addBook({
        variables: { input: { title, authorName, synopsis } }, // Pass form values as variables
      });
      setTitle(''); // Clear form fields on success
      setAuthorName('');
      setSynopsis('');
      console.log('Book added successfully!'); // For debugging
    } catch (err) {
      console.error('Error adding book:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Book Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={loading}
            required
          />
        </div>
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
            disabled={loading}
            required
          />
        </div>
        <div>
          <label htmlFor="synopsis" className="block text-gray-700 text-sm font-bold mb-2">
            Book Synopsis (Optional):
          </label>
          <textarea
            id="synopsis"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={6} // Multi-line input
            disabled={loading}
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Book'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">Error: {error.message}</p>}
      </form>
    </div>
  );
}
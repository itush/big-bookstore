// src/components/books/BookList.tsx

// Purpose: Displays a list of books fetched from our GraphQL API.
// It demonstrates using Apollo Client's useQuery hook for data fetching
// and rendering the results.
// This component needs to be a client component because it uses Apollo hooks.

'use client'; // This directive marks the component as a Client Component.

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Link from 'next/link'; // To link to author detail pages
import { GET_BOOKS_WITH_AUTHORS, DELETE_BOOK_MUTATION } from '@/graphql/operations';
import { EditBookForm } from '@/components/forms/EditBookForm';

// Define interfaces for type safety, matching our GraphQL schema.
interface Book {
  id: string;
  title: string;
  synopsis?: string; // Add synopsis
  author: {
    id: string;
    name: string;
    bio?: string; // Add bio
  } | null;// Author can be null if not found
}

export function BookList() {
  // useQuery hook sends the query and manages loading and error states.
  const { loading, error, data } = useQuery<{ books: Book[] }>(GET_BOOKS_WITH_AUTHORS);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  // Setup delete mutation
  const [deleteBook, { loading: deleting, error: deleteError }] = useMutation(DELETE_BOOK_MUTATION, {
    refetchQueries: [
      { query: GET_BOOKS_WITH_AUTHORS } // Re-fetch books list
    ],

    // Option 2 (More advanced & efficient): Update the cache directly.
    // update(cache, { data: { deleteBook } }) {
    //   const existingBooks: { books: Book[] } | null = cache.readQuery({
    //     query: GET_BOOKS_WITH_AUTHORS,
    //   });
    //   if (existingBooks && deleteBook) {
    //     const newBooks = existingBooks.books.filter(book => book.id !== deleteBook);
    //     cache.writeQuery({
    //       query: GET_BOOKS_WITH_AUTHORS,
    //       data: { books: newBooks },
    //     });
    //   }
    // }


  });

  const handleDeleteBook = async (bookId: string, bookTitle: string) => {
    if (!confirm(`Are you sure you want to delete the book "${bookTitle}"?`)) {
      return;
    }
    try {
      await deleteBook({ variables: { id: bookId } });
      console.log(`Book "${bookTitle}" deleted successfully.`);
      // refetchQueries will handle UI update
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

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
            <span className="font-semibold text-gray-700">
              <Link href={`/books/${book.id}`} className="font-semibold text-gray-700 hover:underline">
                 {book.title}
              </Link>
              </span> by{' '}
            {/* Link to the author's detail page */}
            {book.author ? (
              <Link href={`/authors/${book.author.id}`} className="italic text-blue-600 hover:underline">
                {book.author.name}
              </Link>
            ) : (
              <span className="italic text-gray-600">Unknown Author</span>
            )}
            {book.synopsis && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                <strong className="font-medium">Synopsis:</strong> {book.synopsis}
              </p>
            )}
            <div className="flex space-x-2">

              <button
                onClick={() => setEditingBookId(book.id)} // Set the ID to show the edit form
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-3 rounded-md"
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteBook(book.id, book.title)}
                className="bg-red-300 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md disabled:opacity-50 cursor-pointer"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
      {deleteError && <p className="text-red-500 text-sm mt-2">Delete Error: {deleteError.message}</p>}
      {editingBookId && (
        <EditBookForm
          bookId={editingBookId}
          onClose={() => setEditingBookId(null)} // Function to close the form
        />
      )}
    </div>
  );
}
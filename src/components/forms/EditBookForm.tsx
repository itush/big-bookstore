// src/components/forms/EditBookForm.tsx

'use client';

import { useMutation, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_BOOKS_WITH_AUTHORS, GET_BOOK_DETAILS_BY_ID, UPDATE_BOOK_MUTATION } from '@/graphql/operations';

interface EditBookFormProps {
  bookId: string; // The ID of the book to edit
  onClose: () => void; // Callback to close the form/modal
}

interface BookData {
  book: {
    id: string;
    title: string;
    synopsis?: string;
    author: {
      id: string;
      name: string;
    } | null;
  } | null;
}

export function EditBookForm({ bookId, onClose }: EditBookFormProps) {
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Fetch existing book data to pre-populate the form
  const { data, loading: queryLoading, error: queryError } = useQuery<BookData>(
    GET_BOOK_DETAILS_BY_ID, // You'll need to define this query if you haven't already!
    {
      variables: { bookId },
      skip: !bookId,
    }
  );

  // Use useEffect to set form state once data is loaded
  useEffect(() => {
    if (data?.book && !initialDataLoaded) {
      setTitle(data.book.title);
      setSynopsis(data.book.synopsis || '');
      setInitialDataLoaded(true);
    }
  }, [data, initialDataLoaded]);

  // Setup the update mutation
  const [updateBook, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_BOOK_MUTATION, {
    update(cache, { data: { updateBook } }) {
      // Update the list of books in the cache
      const existingBooks: { books: BookData['book'][] } | null = cache.readQuery({
        query: GET_BOOKS_WITH_AUTHORS,
      });

      if (existingBooks && updateBook) {
        const updatedBooks = existingBooks.books.map(book =>
          book?.id === updateBook.id ? { ...book, ...updateBook } : book
        );
        cache.writeQuery({
          query: GET_BOOKS_WITH_AUTHORS,
          data: { books: updatedBooks },
        });

        // Also update the specific book's details in the cache if it was queried separately
        cache.writeQuery({
          query: GET_BOOK_DETAILS_BY_ID,
          variables: { bookId: updateBook.id },
          data: { book: updateBook },
        });
      }
    },
    onCompleted: () => {
      onClose(); // Close the form on successful submission
      console.log('Book updated successfully!');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Book title cannot be empty.');
      return;
    }

    try {
      await updateBook({
        variables: {
          id: bookId,
          input: { title, synopsis: synopsis || null }, // Use null if synopsis is empty string
        },
      });
    } catch (err) {
      console.error('Error updating book:', err);
    }
  };

  if (queryLoading) return <p className="text-center py-4 text-gray-700">Loading book for edit...</p>;
  if (queryError) return <p className="text-red-500 text-center py-4">Error loading book: {queryError.message}</p>;
  if (!data?.book) return <p className="text-center py-4 text-gray-700">Book not found for editing.</p>;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Book: {data.book.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="editBookTitle" className="block text-gray-700 text-sm font-bold mb-2">
              Title:
            </label>
            <input
              type="text"
              id="editBookTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={mutationLoading}
              required
            />
          </div>
          <div>
            <label htmlFor="editBookSynopsis" className="block text-gray-700 text-sm font-bold mb-2">
              Synopsis (Optional):
            </label>
            <textarea
              id="editBookSynopsis"
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
              disabled={mutationLoading}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={mutationLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              disabled={mutationLoading}
            >
              {mutationLoading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
          {mutationError && <p className="text-red-500 text-sm mt-2">Error: {mutationError.message}</p>}
        </form>
      </div>
    </div>
  );
}
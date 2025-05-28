// src/components/books/BookDetails.tsx

'use client';

import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { GET_BOOK_DETAILS_BY_ID } from '@/graphql/operations'; // Make sure this query is in operations.ts

interface BookDetailsData {
  book: {
    id: string;
    title: string;
    synopsis?: string;
    author: {
      id: string;
      name: string;
      bio?: string;
    } | null;
  } | null;
}

interface BookDetailsProps {
  bookId: string; // The ID of the book to fetch
}

export function BookDetails({ bookId }: BookDetailsProps) {
  // Use useQuery hook, passing the bookId as a variable.
  const { loading, error, data } = useQuery<BookDetailsData>(GET_BOOK_DETAILS_BY_ID, {
    variables: { bookId },
  });

  if (loading) return <p className="text-center py-4 text-gray-700">Loading book details...</p>;
  if (error) return <p className="text-red-500 text-center py-4">Error loading book: {error.message}</p>;

  // If book is null (not found), display a message.
  if (!data?.book) return <p className="text-center py-4 text-gray-700">Book not found.</p>;

  const book = data.book;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">{book.title}</h2>
      <p className="text-gray-600 mb-4">ID: {book.id}</p>

      {book.author ? (
        <p className="text-gray-700 mb-4 border-l-4 border-purple-400 pl-3">
          <strong className="not-italic">Author:</strong>{' '}
          <Link href={`/authors/${book.author.id}`} className="hover:underline text-blue-600">
            {book.author.name}
          </Link>
          {book.author.bio && <span className="text-sm text-gray-500 ml-2 italic"> ({book.author.bio})</span>}
        </p>
      ) : (
        <p className="text-gray-700 mb-4 italic">Author: Unknown</p>
      )}

      {book.synopsis && (
        <p className="text-gray-700 mb-4 border-l-4 border-green-400 pl-3 italic">
          <strong className="not-italic">Synopsis:</strong> {book.synopsis}
        </p>
      )}

      <div className="mt-6 text-center">
        <Link href="/books" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          ← Back to Books
        </Link>
      </div>
    </div>
  );
}
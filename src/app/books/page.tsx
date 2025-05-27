// src/app/books/page.tsx

// Purpose: This page serves as the dedicated route for displaying all books.
// It's a Server Component that imports and renders the client-side BookList component.

import { BookList } from '../../components/books/BookList'; // Import the BookList component

export const metadata = {
  title: 'All Books | Big Bookstore',
  description: 'Browse all available books in the Big Bookstore.',
};

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">All Books</h1>
        {/* Render the BookList component */}
        <BookList />
      </div>
    </div>
  );
}
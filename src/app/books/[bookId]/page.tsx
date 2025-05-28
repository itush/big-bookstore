// src/app/books/[bookId]/page.tsx

// Purpose: This is a Next.js dynamic route page responsible for displaying
// the details of a single book. It extracts the bookId from the URL
// and passes it to the client-side BookDetails component.

import { BookDetails } from '@/components/books/BookDetails'; // Import the BookDetails component

// Define metadata for the page (good for SEO)
export const metadata = {
  title: 'Book Details | Big Bookstore',
  description: 'View details of a specific book, including its synopsis and author.',
};

// Use an async function component to handle params as a Promise,
// mirroring the structure in src/app/authors/[authorId]/page.tsx.
export default async function BookDetailPage({ params }: { params: Promise<{ bookId: string }> }) {
  // Await the params object before destructuring its properties.
  // This ensures that the 'bookId' is resolved from the Promise.
  const { bookId } = await params;

  // Render the BookDetails component, passing the extracted bookId
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Book Information</h1>
        <BookDetails bookId={bookId} />
      </div>
    </div>
  );
}
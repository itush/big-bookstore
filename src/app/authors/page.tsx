// src/app/authors/page.tsx

// Purpose: This page serves as the dedicated route for displaying all authors.
// It's a Server Component that imports and renders the client-side AuthorList component.

import { AuthorList } from '../../components/authors/AuthorList'; // Import the AuthorList component

export const metadata = {
  title: 'All Authors | Big Bookstore',
  description: 'Browse all available authors in the Big Bookstore.',
};

export default function AuthorsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">All Authors</h1>
        {/* Render the AuthorList component */}
        <AuthorList />
      </div>
    </div>
  );
}
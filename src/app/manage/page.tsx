// src/app/manage/page.tsx

// Purpose: This page provides forms for adding new books and authors to the system.
// It brings together the client-side AddBookForm and AddAuthorForm components.
// This is a Server Component that renders Client Components within it.

import { AddBookForm } from '../../components/forms/AddBookForm';
import { AddAuthorForm } from '../../components/forms/AddAuthorForm';

export const metadata = {
  title: 'Manage Data | Big Bookstore',
  description: 'Add new books and authors to the Big Bookstore.',
};

export default function ManagePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Manage Bookstore Data</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Author Form */}
          <AddAuthorForm />

          {/* Add Book Form */}
          <AddBookForm />
        </div>
      </div>
    </div>
  );
}
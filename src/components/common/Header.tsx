// src/components/common/Header.tsx

// Purpose: A common header component for navigation across the application.
// It uses Next.js Link component for client-side routing.
// This is a Server Component by default.

import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Application Title/Logo linking to Home */}
        <Link href="/" className="text-2xl font-bold hover:text-blue-300 transition-colors duration-200">
          The Big Bookstore
        </Link>
        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li>
            <Link href="/books" className="hover:text-blue-300 transition-colors duration-200 text-lg">
              Books
            </Link>
          </li>
          <li>
            <Link href="/authors" className="hover:text-blue-300 transition-colors duration-200 text-lg">
              Authors
            </Link>
          </li>
          <li>
            <Link href="/manage" className="hover:text-blue-300 transition-colors duration-200 text-lg">
              Manage
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
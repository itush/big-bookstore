// src/app/page.tsx

// Purpose: The main home page of our application. It serves as a welcome
// and an entry point to different sections of the bookstore.
// This is a Server Component by default, as it doesn't use client-side hooks initially.

import Link from 'next/link'; // Import Link for navigation

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100 text-gray-800">
      <div className="text-center bg-white p-10 rounded-lg shadow-xl max-w-2xl w-full">
        <h1 className="text-5xl font-extrabold mb-6 text-blue-700">
          Welcome to The Big Bookstore
        </h1>
        <p className="text-xl mb-8 leading-relaxed">
          This is a Nextjs, GraphQL, MongoDB project. You can add, browse, update, delete books and authors in this app.
        </p>
        <div className="space-x-4">
          <Link href="/books" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105">
            Browse Books
          </Link>
          <Link href="/authors" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105">
            Explore Authors
          </Link>
          <Link href="/manage" className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105">
            Manage Data
          </Link>
        </div>
      </div>
    </main>
  );
}
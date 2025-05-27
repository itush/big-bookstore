// src/app/authors/[authorId]/page.tsx

// Purpose: This is a Next.js dynamic route page responsible for displaying
// the details of a single author. It extracts the authorId from the URL
// and passes it to the client-side AuthorDetails component.

import { AuthorDetails } from '@/components/authors/AuthorDetails'; // Import the AuthorDetails component

// Define types for the page's props, specifically for the dynamic params.
interface AuthorDetailPageProps {
  params: {
    authorId: string; // The dynamic segment from the URL (e.g., /authors/1 -> authorId = "1")
  };
}

export const metadata = {
  title: 'Author Details | Big Bookstore',
  description: 'View details and books by a specific author.',
};

export default async function AuthorDetailPage({ params }: AuthorDetailPageProps) {
 // Await the params object before destructuring its properties.
  // This addresses the Next.js warning.
  const resolvedParams = await params;
  const { authorId } = resolvedParams;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Author Profile</h1>
        {/* Render the AuthorDetails component, passing the extracted authorId */}
        <AuthorDetails authorId={authorId} />
      </div>
    </div>
  );
}
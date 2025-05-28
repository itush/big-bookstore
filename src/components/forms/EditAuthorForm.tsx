// src/components/forms/EditAuthorForm.tsx

'use client';

import { useMutation, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_AUTHOR_DETAILS_BY_ID, UPDATE_AUTHOR_MUTATION, GET_AUTHORS_WITH_BOOKS } from '@/graphql/operations';

interface EditAuthorFormProps {
  authorId: string; // The ID of the author to edit
  onClose: () => void; // Callback to close the form/modal
}

interface AuthorData {
  author: {
    id: string;
    name: string;
    bio?: string;
  } | null;
}

export function EditAuthorForm({ authorId, onClose }: EditAuthorFormProps) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [initialDataLoaded, setInitialDataLoaded] = useState(false); // To prevent re-setting state on re-renders

  // 1. Fetch existing author data to pre-populate the form
  const { data, loading: queryLoading, error: queryError } = useQuery<AuthorData>(
    GET_AUTHOR_DETAILS_BY_ID,
    {
      variables: { authorId },
      skip: !authorId, // Skip query if no authorId is provided
    }
  );

  // Use useEffect to set form state once data is loaded
  useEffect(() => {
    if (data?.author && !initialDataLoaded) {
      setName(data.author.name);
      setBio(data.author.bio || ''); // Set bio, default to empty string if null/undefined
      setInitialDataLoaded(true);
    }
  }, [data, initialDataLoaded]);

  // 2. Setup the update mutation
  const [updateAuthor, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_AUTHOR_MUTATION, {
    // After a successful update, update the cache.
    // This is more efficient than refetching the entire list.
    update(cache, { data: { updateAuthor } }) {
      // Read the current list of authors from the cache
      const existingAuthors: { authors: AuthorData['author'][] } | null = cache.readQuery({
        query: GET_AUTHORS_WITH_BOOKS,
      });

      if (existingAuthors && updateAuthor) {
        // Find the updated author in the list and replace it
        const updatedAuthors = existingAuthors.authors.map(author =>
          author?.id === updateAuthor.id ? { ...author, ...updateAuthor } : author
        );

        // Write the updated list back to the cache
        cache.writeQuery({
          query: GET_AUTHORS_WITH_BOOKS,
          data: { authors: updatedAuthors },
        });

        // If the specific author's details were cached separately (e.g., from AuthorDetails page),
        // update that specific cache entry too.
        cache.writeQuery({
          query: GET_AUTHOR_DETAILS_BY_ID,
          variables: { authorId: updateAuthor.id },
          data: { author: updateAuthor },
        });
      }
    },
    onCompleted: () => {
        onClose(); // Close the form on successful submission
        console.log('Author updated successfully!');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Author name cannot be empty.');
      return;
    }

    try {
      await updateAuthor({
        variables: {
          id: authorId,
          input: { name, bio: bio || null }, // Send bio, use null if empty string
        },
      });
    } catch (err) {
      console.error('Error updating author:', err);
    }
  };

  if (queryLoading) return <p className="text-center py-4 text-gray-700">Loading author for edit...</p>;
  if (queryError) return <p className="text-red-500 text-center py-4">Error loading author: {queryError.message}</p>;
  if (!data?.author) return <p className="text-center py-4 text-gray-700">Author not found for editing.</p>;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Author: {data.author.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="editAuthorName" className="block text-gray-700 text-sm font-bold mb-2">
              Name:
            </label>
            <input
              type="text"
              id="editAuthorName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={mutationLoading}
              required
            />
          </div>
          <div>
            <label htmlFor="editAuthorBio" className="block text-gray-700 text-sm font-bold mb-2">
              Bio (Optional):
            </label>
            <textarea
              id="editAuthorBio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
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
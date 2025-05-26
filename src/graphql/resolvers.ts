// src/graphql/resolvers.ts

// Purpose: Contains the resolver functions that tell GraphQL how to fetch the data
// for each field defined in our schema. This connects our schema to our in-memory data.
// This file separates the data fetching logic from the schema definition for clarity.

import {
  authors,
  books,
  findBookById,
  findAuthorById,
  findBooksByAuthorId,
  generateNextBookId,
  generateNextAuthorId,
} from '../lib/data';

// IMPORTANT: Import the interfaces we defined in data.ts for type safety
import type { Author, Book } from '../lib/data';

// Resolvers map directly to the fields in our GraphQL schema.
export const resolvers = {
  // --- Query Resolvers ---
  // These handle the top-level 'Query' fields in our schema.
  Query: {
    // For top-level queries, the `parent` argument is usually `null` or `undefined`.
    // We type it as `null` since we don't use it here.
    books: (parent: null, args: {}) => {
      console.log('Query: Fetching all books'); // Debugging
      return books;
    },
    book: (parent: null, { id }: { id: string }) => {
      console.log(`Query: Fetching book with ID: ${id}`); // Debugging
      return findBookById(id);
    },
    authors: (parent: null, args: {}) => {
      console.log('Query: Fetching all authors'); // Debugging
      return authors;
    },
    author: (parent: null, { id }: { id: string }) => {
      console.log(`Query: Fetching author with ID: ${id}`); // Debugging
      return findAuthorById(id);
    },
  },

  // --- Mutation Resolvers ---
  // These handle the top-level 'Mutation' fields in our schema.
  Mutation: {
    addBook: (parent: null, { title, authorName }: { title: string; authorName: string }) => {
      console.log(`Mutation: Adding book "${title}" by "${authorName}"`); // Debugging

      // Find existing author or create a new one
      let author = authors.find(a => a.name.toLowerCase() === authorName.toLowerCase());
      if (!author) {
        // Create new author if not found
        author = { id: generateNextAuthorId(), name: authorName };
        authors.push(author);
        console.log(`  -> Created new author: ${author.name} (ID: ${author.id})`); // Debugging
      }

      const newBook: Book = { // Explicitly type newBook as Book for clarity
        id: generateNextBookId(),
        title,
        authorId: author.id,
      };
      books.push(newBook); // Add the new book to our in-memory list
      console.log(`  -> Added new book: "${newBook.title}" (ID: ${newBook.id})`); // Debugging
      return newBook; // Return the newly created book
    },
    addAuthor: (parent: null, { name }: { name: string }) => {
      console.log(`Mutation: Adding author "${name}"`); // Debugging
      const newAuthor: Author = { id: generateNextAuthorId(), name }; // Explicitly type newAuthor as Author
      authors.push(newAuthor); // Add the new author
      console.log(`  -> Added new author: "${newAuthor.name}" (ID: ${newAuthor.id})`); // Debugging
      return newAuthor; // Return the newly created author
    },
  },

  // --- Type Resolvers ---
  // These are crucial for handling nested relationships in our schema.
  // The 'parent' argument here is the object of the type itself (e.g., a Book object).
  Book: {
    // This resolver tells GraphQL how to get the 'author' field for any 'Book' object.
    // The 'parent' argument is the Book object currently being resolved.
    author: (parent: Book) => {
      console.log(`  Resolver: Resolving author for book ID: ${parent.id}`); // Debugging
      return findAuthorById(parent.authorId);
    },
  },

  Author: {
    // This resolver tells GraphQL how to get the 'books' field for any 'Author' object.
    // The 'parent' argument is the Author object currently being resolved.
    books: (parent: Author) => {
      console.log(`  Resolver: Resolving books for author ID: ${parent.id}`); // Debugging
      return findBooksByAuthorId(parent.id);
    },
  },
};
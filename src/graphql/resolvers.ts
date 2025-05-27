// src/graphql/resolvers.ts

// Purpose: Contains the resolver functions that tell GraphQL how to fetch the data
// for each field defined in our schema. This connects our schema to our in-memory data.
// This file separates the data fetching logic from the schema definition for clarity.

import Author, { IAuthor } from '@/models/Author';
import Book, { IBook } from '@/models/Book';

interface GraphQLAuthor {
  id: string;
  name: string;
  books?: GraphQLBook[]; // Optional as it might be populated or not
}

interface GraphQLBook {
  id: string;
  title: string;
  author?: GraphQLAuthor; // Optional as it might be populated or not
}

// Resolvers map directly to the fields in our GraphQL schema.

export const resolvers = {
  // --- Query Resolvers ---
  Query: {
    books: async () => {
      console.log('Query: Fetching all books from DB');
      const books = await Book.find({}).populate('author').exec();
      return books;
    },
    book: async (parent: null, { id }: { id: string }) => {
      console.log(`Query: Fetching book with ID: ${id} from DB`);
      try {
        const book = await Book.findById(id).populate('author').exec();
        return book;
      } catch (error) {
        console.error(`Error finding book by ID ${id}:`, error);
        return null;
      }
    },
    authors: async () => {
      console.log('Query: Fetching all authors from DB');
      const authors = await Author.find({}).exec();
      return authors;
    },
    author: async (parent: null, { id }: { id: string }) => {
      console.log(`Query: Fetching author with ID: ${id} from DB`);
      try {
        const author = await Author.findById(id).exec();
        return author;
      } catch (error) {
        console.error(`Error finding author by ID ${id}:`, error);
        return null;
      }
    },
  },

  // --- Mutation Resolvers ---
  Mutation: {
    addBook: async (parent: null, { title, authorName }: { title: string; authorName: string }) => {
      console.log(`Mutation: Adding book "${title}" by "${authorName}" to DB`);

      let author = await Author.findOne({ name: { $regex: new RegExp(`^${authorName}$`, 'i') } });
      if (!author) {
        author = await Author.create({ name: authorName });
        console.log(`  -> Created new author in DB: ${author.name} (ID: ${author._id})`);
      }

      const newBook = await Book.create({
        title,
        author: author._id,
      });

      console.log(`  -> Added new book to DB: "${newBook.title}" (ID: ${newBook._id})`);
      const populatedBook = await Book.findById(newBook._id).populate('author').exec();
      return populatedBook;
    },
    addAuthor: async (parent: null, { name }: { name: string }) => {
      console.log(`Mutation: Adding author "${name}" to DB`);
      const existingAuthor = await Author.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
      if (existingAuthor) {
          throw new Error(`Author with name "${name}" already exists.`);
      }
      const newAuthor = await Author.create({ name });
      console.log(`  -> Added new author to DB: "${newAuthor.name}" (ID: ${newAuthor._id})`);
      return newAuthor;
    },
  },

  // --- Type Resolvers ---
  // These resolvers resolve fields specific to the 'Book' and 'Author' GraphQL types.
  // The 'parent' argument here refers to the Mongoose document for the parent type (Book or Author).

  Book: {
    // Parent is an IBook document.
    author: async (parent: IBook) => {
      // If the 'author' field is already populated (i.e., it's an object, not just an ObjectId),
      // return it directly. This happens if the parent query used .populate('author').
      if (parent.author && typeof parent.author === 'object' && 'name' in parent.author) {
        return parent.author; // Already populated IAuthor
      }
      // If 'author' is not populated (still an ObjectId), we explicitly populate it now.
      // This ensures that the 'author' field is always resolved to a full object.
      // Note: `parent.author` is of type `mongoose.Types.ObjectId` here.
      console.log(`  Resolver: Lazily populating author for book ID: ${parent._id.toString()}`);
      const populatedAuthor = await Author.findById(parent.author).exec();
      return populatedAuthor;
    },
    // REMOVED: id: (parent: any) => parent._id.toString(), // Rely on Apollo's default ID coercion
  },

  Author: {
    // Parent is an IAuthor document.
    books: async (parent: IAuthor) => {
      // If the 'books' array is already populated, return it directly.
      if (parent.books && Array.isArray(parent.books) && parent.books.length > 0 && typeof parent.books[0] === 'object' && 'title' in parent.books[0]) {
        return parent.books; // Already populated array of IBook
      }
      // If 'books' is not populated (e.g., an array of ObjectIds), find them.
      console.log(`  Resolver: Lazily finding books for author ID: ${parent._id.toString()}`);
      const booksByAuthor = await Book.find({ author: parent._id }).exec();
      return booksByAuthor;
    },
    // REMOVED: id: (parent: any) => parent._id.toString(), // Rely on Apollo's default ID coercion
  },
  };


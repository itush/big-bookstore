// src/graphql/resolvers/types.ts

import Author, { IAuthor }  from '@/models/Author';
import Book, { IBook } from '@/models/Book';

export const Types = {
  Book: {
    author: async (parent: IBook) => {
      // If the 'author' field is already populated (i.e., it's an object, not just an ObjectId),
      // return it directly. This happens if the parent query used .populate('author').
      if (parent.author && typeof parent.author === 'object' && 'name' in parent.author) {
        return parent.author as IAuthor; // Already populated IAuthor
      }
      // If 'author' is not populated (still an ObjectId), we explicitly populate it now.
      // This ensures that the 'author' field is always resolved to a full object.
      console.log(`  Resolver: Lazily populating author for book ID: ${parent._id.toString()}`);
      if (parent.author) {
          const author = await Author.findById(parent.author).exec();
          return author;
      }
      return null;
    },
  },

  Author: {
    books: async (parent: IAuthor) => {
      // This resolver is responsible for finding books related to an author.
      // It's called when 'books' is requested on an 'Author' type.
      console.log(`  Resolver: Lazily finding books for author ID: ${parent._id.toString()}`);
      const booksByAuthor = await Book.find({ author: parent._id }).exec();
      return booksByAuthor;
    },
  },
};
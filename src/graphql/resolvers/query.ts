// src/graphql/resolvers/query.ts

import Author  from '@/models/Author';
import Book from '@/models/Book';

export const Query = {
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
};
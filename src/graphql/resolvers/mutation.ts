// src/graphql/resolvers/mutation.ts

import Author  from '@/models/Author';
import Book from '@/models/Book';

export const Mutation = {
  // --- ADD Mutations (Adjusted to use 'input' object for consistency) ---
  addAuthor: async (parent: null, { input }: { input: { name: string; bio?: string } }) => {
    console.log('Mutation: Adding new author:', input.name);
    try {
      const existingAuthor = await Author.findOne({ name: { $regex: new RegExp(`^${input.name}$`, 'i') } });
      if (existingAuthor) {
        throw new Error(`Author with name "${input.name}" already exists.`);
      }
      const newAuthor = new Author({
        name: input.name,
        bio: input.bio, // Now handling bio from input
      });
      await newAuthor.save();
      return newAuthor;
    } catch (error) {
      console.error('Error adding author:', error);
      throw new Error(`Failed to add author: ${error || error}.`);
    }
  },

  addBook: async (parent: null, { input }: { input: { title: string; synopsis?: string; authorName: string } }) => {
    console.log('Mutation: Adding new book:', input.title, 'by', input.authorName);
    try {
      let author = await Author.findOne({ name: { $regex: new RegExp(`^${input.authorName}$`, 'i') } });

      if (!author) {
        console.log('  Author not found, creating new author:', input.authorName);
        author = new Author({ name: input.authorName }); // New authors created without bio for now
        await author.save();
      }

      const newBook = new Book({
        title: input.title,
        synopsis: input.synopsis, // Now handling synopsis from input
        author: author._id,
      });
      await newBook.save();

      const populatedBook = await newBook.populate('author');
      return populatedBook;
    } catch (error) {
      console.error('Error adding book:', error);
      throw new Error(`Failed to add book: ${error || error}.`);
    }
  },

  // --- NEW CRUD Mutations (Update & Delete) ---
  updateAuthor: async (parent: null, { id, input }: { id: string; input: { name?: string; bio?: string } }) => {
    console.log(`Mutation: Updating author with ID: ${id} with data:`, input);
    try {
      const updatedAuthor = await Author.findByIdAndUpdate(
        id,
        { $set: input }, // $set updates only the fields provided in 'input'
        { new: true } // Returns the updated document
      ).exec();

      if (!updatedAuthor) {
        console.warn(`Author with ID ${id} not found for update.`);
        return null;
      }
      return updatedAuthor;
    } catch (error) {
      console.error(`Error updating author ${id}:`, error);
      throw new Error(`Failed to update author: ${error || error}.`);
    }
  },

  deleteAuthor: async (parent: null, { id }: { id: string }) => {
    console.log(`Mutation: Deleting author with ID: ${id}`);
    try {
      const deletedAuthor = await Author.findByIdAndDelete(id).exec();
      if (!deletedAuthor) {
        console.warn(`Author with ID ${id} not found for deletion.`);
        return false; // Author not found
      }
      // CRUCIAL: Delete all books associated with this author
      console.log(`  Deleting books for author ID: ${id}`);
      await Book.deleteMany({ author: deletedAuthor._id }).exec();
      console.log(`  Successfully deleted author ${id} and associated books.`);
      return true; // Successfully deleted
    } catch (error) {
      console.error(`Error deleting author ${id}:`, error);
      throw new Error(`Failed to delete author and associated books: ${error || error}.`);
    }
  },

  updateBook: async (parent: null, { id, input }: { id: string; input: { title?: string; synopsis?: string; authorName?: string } }) => {
    console.log(`Mutation: Updating book with ID: ${id} with data:`, input);
    try {
      const updateData: { title?: string; synopsis?: string; author?: string } = {};

      if (input.title !== undefined) {
        updateData.title = input.title;
      }
      if (input.synopsis !== undefined) {
        updateData.synopsis = input.synopsis;
      }

      if (input.authorName !== undefined) {
        let author = await Author.findOne({ name: { $regex: new RegExp(`^${input.authorName}$`, 'i') } });
        if (!author) {
          console.log('  Author not found for book update, creating new author:', input.authorName);
          author = new Author({ name: input.authorName });
          await author.save();
        }
        updateData.author = author._id.toString(); // Link by ID
      }

      const updatedBook = await Book.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).populate('author').exec(); // Populate author for return type consistency

      if (!updatedBook) {
        console.warn(`Book with ID ${id} not found for update.`);
        return null;
      }
      return updatedBook;
    } catch (error) {
      console.error(`Error updating book ${id}:`, error);
      throw new Error(`Failed to update book: ${error || error}.`);
    }
  },

  deleteBook: async (parent: null, { id }: { id: string }) => {
    console.log(`Mutation: Deleting book with ID: ${id}`);
    try {
      const deletedBook = await Book.findByIdAndDelete(id).exec();
      if (!deletedBook) {
        console.warn(`Book with ID ${id} not found for deletion.`);
        return false; // Book not found
      }
      console.log(`  Successfully deleted book ${id}.`);
      return true; // Successfully deleted
    } catch (error) {
      console.error(`Error deleting book ${id}:`, error);
      throw new Error(`Failed to delete book: ${error || error}.`);
    }
  },
};
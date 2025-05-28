// src/models/Book.ts

// Purpose: Defines the Mongoose schema and model for the Book entity.
// It includes a reference to the Author model, establishing a relationship.
// Removed virtual 'id' and 'toJSON'/'toObject' transforms for simplicity.

import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAuthor } from './Author'; // Import the Author interface for type hinting

// 1. Define an interface that represents a document in MongoDB.
export interface IBook extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  synopsis?: string;
  author: mongoose.Types.ObjectId | IAuthor; // Can be ObjectId (ref) or populated IAuthor object

}

// 2. Define the Mongoose Schema for the Book.
const BookSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Book title is required.'],
    unique: true,
    trim: true,
    minlength: [1, 'Book title must not be empty.'],
  },
  synopsis: { type: String, required: false },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: [true, 'Author is required for a book.'],
  },
}, {
  timestamps: true,
});

// 3. Create and export the Mongoose Model.
const Book: Model<IBook> = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default Book;
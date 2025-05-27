// src/models/Author.ts

// Purpose: Defines the Mongoose schema and model for the Author entity.
// This sets up the structure for how author data will be stored in MongoDB.
// Removed virtual 'id' and 'toJSON'/'toObject' transforms for simplicity.

import mongoose, { Schema, Document, Model } from 'mongoose';
import { IBook } from './Book';

// 1. Define an interface that represents a document in MongoDB.
// This interface will be used for type safety when working with Author documents.
// 'Document' adds Mongoose-specific properties like _id, save(), etc.
export interface IAuthor extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  books?: IBook[];
  // Mongoose automatically adds _id: mongoose.Types.ObjectId
  // Mongoose automatically adds createdAt and updatedAt if timestamps: true
}

// 2. Define the Mongoose Schema for the Author.
const AuthorSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Author name is required.'],
    unique: true,
    trim: true,
    minlength: [2, 'Author name must be at least 2 characters long.'],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// 3. Create and export the Mongoose Model.
const Author: Model<IAuthor> = mongoose.models.Author || mongoose.model<IAuthor>('Author', AuthorSchema);

export default Author;
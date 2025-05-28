// src/graphql/schema.ts

// Purpose: Defines the shape of our GraphQL API using Schema Definition Language (SDL).
// This is the "contract" that clients will use to understand what data they can query.
// It's separated for modularity and clarity as per guidelines.

import gql from 'graphql-tag';

export const typeDefs = gql`
  # Scalar type for unique identifiers
  scalar ObjectID

  # Author Type
  type Author {
    id: ObjectID!
    name: String!
    bio: String # NEW: Add bio field
    books: [Book]
  }

  # Book Type
  type Book {
    id: ObjectID!
    title: String!
    synopsis: String # NEW: Add synopsis field
    author: Author! # The author who wrote the book
  }

  # Input type for adding a new Author
  input AddAuthorInput {
    name: String!
    bio: String # NEW: Add bio field as optional during creation
  }

  # Input type for updating an Author
  input UpdateAuthorInput {
    name: String # Name is optional for partial updates
    bio: String # NEW: Add bio for updates
  }

  # Input type for adding a new Book
  input AddBookInput {
    title: String!
    synopsis: String # NEW: Add synopsis field as optional during creation
    authorName: String!
  }

  # Input type for updating a Book
  input UpdateBookInput {
    title: String # Optional for partial updates
    synopsis: String # NEW: Add synopsis for updates
    authorName: String # Optional for partial updates, will link to existing author or create new
  }

  # Root Query Type
  type Query {
    books: [Book]
    book(id: ObjectID!): Book
    authors: [Author]
    author(id: ObjectID!): Author
  }

  # Root Mutation Type
  type Mutation {
    addAuthor(input: AddAuthorInput!): Author
    addBook(input: AddBookInput!): Book

    updateAuthor(id: ObjectID!, input: UpdateAuthorInput!): Author
    deleteAuthor(id: ObjectID!): Boolean

    updateBook(id: ObjectID!, input: UpdateBookInput!): Book
    deleteBook(id: ObjectID!): Boolean
  }
`;
// src/graphql/schema.ts

// Purpose: Defines the shape of our GraphQL API using Schema Definition Language (SDL).
// This is the "contract" that clients will use to understand what data they can query.
// It's separated for modularity and clarity as per guidelines.

import gql from 'graphql-tag';

export const typeDefs = gql`
  # Defines the Book type with its fields.
  type Book {
    id: ID!         # Unique identifier for the book. ID is a special scalar type.
    title: String!  # The title of the book. String! means it's a non-nullable string.
    author: Author  # The author of the book. This is a nested relationship!
                    # It's an Author type, meaning we can query fields of the Author.
                    # Note: It's not 'Author!' because an author might not be found (e.g., if authorId is invalid).
  }

  # Defines the Author type with its fields.
  type Author {
    id: ID!         # Unique identifier for the author.
    name: String!   # The name of the author.
    books: [Book!]  # A list of books written by this author. [Book!] means a list of non-nullable Books.
                    # This is another nested relationship.
  }

  # The Query type defines all the entry points for reading data from our API.
  type Query {
    books: [Book!]!       # A query to get a list of all books. Returns a non-nullable list of non-nullable Books.
    book(id: ID!): Book   # A query to get a single book by its ID. Requires a non-nullable ID argument.
    authors: [Author!]!   # A query to get a list of all authors.
    author(id: ID!): Author # A query to get a single author by their ID. Requires a non-nullable ID argument.
  }

  # The Mutation type defines all the entry points for writing/modifying data.
  type Mutation {
    addBook(title: String!, authorName: String!): Book! # Adds a new book. Requires title and authorName. Returns the newly created Book.
    addAuthor(name: String!): Author! # Adds a new author. Requires name. Returns the newly created Author.
  }
`;
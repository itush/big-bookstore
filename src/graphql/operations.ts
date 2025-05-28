// src/graphql/operations.ts

import { gql } from '@apollo/client';

// --- QUERIES ---

export const GET_AUTHORS_WITH_BOOKS = gql`
  query GetAuthors {
    authors {
      id
      name
      bio # NEW: Fetch bio
      books {
        id
        title
        synopsis # NEW: Fetch synopsis
      }
    }
  }
`;

export const GET_BOOKS_WITH_AUTHORS = gql`
  query GetBooks {
    books {
      id
      title
      synopsis # NEW: Fetch synopsis
      author {
        id
        name
        bio # NEW: Fetch bio
      }
    }
  }
`;

export const GET_AUTHOR_DETAILS_BY_ID = gql`
  query GetAuthorDetailsById($authorId: ObjectID!) { # <-- CHANGED from ObjectID! to ID!
    author(id: $authorId) {
      id
      name
      bio
      books {
        id
        title
        synopsis
      }
    }
  }
`;

export const GET_BOOK_DETAILS_BY_ID = gql`
  query GetBookDetailsById($bookId: ObjectID!) { # Use ObjectID!
    book(id: $bookId) {
      id
      title
      synopsis
      author {
        id
        name
        bio
      }
    }
  }
`;

// --- MUTATIONS ---

export const ADD_AUTHOR_MUTATION = gql`
  mutation AddAuthor($input: AddAuthorInput!) {
    addAuthor(input: $input) {
      id
      name
      bio # NEW: Return bio
      books { # Optionally return books to see if any exist after creation
        id
        title
      }
    }
  }
`;

export const ADD_BOOK_MUTATION = gql`
  mutation AddBook($input: AddBookInput!) {
    addBook(input: $input) {
      id
      title
      synopsis # NEW: Return synopsis
      author {
        id
        name
      }
    }
  }
`;

export const UPDATE_AUTHOR_MUTATION = gql`
  mutation UpdateAuthor($id: ObjectID!, $input: UpdateAuthorInput!) {
    updateAuthor(id: $id, input: $input) {
      id
      name
      bio # NEW: Return updated bio
      books {
        id
        title
        synopsis
      }
    }
  }
`;

export const DELETE_AUTHOR_MUTATION = gql`
  mutation DeleteAuthor($id: ObjectID!) {
    deleteAuthor(id: $id)
  }
`;

export const UPDATE_BOOK_MUTATION = gql`
  mutation UpdateBook($id: ObjectID!, $input: UpdateBookInput!) {
    updateBook(id: $id, input: $input) {
      id
      title
      synopsis # NEW: Return updated synopsis
      author {
        id
        name
        bio
      }
    }
  }
`;

export const DELETE_BOOK_MUTATION = gql`
  mutation DeleteBook($id: ObjectID!) {
    deleteBook(id: $id)
  }
`;
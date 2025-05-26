// src/lib/data.ts

// Purpose: To simulate a database for our initial GraphQL learning.
// It provides in-memory arrays for books and authors, allowing us to
// focus on GraphQL concepts without database setup overhead.

// --- Define Data Structures (Interfaces) ---
export interface Author {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  authorId: string; // Reference to Author's ID for relationships
}

// --- Initial In-Memory Data ---
export const authors: Author[] = [
  { id: '1', name: 'J.K. Rowling' },
  { id: '2', name: 'Stephen King' },
  { id: '3', name: 'Agatha Christie' },
  { id: '4', name: 'George Orwell' },
  { id: '5', name: 'Jane Austen' },
];

export const books: Book[] = [
  { id: 'b1', title: 'Harry Potter and the Sorcerer\'s Stone', authorId: '1' },
  { id: 'b2', title: 'Harry Potter and the Chamber of Secrets', authorId: '1' },
  { id: 'b3', title: 'It', authorId: '2' },
  { id: 'b4', title: 'The Shining', authorId: '2' },
  { id: 'b5', title: 'And Then There Were None', authorId: '3' },
  { id: 'b6', title: 'Murder on the Orient Express', authorId: '3' },
  { id: 'b7', title: '1984', authorId: '4' },
  { id: 'b8', title: 'Animal Farm', authorId: '4' },
  { id: 'b9', title: 'Pride and Prejudice', authorId: '5' },
];

// --- Helper Functions (Our "Simulated Database Queries") ---
// These functions mimic how you'd fetch data from a real database.
export const findBookById = (id: string): Book | undefined => books.find(book => book.id === id);
export const findAuthorById = (id: string): Author | undefined => authors.find(author => author.id === id);
export const findBooksByAuthorId = (authorId: string): Book[] => books.filter(book => book.authorId === authorId);

// For mutations: simple ID generation for new entries
export let nextBookId = books.length + 1;
export let nextAuthorId = authors.length + 1;

export const generateNextBookId = () => `b${nextBookId++}`;
export const generateNextAuthorId = () => String(nextAuthorId++);
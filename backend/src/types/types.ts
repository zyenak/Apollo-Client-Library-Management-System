export interface User {
  id: string;
  username: string;
  password: string;
  role: string;
  borrowedBooks?: Book[];
}

export interface CreateUserInput {
  username: string;
  password: string;
  role: string;
}

export interface AuthPayload {
  token: string;
  id: string;
  username: string;
  role: string;
}

export interface Context {
  currentUser: User | null;
}

export interface Book {
  isbn: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface CreateBookInput {
  isbn: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface UpdateBookInput {
  isbn?: string,
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

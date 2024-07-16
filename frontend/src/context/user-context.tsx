import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSnackbar } from './snackbar-context';
import { useQuery, useMutation } from '@apollo/client';
import {
  CREATE_USER,
  DELETE_USER,
  LOGIN_USER,
  BORROW_BOOK,
  RETURN_BOOK,
} from '../graphql/mutations/user-mutations';
import { GET_USER, GET_USERS } from '../graphql/queries/user-queries';
import { Book } from './books-context';

export interface User {
  id: string;
  username: string;
  role: string;
  borrowedBooks: Book[];
}

interface UserContextType {
  user: User | null;
  users: User[];
  isAdmin: boolean;
  loginUser: (username: string, password: string) => void;
  logoutUser: () => void;
  borrowBook: (isbn: string) => void;
  returnBook: (isbn: string) => void;
  addUser: (newUser: User) => void;
  deleteUser: (id: string) => void;
  borrowedBooks: Book[];
  setBorrowedBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  getAllUsers: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const { showMessage } = useSnackbar();

  const { data: fetchedUsers, loading: usersLoading, refetch: refetchUsers } = useQuery(GET_USERS);
  const { data: userData, refetch: refetchUser } = useQuery(GET_USER, {
    variables: { id: user?.id },
    skip: true, 
  });

  const [createUserMutation] = useMutation(CREATE_USER);
  const [deleteUserMutation] = useMutation(DELETE_USER);
  const [loginUserMutation] = useMutation(LOGIN_USER);
  const [borrowBookMutation] = useMutation(BORROW_BOOK);
  const [returnBookMutation] = useMutation(RETURN_BOOK);

  useEffect(() => {
    setIsAdmin(user?.role === 'admin');
    if (user?.role === 'admin') {
     
    }
  }, [user]);

  useEffect(() => {
    if (!usersLoading && fetchedUsers) {
     console.log('Fetched users:', fetchedUsers.users);
     setUsers(fetchedUsers.users);
   }
 }, [usersLoading, fetchedUsers]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser) {
      setUser(storedUser);
      setBorrowedBooks(storedUser.borrowedBooks || []);
    }
  }, []);
 
  

  const loginUser = async (username: string, password: string) => {
    try {
      const { data } = await loginUserMutation({
        variables: { username, password },
      });
  
      
      localStorage.setItem('token', data.loginUser.token);
      if (data) {
        // Fetch complete user data including borrowedBooks
        const { data: userData } = await refetchUser({ id: data.loginUser.id });
  
        if (userData && userData.user) {
          setUser(userData.user);
          setBorrowedBooks(userData.user.borrowedBooks || []);
          localStorage.setItem('user', JSON.stringify(userData.user));
          showMessage('Logged in successfully');
        } else {
          showMessage('Failed to fetch user data after login');
        }
      }
    } catch (error) {
      showMessage('Failed to login');
    }
  };
  

  const logoutUser = () => {
    setUser(null);
    setBorrowedBooks([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    showMessage('Logged out successfully');
  };

  const borrowBook = async (isbn: string) => {
    try {
      const { data } = await borrowBookMutation({
        variables: { userId: user?.id, isbn },
      });
  
      if (data) {
        // Refetch user data to get updated borrowedBooks
        const { data: refetchedUserData } = await refetchUser();
        if (refetchedUserData && refetchedUserData.user) {
          setUser(refetchedUserData.user);
          setBorrowedBooks(refetchedUserData.user.borrowedBooks || []);
          showMessage('Book borrowed successfully');
        } else {
          showMessage('Failed to fetch updated user data');
        }
      }
    } catch (error) {
      showMessage('Failed to borrow book');
    }
  };
  

  const returnBook = async (isbn: string) => {
    try {
      const { data } = await returnBookMutation({
        variables: { userId: user?.id, isbn },
      });
  
      if (data) {
        // Refetch user data to get updated borrowedBooks
        const { data: refetchedUserData } = await refetchUser();
  
        if (refetchedUserData && refetchedUserData.user) {
          setUser(refetchedUserData.user);
          setBorrowedBooks(refetchedUserData.user.borrowedBooks || []);
          showMessage('Book returned successfully');
        } else {
          showMessage('Failed to fetch updated user data');
        }
      }
    } catch (error) {
      showMessage('Failed to return book');
    }
  };


  const addUser = async (newUser: User) => {
    try {
      await createUserMutation({
        variables: { input: newUser },
      });

      showMessage('User added successfully');
      refetchUsers();
    } catch (error) {
      showMessage('Failed to add user');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteUserMutation({
        variables: { id },
      });

      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      showMessage('User deleted successfully');
    } catch (error) {
      showMessage('Failed to delete user');
    }
  };

  const getAllUsers = async () => {
    try {
      await refetchUsers(); // Ensure data is refetched
    } catch (error) {
      showMessage('Failed to fetch users');
    }
  };

  const contextValue: UserContextType = {
    user,
    users,
    isAdmin,
    loginUser,
    logoutUser,
    borrowBook,
    returnBook,
    addUser,
    deleteUser,
    borrowedBooks,
    setBorrowedBooks,
    getAllUsers,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

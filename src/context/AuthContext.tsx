
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: string;
  login: (username: string, password: string) => boolean;
  signup: (username: string, password: string, email?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  // Load login state from localStorage on component mount
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (storedUsers[username]?.password === password) {
      setIsLoggedIn(true);
      setCurrentUser(username);
      localStorage.setItem('currentUser', username);
      return true;
    }
    
    return false;
  };

  const signup = (username: string, password: string, email?: string): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (storedUsers[username]) {
      return false; // Username already exists
    }
    
    const updatedUsers = { 
      ...storedUsers, 
      [username]: { 
        password, 
        email: email || `${username}@example.com`
      } 
    };
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

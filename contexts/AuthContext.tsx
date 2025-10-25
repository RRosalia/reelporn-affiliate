'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { reinitializeEchoWithAuth, disconnectEcho } from '@/lib/echo-config';

interface User {
  id: number;
  name: string;
  username: string;
  email?: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, country: string | number) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Initialize Echo with auth token
      reinitializeEchoWithAuth(token);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post('/login', {
        username,
        password,
      });

      const { token, user } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);

      // Initialize Echo with auth token
      reinitializeEchoWithAuth(token);

      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const register = async (firstName: string, lastName: string, email: string, country: string | number) => {
    try {
      const response = await axiosInstance.post('/register', {
        first_name: firstName,
        last_name: lastName,
        email,
        country_id: country,
      });

      const { token, user } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);

      // Initialize Echo with auth token
      reinitializeEchoWithAuth(token);

      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);

    // Disconnect Echo
    disconnectEcho();

    router.push('/login');
  };

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/account/profile');
      const profileData = response.data.data;

      // Update user with profile data
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

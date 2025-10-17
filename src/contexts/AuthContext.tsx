'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, fetchAuthSession, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import '@/utils/amplify-client';

interface User {
  userId: string;
  username: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const checkAuthState = React.useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check if we have a valid session
      const session = await fetchAuthSession({ forceRefresh: false });
      
      if (session.tokens) {
        // We have tokens, get user info
        const currentUser = await getCurrentUser();
        setUser({
          userId: currentUser.userId,
          username: currentUser.username,
          email: currentUser.signInDetails?.loginId,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('No authenticated user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSignOut = React.useCallback(async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  const refreshSession = React.useCallback(async () => {
    try {
      const session = await fetchAuthSession({ forceRefresh: true });
      if (session.tokens) {
        const currentUser = await getCurrentUser();
        setUser({
          userId: currentUser.userId,
          username: currentUser.username,
          email: currentUser.signInDetails?.loginId,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setUser(null);
    }
  }, []);

  const getIdToken = React.useCallback(async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession({ forceRefresh: false });
      return session.tokens?.idToken?.toString() || null;
    } catch (error) {
      console.error('Failed to get ID token:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    // Initial auth check
    checkAuthState();

    // Listen for auth events
    const hubListener = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          console.log('User signed in');
          checkAuthState();
          break;
        case 'signedOut':
          console.log('User signed out');
          setUser(null);
          break;
        case 'tokenRefresh':
          console.log('Token refreshed');
          refreshSession();
          break;
        case 'tokenRefresh_failure':
          console.log('Token refresh failed');
          setUser(null);
          break;
        case 'signInWithRedirect':
          console.log('Sign in with redirect completed');
          checkAuthState();
          break;
        default:
          break;
      }
    });

    return () => {
      hubListener();
    };
  }, [checkAuthState, refreshSession]); // Now with proper dependencies

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signOut: handleSignOut,
    refreshSession,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

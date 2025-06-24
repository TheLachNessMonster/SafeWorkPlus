import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { nuClient, nuUserService } from '../services/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user_data');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        
        nuClient.token = token;
        
        setState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        // invalid stored data, clear it
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        nuClient.token = 'NULL'; // reset client token
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // find user by email (still needed because BE expects user ID)
      const users: User[] = await nuUserService.getAll();
      const user = users.find(u => u.email === email);

      if (!user) {
        throw new Error('User not found');
      }

      // use login method
      await nuClient.login(user._id, password);

      // token is now automatically stored in nuClient.token
      const token = nuClient.token;

      // store auth data in localStorage for persistence
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));

      setState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
      });

    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // reset client token
    nuClient.token = 'NULL';
    
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const refreshUser = async (): Promise<void> => {
    if (!state.user || !state.token) return;

    try {
      // use client for authenticated request
      // token is automatically included by client
      const updatedUser = await nuUserService.getById(state.user._id);
      
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      setState(prev => ({ ...prev, user: updatedUser }));
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // if token is invalid, logout user
      if (error instanceof Error && error.message.includes('403')) {
        logout();
      }
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
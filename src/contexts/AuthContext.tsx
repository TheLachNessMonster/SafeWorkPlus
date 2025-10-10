import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { nuClient, nuUserService } from '../services/api';
import type { User } from '../types';

//*********************************************************/
//These are the type definitions for handling authorisation
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

interface AuthProviderProps {
  children: ReactNode;
}
//*********************************************************/


//This is the Authorisation Context instance that will be propagated throughout the app
// TODO: NEEDS AN EXPORT
const AuthContext = createContext<AuthContextType | undefined>(undefined);


//This is a React Component for handling authorisation
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });


  // check for existing token on app load
  // This is firing every page change
  //but not on refreshes
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user_data');
    
    if (token && userStr) {
      try {

        
        const user = JSON.parse(userStr);
        //user = nuUserService.getByParam("email/" + email);
        //Depricated 
        // TODO delete ts when uselessness verified
        nuClient.token = token;
        
        setState({
          user:user,
          token:token,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        // invalid stored data, clear it
        //The existence of a token does not trigger an error, it triggers a 403 forbidden, so this handling does not work
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        //depricated
        //nuClient.token = 'NULL'; // reset client token
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  //This is the REACT level login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // find user by email (still needed because BE expects user ID)
      // const users: User[] = await nuUserService.getAll();
      // const user = users.find(u => u.email === email);

      // if (!user) {
      //   throw new Error('User not found');
      // }

      // use login method to get the token
      const token = await nuClient.login(email, password);
      localStorage.setItem('auth_token', token);
      
      //now need to do a separate function call to get the user
      const user = await nuUserService.getByParam("email/" + email);

      // store auth data in localStorage for persistence

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

  //Asuming this is to refresh the user data if changes are made while in a session?  /or to keep an active session live?
  //As written, this may be entirely redundant
  const refreshUser = async (): Promise<void> => {
    if (!state.user || !state.token) return;

    try {
      // use client for authenticated request
      // token is automatically included by client
      const updatedUser = await nuUserService.getByParam(state.user._id);
      
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
    //Here, .Provider is referencing a property of the React.Context<AuthProvider> type
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  //By default, the values received by a useContext call are the default context values
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
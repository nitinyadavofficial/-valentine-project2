import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/types';
import { MOCK_USER } from '@/utils/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('railgo-user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockUser = { ...MOCK_USER, email };
    setUser(mockUser);
    localStorage.setItem('railgo-user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string, phone: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newUser: User = {
      id: `USR${Date.now()}`,
      name,
      email,
      phone,
      savedPassengers: [],
      savedPaymentMethods: [],
      preferences: {
        notifications: { email: true, sms: true, push: true },
        defaultClass: '3A',
        language: 'en',
        currency: 'INR',
      },
    };
    setUser(newUser);
    localStorage.setItem('railgo-user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('railgo-user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('railgo-user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
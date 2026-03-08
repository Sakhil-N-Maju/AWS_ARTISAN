'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type UserRole = 'customer' | 'artisan';

interface AuthContextValue {
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const STORAGE_KEY = 'artisans-active-role';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return (stored as UserRole) || null;
  });

  const login = (nextRole: UserRole) => {
    setRole(nextRole);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextRole);
    }
  };

  const logout = () => {
    setRole(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      role,
      isAuthenticated: role !== null,
      login,
      logout,
    }),
    [role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

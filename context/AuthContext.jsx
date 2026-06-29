'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

const STORAGE_KEY = 'crewsync_user';

// Demo accounts — no backend needed
const DEMO_USERS = {
  provider: {
    id: 2,
    name: 'Sunil Karunaratne',
    email: 'provider@crewsync.lk',
    role: 'SERVICE_PROVIDER',
    avatar: 'SK',
  },
  supplier: {
    id: 3,
    name: 'Malshan Perera',
    email: 'supplier@crewsync.lk',
    role: 'MATERIAL_SUPPLIER',
    avatar: 'MP',
  },
  owner: {
    id: 1,
    name: 'Nimal Kumarasinghe',
    email: 'owner@crewsync.lk',
    role: 'PROPERTY_OWNER',
    avatar: 'NK',
  },
};

export { DEMO_USERS };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch (_) {}
    setLoading(false);
  }, []);

  function login(userData) {
    setUser(userData);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(userData)); } catch (_) {}
  }

  function logout() {
    setUser(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      role:       user?.role ?? null,
      login,
      logout,
      isOwner:    user?.role === 'PROPERTY_OWNER',
      isProvider: user?.role === 'SERVICE_PROVIDER',
      isSupplier: user?.role === 'MATERIAL_SUPPLIER',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

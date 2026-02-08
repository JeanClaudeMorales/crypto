import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import type { User } from '../types/domain';

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!api.tokens.get()) { setLoading(false); return; }
        const me = await api.me();
        setUser(me);
      } catch {
        api.tokens.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = useMemo<AuthState>(() => ({
    user,
    loading,
    async login(email, password) {
      const u = await api.login({ email, password });
      setUser(u);
    },
    async register(name, email, password) {
      const u = await api.register({ name, email, password });
      setUser(u);
    },
    logout() {
      api.tokens.clear();
      setUser(null);
    }
  }), [user, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

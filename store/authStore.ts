import { create } from 'zustand';
import type { User } from '../types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User, token: string) => void;
  updateUser: (patch: Partial<User>) => void;
  signOut: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: (user, token) => set({ user, token, isAuthenticated: true }),
  updateUser: (patch) =>
    set((s) => ({ user: s.user ? { ...s.user, ...patch } : null })),
  signOut: () => set({ user: null, token: null, isAuthenticated: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));

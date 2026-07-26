import { create } from 'zustand';

export interface MinaraUser {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  avatar?: { url: string };
  membership: { type: string; endDate: string };
  darkMode?: boolean;
}

interface AuthState {
  user: MinaraUser | null;
  setUser: (user: MinaraUser | null) => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));

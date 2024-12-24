import { create } from 'zustand';

interface UserState {
  user: { uid: string | null; isAnonymous: boolean } | null;
  setUser: (user: { uid: string | null; isAnonymous: boolean }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));


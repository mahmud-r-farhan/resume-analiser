import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: null,
      setAuth: ({ token, user }) => set({ token, user, error: null }),
      setUser: (user) => set({ user }),
      setError: (error) => set({ error }),
      setLoading: (loading) => set({ loading }),
      logout: () => set({ token: null, user: null, error: null }),
      isAuthenticated: () => Boolean(get().token),
    }),
    {
      name: 'cv-auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);

export default useAuthStore;


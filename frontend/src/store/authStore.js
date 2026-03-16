import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,

  login: (tokens, user) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    set({ user, accessToken: tokens.access, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;

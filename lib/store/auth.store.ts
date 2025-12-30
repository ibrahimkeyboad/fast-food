import { User } from '@/type';
import { create } from 'zustand';
import { getCurrentUser } from '../appwrite';

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isloading: boolean;

  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (isloading: boolean) => void;

  fetchAuthenticatedUser: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isloading: false,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),

  setUser: (user) => set({ user }),
  setIsLoading: (value) => set({ isloading: value }),

  fetchAuthenticatedUser: async () => {
    set({ isloading: true });
    try {
      const user = await getCurrentUser();

      if (user) set({ isAuthenticated: true, user: user as unknown as User });
      else set({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error('Error fetching authenticated user:', error);
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isloading: false });
    }
  },
}));

export default useAuthStore;

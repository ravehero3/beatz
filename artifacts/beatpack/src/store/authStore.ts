import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserType = "rapper" | "beatmaker" | "listener" | "label" | null;

interface User {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  avatarUrl?: string | null;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  userType: UserType;
  _hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuth: (user: User, token: string) => void;
  setUserType: (type: UserType) => void;
  logout: () => void;
  _setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      userType: null,
      _hasHydrated: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setAuth: (user, token) => set({ user, token }),
      setUserType: (userType) => set({ userType }),
      logout: () => set({ user: null, token: null, userType: null }),
      _setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "beatpack-auth",
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true);
      },
    }
  )
);

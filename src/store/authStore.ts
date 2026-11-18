import { create } from "zustand";
import { authService } from "../services/auth.service";
import { saveToken, removeToken, getToken } from "../services/api";
import type { AuthState, User } from "../types";

// Persiste o user no localStorage para restaurar a sessão ao recarregar a página
const STORAGE_KEY = "tournament_user";

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: loadUser(),
  token: getToken() ?? null,
  isAuthenticated: !!getToken(),
  isLoading: false,

  restoreSession: () => {
    const token = getToken();
    const user = loadUser();
    if (token && user) {
      set({ token, user, isAuthenticated: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { token, user } = await authService.login(email, password);
      saveToken(token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      set({ token, user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      await authService.register(name, email, password);
      set({ isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    removeToken();
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

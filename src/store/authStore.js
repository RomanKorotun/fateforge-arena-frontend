import { create } from "zustand";

import {
  current,
  signin,
  signout,
  signup,
  getSessions,
  revokeSession as revokeSessionApi,
  revokeAllSessions,
  deleteMyAccount,
} from "../api/authApi";
import { profileStore } from "./profileStore";

export const authStore = create((set, get) => ({
  user: null,
  sessions: [],
  loading: true,

  // реєстрація
  registerUser: async (body) => {
    try {
      await signup(body);
    } catch (err) {
      console.error("Помилка при реєстрації користувача:", err);
      throw err;
    }
  },

  // логін
  loginUser: async (body) => {
    try {
      const user = await signin(body);
      console.log("authStore", user);
      set({ user });
      return user;
    } catch (err) {
      console.error("Помилка при реєстрації користувача:", err);
      throw err;
    }
  },

  // отримання поточного користувача
  fetchMe: async () => {
    set({ loading: true });
    try {
      const user = await current();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  // отримати всі сесії поточного користувача
  fetchSessions: async () => {
    try {
      const sessions = await getSessions();
      set({ sessions });
    } catch (err) {
      console.error("Помилка при отриманні сесій:", err);
      set({ sessions: [] });
    }
  },

  // завершує поточну сесію користувача - logout (видаляє cookie / токен)
  logoutUser: async () => {
    try {
      const data = await signout();
      set({ user: null });
      return data;
    } catch (err) {
      console.error("Помилка при виході користувача і системи:", err);
      throw err;
    }
  },

  // Відкликання (завершення) сесії користувача по sessionId
  revokeSession: async (sessionId) => {
    try {
      await revokeSessionApi(sessionId);
      set((state) => ({
        sessions: state.sessions.filter((s) => s.sessionId !== sessionId),
      }));
    } catch (err) {
      console.error("Помилка при завершенні сесії:", err);
      throw err;
    }
  },

  // Відкликання (завершення) всіх сесії користувача
  clearAllSessions: async () => {
    try {
      await revokeAllSessions();
      set({ user: null, sessions: [] });
    } catch (err) {
      console.error("Помилка при logout all sessions:", err);
      throw err;
    }
  },

  // видалення акаунта, видалення всіх активних сесій, очищення кукі,  (SOFT DELETE)
  deleteAccount: async () => {
    try {
      await deleteMyAccount();
      profileStore.getState().clearProfile();
      get().clearAuth();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  clearAuth: () => set({ user: null, sessions: [] }),
}));

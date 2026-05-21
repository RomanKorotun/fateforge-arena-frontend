import { create } from "zustand";
import {
  createGameSession,
  placeBet as placeBetApi,
  leaveGame as leaveGameApi,
  getUserSessions,
} from "../api/rouletteApi";

export const rouletteStore = create((set, get) => ({
  session: null,
  activeSessions: [],
  bets: [],
  selectedNumber: null,

  // 🎯 створення сесії через API
  createSession: async () => {
    try {
      const session = await createGameSession();
      set({ session });
      return session;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  // 🎯 зайти в сесію (з URL)
  setSession: (session) => {
    set({ session });
  },

  // ставки
  placeBet: async (payload) => {
    const result = await placeBetApi(payload);
    console.log(result);
    set((state) => ({
      lastResult: result, // тут зберігаємо результат останнього спіну
    }));
  },

  clearBets: () => set({ bets: [] }),

  setSelectedNumber: (number) => set({ selectedNumber: number }),

  leaveGame: async (sessionId) => {
    if (!sessionId) return;
    await leaveGameApi(sessionId);
    set({
      session: null,
      bets: [],
      selectedNumber: null,
    });
  },
  // 🎯 отримати всі сесії користувача з бекенду
  fetchSessions: async () => {
    try {
      const sessions = await getUserSessions();
      set({ activeSessions: sessions });
    } catch (err) {
      console.error("Fetch sessions error:", err);
      throw err;
    }
  },
}));

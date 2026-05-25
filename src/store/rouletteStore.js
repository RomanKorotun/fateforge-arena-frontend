import { create } from "zustand";
import {
  createGameSession,
  placeBet as placeBetApi,
  leaveGame as leaveGameApi,
  getUserSessions,
} from "../api/rouletteApi";

export const rouletteStore = create((set) => ({
  session: null,
  activeSessions: [],
  bets: [],
  selectedNumber: null,

  // створення ігрової кімнати
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

  // зайти в сесію (з URL)
  setSession: (session) => {
    set({ session });
  },

  // зробити ставку
  placeBet: async (payload) => {
    const result = await placeBetApi(payload);
    set((state) => ({ lastResult: result }));
  },

  clearBets: () => set({ bets: [] }),

  setSelectedNumber: (number) => set({ selectedNumber: number }),

  // закриття ігрової кімнати
  leaveGame: async (sessionId) => {
    if (!sessionId) return;
    await leaveGameApi(sessionId);
    set({ session: null, bets: [], selectedNumber: null });
  },
  // отримати всі ігрові сесії користувача
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

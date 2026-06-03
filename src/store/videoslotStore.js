import { create } from "zustand";

import {
  createVideoSlotGame,
  getCurrentVideoSlotSession,
  playVideoSlotSpin,
  endVideoSlotGame,
  getHistoryVideoSlotGame,
} from "../api/videoslotApi";

export const videoslotStore = create((set) => ({
  currentGameSession: null,
  videoSlotHistory: [],
  videoSlotPagination: null,

  // створення гри
  createGame: async (walletId) => {
    try {
      const currentGameSession = await createVideoSlotGame(walletId);
      set({ currentGameSession });
      return currentGameSession;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  // отримати історію ігрових сесій
  fetchVideoSlotHistory: async (filters) => {
    try {
      const query = new URLSearchParams(
        Object.entries(filters).filter(
          ([, v]) => v !== "" && v !== null && v !== undefined,
        ),
      ).toString();

      const res = await getHistoryVideoSlotGame(query);

      set({
        videoSlotHistory: res.data,
        videoSlotPagination: res.pagination,
      });
    } catch (err) {
      console.error("History error:", err);
    }
  },

  // встановити сесію (наприклад з URL)
  setSession: (currentGameSession) => {
    set({ currentGameSession });
  },

  // отримати активну сесію
  fetchCurrentSession: async () => {
    try {
      const currentGameSession = await getCurrentVideoSlotSession();
      set({ currentGameSession });
    } catch (err) {
      console.error("Fetch session error:", err);
    }
  },

  // spin
  playSpin: async (payload) => {
    try {
      const result = await playVideoSlotSpin(payload);

      set({ lastSpinResult: result });

      return result;
    } catch (err) {
      console.error("Spin error:", err);
      throw err;
    }
  },

  // завершення гри
  endGame: async (gameId) => {
    try {
      await endVideoSlotGame(gameId);
      set({ currentGameSession: null });
    } catch (err) {
      console.error("End game error:", err);
      throw err;
    }
  },

  // очистка
  clear: () => set({ currentGameSession: null }),
}));

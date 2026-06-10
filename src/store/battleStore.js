import { create } from "zustand";
import { getBattleLeaderboard } from "../api/battleApi";

export const battleStore = create((set) => ({
  leaderboard: [],

  fetchLeaderboard: async () => {
    try {
      const data = await getBattleLeaderboard();

      set({ leaderboard: data });
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    }
  },
}));

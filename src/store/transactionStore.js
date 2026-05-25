import { create } from "zustand";
import { getTransactions } from "../api/transactionApi";

export const transactionStore = create((set) => ({
  transactions: [],
  pagination: null,

  // отримати список транзакцій
  fetchTransactions: async (params = {}) => {
    try {
      const query = new URLSearchParams(
        Object.entries(params).filter(
          ([, v]) => v !== "" && v !== null && v !== undefined,
        ),
      ).toString();
      const data = await getTransactions(query);
      set({ transactions: data.data, pagination: data.pagination });
    } catch (err) {
      console.error("Transactions error:", err);
      set({ transactions: [], pagination: null });
    }
  },
}));

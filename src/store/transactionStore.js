// // src/store/transactionStore.js

// import { create } from "zustand";

// import { getTransactions } from "../api/transactionApi";

// export const transactionStore = create((set) => ({
//   transactions: [],
//   pagination: null,
//   loading: false,

//   fetchTransactions: async (params = {}) => {
//     try {
//       set({ loading: true });

//       const response = await getTransactions(params);

//       set({
//         transactions: response.data,
//         pagination: response.pagination,
//         loading: false,
//       });

//       return response;
//     } catch (err) {
//       console.error("Помилка при отриманні транзакцій:", err);

//       set({
//         transactions: [],
//         pagination: null,
//         loading: false,
//       });

//       throw err;
//     }
//   },

//   clearTransactions: () =>
//     set({
//       transactions: [],
//       pagination: null,
//     }),
// }));

import { create } from "zustand";
import { getTransactions } from "../api/transactionApi";

export const transactionStore = create((set) => ({
  transactions: [],
  pagination: null,
  loading: false,

  fetchTransactions: async (params = {}) => {
    try {
      set({ loading: true });

      const query = new URLSearchParams(
        Object.entries(params).filter(
          ([_, v]) => v !== "" && v !== null && v !== undefined,
        ),
      ).toString();

      const data = await getTransactions(query);

      set({
        transactions: data.data,
        pagination: data.pagination,
        loading: false,
      });
    } catch (err) {
      console.error("Transactions error:", err);

      set({
        transactions: [],
        pagination: null,
        loading: false,
      });
    }
  },
}));

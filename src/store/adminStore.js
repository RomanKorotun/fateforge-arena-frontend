import { create } from "zustand";
import { updateUserStatus, getUsers } from "../api/adminApi";

export const adminStore = create((set, get) => ({
  users: [],

  // отримати всіх юзерів
  fetchUsers: async () => {
    try {
      const users = await getUsers();
      set({ users });
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  },

  // змінити статус (локально оновлюємо тільки status)
  updateStatus: async (userId, status) => {
    try {
      await updateUserStatus(userId, status);

      set((state) => ({
        users: state.users.map((u) => (u.id === userId ? { ...u, status } : u)),
      }));
    } catch (err) {
      console.error("Update status error:", err);
      throw err;
    }
  },
}));

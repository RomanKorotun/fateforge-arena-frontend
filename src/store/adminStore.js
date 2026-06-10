import { create } from "zustand";
import { banUser, getUsers, unbanUser } from "../api/adminApi";

export const adminStore = create((set) => ({
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

  banUser: async (id, banEndAt) => {
    try {
      const updated = await banUser(id, banEndAt);

      set((state) => ({
        users: state.users.map((u) =>
          u.id === id
            ? {
                ...u,
                ...updated,
              }
            : u,
        ),
      }));
    } catch (err) {
      console.error("Ban error:", err);
    }
  },

  unbanUser: async (id) => {
    try {
      const updated = await unbanUser(id);

      set((state) => ({
        users: state.users.map((u) =>
          u.id === id
            ? {
                ...u,
                ...updated,
              }
            : u,
        ),
      }));
    } catch (err) {
      console.error("Unban error:", err);
    }
  },
}));

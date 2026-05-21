import { create } from "zustand";

import {
  getFullUserProfile,
  getPublicUsers,
  uploadAvatar,
  createClientSeed,
  updateClientSeed,
  getClientSeed,
} from "../api/profileApi";

export const profileStore = create((set, get) => ({
  profile: null,
  users: [],
  wallets: [],
  clientSeed: "",

  // ================= PROFILE =================
  fetchProfile: async () => {
    try {
      const { profile, wallets } = await getFullUserProfile();

      set({
        profile,
        wallets,
      });
    } catch (err) {
      console.error("Помилка при отриманні профілю:", err);
      set({ profile: null, wallets: [], clientSeed: "" });
    }
  },

  // ================= USERS =================
  fetchUsers: async () => {
    try {
      const users = await getPublicUsers();
      set({ users });
    } catch (err) {
      console.error("Помилка при отриманні користувачів:", err);
    }
  },

  // ================= AVATAR =================
  uploadUserAvatar: async (file) => {
    try {
      const data = await uploadAvatar(file);

      const currentProfile = get().profile;

      set({
        profile: {
          ...currentProfile,
          profile: {
            ...currentProfile?.profile,
            avatar: data.avatarUrl,
          },
        },
      });

      return data;
    } catch (err) {
      console.error("Помилка при завантаженні аватара:", err);
      throw err;
    }
  },

  // ================= SEED CREATE =================
  createSeed: async (clientSeed) => {
    try {
      const data = await createClientSeed(clientSeed);

      set({ clientSeed: data.clientSeed });

      return data;
    } catch (err) {
      console.error("Помилка create seed:", err);
      throw err;
    }
  },

  // ================= SEED UPDATE =================
  updateSeed: async (clientSeed) => {
    try {
      const data = await updateClientSeed(clientSeed);

      set({ clientSeed: data.clientSeed });

      return data;
    } catch (err) {
      console.error("Помилка update seed:", err);
      throw err;
    }
  },

  // ================= GET SEED =================
  fetchClientSeed: async () => {
    try {
      const data = await getClientSeed();

      set({
        clientSeed: data.clientSeed,
      });

      return data;
    } catch (err) {
      console.error("Помилка get seed:", err);
      set({ clientSeed: "" });
    }
  },

  // ================= CLEAR =================
  clearProfile: () =>
    set({
      profile: null,
      wallets: [],
      clientSeed: "",
    }),
}));

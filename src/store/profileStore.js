import { create } from "zustand";

import {
  getFullUserProfile,
  uploadAvatar,
  createClientSeed,
  updateClientSeed,
  getClientSeed,
  getUserAddress,
  createUserAddress,
  updateUserAddress,
} from "../api/profileApi";
import { getMyWallets } from "../api/walletsApi";

export const profileStore = create((set) => ({
  avatar: null,
  wallets: [],
  clientSeed: "",
  address: null,

  // Профіль залогіненого користувача (avatar та гаманці)
  fetchProfile: async () => {
    try {
      const { profile, wallets } = await getFullUserProfile();
      set({ avatar: profile.avatar, wallets });
    } catch (err) {
      console.error("Помилка при отриманні профілю:", err);
    }
  },

  // оновлення тільки гаманців
  fetchWallets: async () => {
    try {
      const wallets = await getMyWallets();
      set({ wallets });
      return wallets;
    } catch (err) {
      console.error("Помилка при отриманні гаманців:", err);
    }
  },

  // GET address
  fetchAddress: async () => {
    try {
      const address = await getUserAddress();
      set({ address });
      return address;
    } catch (err) {
      console.error("Помилка get address:", err);
    }
  },

  // CREATE address
  createAddress: async (payload) => {
    try {
      const data = await createUserAddress(payload);
      set({ address: data });
      return data;
    } catch (err) {
      console.error("Помилка create address:", err);
      throw err;
    }
  },

  // UPDATE address
  updateAddress: async (payload) => {
    try {
      await updateUserAddress(payload);
    } catch (err) {
      console.error("Помилка update address:", err);
      throw err;
    }
  },

  // upload avatar
  uploadUserAvatar: async (file) => {
    try {
      const data = await uploadAvatar(file);
      set({ avatar: data.avatarUrl });
    } catch (err) {
      console.error("Помилка при завантаженні аватара:", err);
      throw err;
    }
  },

  // створення клієнтського сіда
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

  // оновлення клієнтського сіда
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

  // отримати клієнтський сід
  fetchClientSeed: async () => {
    try {
      const data = await getClientSeed();
      set({ clientSeed: data.clientSeed });
      return data;
    } catch (err) {
      console.error("Помилка get seed:", err);
      set({ clientSeed: "" });
      throw err;
    }
  },

  // очищення профіля
  clearProfile: () =>
    set({ avatar: null, wallets: [], clientSeed: "", address: null }),
}));

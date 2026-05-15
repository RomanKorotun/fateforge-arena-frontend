import { create } from "zustand";

import {
  getFullUserProfile,
  getPublicUsers,
  uploadAvatar,
} from "../api/profileApi";

export const profileStore = create((set, get) => ({
  profile: null,
  users: [],
  loading: false,

  // отримати профіль
  fetchProfile: async () => {
    set({ loading: true });

    try {
      const profile = await getFullUserProfile();

      set({
        profile,
        loading: false,
      });
    } catch (err) {
      console.error("Помилка при отриманні профілю:", err);

      set({
        profile: null,
        loading: false,
      });
    }
  },

  // users list
  fetchUsers: async () => {
    try {
      const users = await getPublicUsers();

      console.log(users);

      set({ users });
    } catch (err) {
      console.error("Помилка при отриманні користувачів:", err);
    }
  },

  // upload avatar
  uploadUserAvatar: async (file) => {
    try {
      const data = await uploadAvatar(file);
      console.log(data);

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

  clearProfile: () =>
    set({
      profile: null,
    }),
}));

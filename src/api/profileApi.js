import apiClient from "./apiClient";

// Профіль залогіненого користувача
export const getFullUserProfile = async () => {
  const { data } = await apiClient.get("/users/me");

  return data;
};

// upload avatar
export const uploadAvatar = async (file) => {
  const formData = new FormData();

  formData.append("avatar", file);

  const { data } = await apiClient.post("/users/me/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// users rating
export const getPublicUsers = async () => {
  const { data } = await apiClient.get("/users");
  return data;
};

import apiClient from "./apiClient";

// отримати всіх користувачів (ADMIN)
export const getUsers = async () => {
  const { data } = await apiClient.get("/admin/users");
  return data;
};

// змінити статус користувача (ACTIVE / BANNED)
export const updateUserStatus = async (userId, status) => {
  const { data } = await apiClient.patch(`/admin/users/${userId}/status`, {
    status,
  });
  return data;
};

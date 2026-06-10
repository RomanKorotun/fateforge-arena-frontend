import apiClient from "./apiClient";

// отримати всіх користувачів (ADMIN)
export const getUsers = async () => {
  const { data } = await apiClient.get("/admin/users");
  return data;
};

// бан юзера
export const banUser = async (id, banEndAt) => {
  const { data } = await apiClient.patch(`/admin/users/${id}/ban`, {
    banEndAt,
  });
  return data;
};

// розбанити юзера
export const unbanUser = async (id) => {
  const { data } = await apiClient.patch(`/admin/users/${id}/unban`);
  return data;
};

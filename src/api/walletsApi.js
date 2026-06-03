import apiClient from "./apiClient";

// Гаманці залогіненого користувача
export const getMyWallets = async () => {
  const { data } = await apiClient.get("/wallets/all");
  return data.wallets;
};

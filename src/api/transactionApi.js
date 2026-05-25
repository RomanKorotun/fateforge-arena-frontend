import apiClient from "./apiClient";

// отримати транзакції
export const getTransactions = async (queryString) => {
  const url = queryString ? `/transactions?${queryString}` : "/transactions";
  const { data } = await apiClient.get(url);
  return data;
};

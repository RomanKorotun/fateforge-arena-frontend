import apiClient from "./apiClient";

// створити сесію слота
export const createVideoSlotGame = async (walletId) => {
  const { data } = await apiClient.post("/videoslot/start", { walletId });
  return data;
};

// отримати активну сесію
export const getCurrentVideoSlotSession = async () => {
  const { data } = await apiClient.get("/videoslot/current-session");
  return data;
};

// зробити spin
export const playVideoSlotSpin = async (payload) => {
  const { data } = await apiClient.post("/videoslot/play-spin", payload);
  return data;
};

// завершити гру
export const endVideoSlotGame = async (gameId) => {
  const { data } = await apiClient.delete(`/videoslot/${gameId}`);
  return data;
};

// отриммати історію гри
export const getHistoryVideoSlotGame = async (queryString) => {
  const url = queryString
    ? `/videoslot/history?${queryString}`
    : "/videoslot/history";
  const { data } = await apiClient.get(url);
  return data;
};

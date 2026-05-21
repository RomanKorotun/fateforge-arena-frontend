import apiClient from "./apiClient";

// створити сесію
export const createGameSession = async () => {
  const { data } = await apiClient.post("/roulette/join");
  return data;
};

// отримати історію ставок
export const getGameHistory = async (sessionId) => {
  const { data } = await apiClient.get("/roulette/history", {
    params: { gameSessionId: sessionId },
  });
  return data;
};

// поставити ставку
export const placeBet = async (payload) => {
  const { data } = await apiClient.post("/roulette/bet", payload);
  return data;
};

// вийти з гри
export const leaveGame = async (sessionId) => {
  const { data } = await apiClient.patch(`/roulette/leave/${sessionId}`);
  return data;
};

// отримати всі сесії користувача
export const getUserSessions = async () => {
  const { data } = await apiClient.get("/roulette/sessions");
  return data;
};

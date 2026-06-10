import apiClient from "./apiClient";

// отримати рейтинг (leaderboard)
export const getBattleLeaderboard = async () => {
  const { data } = await apiClient.get("/users/battle-leaderboard");
  return data;
};

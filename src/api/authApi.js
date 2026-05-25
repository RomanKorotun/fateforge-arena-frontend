import apiClient from "./apiClient";

// реєстрація
export const signup = async (body) => {
  const { data } = await apiClient.post("/auth/signup", body);
  return data;
};

// логін
export const signin = async (body) => {
  const { data } = await apiClient.post("/auth/signin", body);
  return data;
};

// отримання поточного користувача
export const current = async () => {
  const { data } = await apiClient.get("/auth/current");
  return data;
};

// отримати всі сесії поточного користувача
export const getSessions = async () => {
  const { data } = await apiClient.get("/auth/sessions");
  return data;
};

// завершує поточну сесію користувача - logout (видаляє cookie / токен)
export const signout = async () => {
  const { data } = await apiClient.post("/auth/signout");
  return data;
};

// Відкликання (завершення) сесії користувача по sessionId
export const revokeSession = async (sessionId) => {
  const { data } = await apiClient.delete(`/auth/sessions/${sessionId}/revoke`);
  return data;
};

// Відкликання (завершення) всіх сесії користувача
export const revokeAllSessions = async () => {
  const { data } = await apiClient.delete("/auth/sessions/revoke-all");
  return data;
};

// видалення акаунта, видалення всіх активних сесій, очищення кукі,  (SOFT DELETE)
export const deleteMyAccount = async () => {
  const { data } = await apiClient.delete("/auth/me");
  return data;
};

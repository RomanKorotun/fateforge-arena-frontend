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
  const { data } = await apiClient.get("/auth/me");
  return data;
};

// завершує поточну сесію користувача (видаляє cookie / токен)
export const signout = async () => {
  const { data } = await apiClient.post("/auth/signout");
  return data;
};

// отримати всі сесії поточного користувача
export const getSessions = async () => {
  const { data } = await apiClient.get("/auth/sessions");
  return data;
};

// відкликати (видалити) сесію
export const revokeSession = async (sessionId) => {
  const { data } = await apiClient.delete(`/auth/sessions/${sessionId}/revoke`);
  return data;
};

// logout all sessions
export const revokeAllSessions = async () => {
  const { data } = await apiClient.delete("/auth/sessions/revoke-all");
  return data;
};

// отримання списку користувачів (лише для ADMIN)
export const getUsers = async () => {
  const { data } = await apiClient.get("/users");
  return data;
};

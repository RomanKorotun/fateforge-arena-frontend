import apiClient from "./apiClient";

// Профіль залогіненого користувача (avatar та гаманці)
export const getFullUserProfile = async () => {
  const { data } = await apiClient.get("/users/me");
  return data;
};

// GET address
export const getUserAddress = async () => {
  const { data } = await apiClient.get("/users/me/address");
  return data;
};

// CREATE address
export const createUserAddress = async (payload) => {
  const { data } = await apiClient.post("/users/me/address", payload);
  return data;
};

// UPDATE address
export const updateUserAddress = async (payload) => {
  const { data } = await apiClient.patch("/users/me/address", payload);
  return data;
};

// upload avatar
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await apiClient.post("/users/me/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// create seed
export const createClientSeed = async (clientSeed) => {
  const { data } = await apiClient.post("/users/me/client-seed", {
    clientSeed,
  });
  return data;
};

// update seed
export const updateClientSeed = async (clientSeed) => {
  const { data } = await apiClient.put("/users/me/client-seed", {
    clientSeed,
  });
  return data;
};

// GET seed
export const getClientSeed = async () => {
  const { data } = await apiClient.get("/users/me/client-seed");
  return data;
};

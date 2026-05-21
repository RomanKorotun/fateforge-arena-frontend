import apiClient from "./apiClient";

export const createDeposit = async (payload, idempotencyKey) => {
  const { data } = await apiClient.post("/payment/create-deposit", payload, {
    headers: { "idempotency-key": idempotencyKey },
  });
  return data;
};

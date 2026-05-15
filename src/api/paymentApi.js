import apiClient from "./apiClient";

export const createDeposit = async (payload, idempotencyKey) => {
  const { data } = await apiClient.post("/payment/deposit", payload, {
    headers: { "idempotency-key": idempotencyKey },
  });
  return data;
};

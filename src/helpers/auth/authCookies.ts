import api from "../api";

export const setAuthToken = async (token: string) => {
  await api.post("auth/set-token", { json: { token } });
};

export const removeAuthToken = async () => {
  await api.post("auth/remove-token");
};
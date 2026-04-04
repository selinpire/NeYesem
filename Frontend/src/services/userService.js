import api from "./api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export function getApiErrorMessage(error, fallback = "Bir hata oluştu") {
  const msg = error.response?.data?.message;
  return typeof msg === "string" && msg.trim() ? msg : fallback;
}

export const getProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`, { headers: authHeader() });
  return response.data;
};

export const updateProfile = async (userId, data) => {
  const response = await api.put(`/users/${userId}`, data, { headers: authHeader() });
  return response.data;
};

export const deleteAccount = async (userId) => {
  const response = await api.delete(`/users/${userId}`, { headers: authHeader() });
  return response.data;
};

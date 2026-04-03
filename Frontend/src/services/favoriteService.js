import api from "./api";

export const getFavorites = async () => {
  const response = await api.get("/favorites", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

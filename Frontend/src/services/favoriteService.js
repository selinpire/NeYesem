import api from "./api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export function buildFavoriteRecipeIdSet(favorites) {
  if (!Array.isArray(favorites)) return new Set();
  const ids = favorites
    .map((f) => {
      const r = f.recipe;
      if (!r) return null;
      return typeof r === "object" && r._id != null ? String(r._id) : String(r);
    })
    .filter(Boolean);
  return new Set(ids);
}

export const getFavorites = async () => {
  const response = await api.get("/favorites", { headers: authHeader() });
  return response.data;
};

export const toggleFavorite = async (recipeId) => {
  const response = await api.post(
    `/recipes/${recipeId}/favorite`,
    {},
    { headers: authHeader() }
  );
  return response.data;
};

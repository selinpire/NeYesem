import api from "./api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getAllRecipes = async () => {
  const response = await api.get("/recipes");
  return response.data;
};

export const searchRecipes = async (query) => {
  const response = await api.get(`/recipes/search?q=${query}`);
  return response.data;
};

export const getRecipeById = async (id) => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.get(`/recipes/${id}`, { headers });
  return response.data;
};

export const getRecipesByCategory = async (category) => {
  const response = await api.get(`/recipes/category/list?category=${category}`);
  return response.data;
};

export const addRecipe = async (recipeData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/recipes", recipeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMyRecipes = async () => {
  const response = await api.get("/recipes/my", {
    headers: authHeader(),
  });
  return response.data;
};

export const updateRecipe = async (recipeId, recipeData) => {
  const response = await api.put(`/recipes/${recipeId}`, recipeData, {
    headers: authHeader(),
  });
  return response.data;
};

export const deleteRecipe = async (recipeId) => {
  const response = await api.delete(`/recipes/${recipeId}`, {
    headers: authHeader(),
  });
  return response.data;
};

export const deleteRecipeVideo = async (recipeId) => {
  const response = await api.delete(`/recipes/${recipeId}/video`, {
    headers: authHeader(),
  });
  return response.data;
};
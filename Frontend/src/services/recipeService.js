import api from "./api";

export const getAllRecipes = async () => {
  const response = await api.get("/recipes");
  return response.data;
};

export const searchRecipes = async (query) => {
  const response = await api.get(`/recipes/search?q=${query}`);
  return response.data;
};

export const getRecipeById = async (id) => {
  const response = await api.get(`/recipes/${id}`);
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
  const token = localStorage.getItem("token");
  const response = await api.get("/recipes/my", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
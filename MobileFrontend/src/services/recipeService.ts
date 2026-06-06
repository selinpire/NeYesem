import api from "./api";
import { Recipe, RecipePayload } from "../types";

export async function getAllRecipes() {
  const response = await api.get<Recipe[]>("/recipes");
  return response.data;
}

export async function searchRecipes(query: string, options: { saveHistory?: boolean } = {}) {
  const { saveHistory = false } = options;

  if (saveHistory) {
    const response = await api.get<Recipe[]>("/search/recipes", {
      params: { q: query },
    });
    return response.data;
  }

  const response = await api.get<Recipe[]>("/recipes/search", {
    params: { q: query },
  });
  return response.data;
}

export async function getLastSearches() {
  const response = await api.get<{ searches: string[] }>("/search/last-searches");
  return response.data.searches || [];
}

export async function clearLastSearches() {
  await api.delete("/search/last-searches");
}

export async function getRecipesByCategory(category: string) {
  const response = await api.get<Recipe[]>("/recipes/category/list", {
    params: { category },
  });
  return response.data;
}

export async function getRecipeById(recipeId: string) {
  const response = await api.get<Recipe>(`/recipes/${recipeId}`);
  return response.data;
}

export async function addRecipe(payload: RecipePayload) {
  const response = await api.post("/recipes", payload);
  return response.data;
}

export async function getMyRecipes() {
  const response = await api.get<Recipe[]>("/recipes/my");
  return response.data;
}

export async function updateRecipe(recipeId: string, payload: Partial<RecipePayload>) {
  const response = await api.put(`/recipes/${recipeId}`, payload);
  return response.data;
}

export async function deleteRecipe(recipeId: string) {
  const response = await api.delete(`/recipes/${recipeId}`);
  return response.data;
}

export async function deleteRecipeVideo(recipeId: string) {
  const response = await api.delete(`/recipes/${recipeId}/video`);
  return response.data;
}

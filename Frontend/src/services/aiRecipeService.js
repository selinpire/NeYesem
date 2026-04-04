import api from "./api";

export async function suggestRecipesByMood(mood) {
  const response = await api.post("/ai/suggest-recipes-by-mood", { mood });
  return response.data;
}

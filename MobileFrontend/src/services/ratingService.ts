import api from "./api";
import { RatingResponse } from "../types";

export async function submitRecipeRating(recipeId: string, score: number) {
  const response = await api.post<RatingResponse>(`/recipes/${recipeId}/rating`, {
    score,
  });
  return response.data;
}

import api from "./api";
import { CommentResponse } from "../types";

export async function addRecipeComment(recipeId: string, text: string) {
  const response = await api.post<CommentResponse>(`/recipes/${recipeId}/comments`, {
    text,
  });
  return response.data;
}

export async function deleteRecipeComment(recipeId: string, commentId: string) {
  const response = await api.delete<CommentResponse>(
    `/recipes/${recipeId}/comments/${commentId}`
  );
  return response.data;
}

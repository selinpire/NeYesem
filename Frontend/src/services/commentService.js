import api from "./api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function addRecipeComment(recipeId, text) {
  const response = await api.post(
    `/recipes/${recipeId}/comments`,
    { text },
    { headers: authHeader() }
  );
  return response.data;
}

export async function deleteRecipeComment(recipeId, commentId) {
  const response = await api.delete(`/recipes/${recipeId}/comments/${commentId}`, {
    headers: authHeader(),
  });
  return response.data;
}

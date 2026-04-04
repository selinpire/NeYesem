import api from "./api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const submitRecipeRating = async (recipeId, score) => {
  const response = await api.post(
    `/recipes/${recipeId}/rating`,
    { score },
    { headers: authHeader() }
  );
  return response.data;
};

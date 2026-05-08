import api from "./api";
import { FavoriteItem, ToggleFavoriteResponse } from "../types";

export function buildFavoriteRecipeIdSet(favorites: FavoriteItem[]) {
  const ids = favorites
    .map((favorite) => {
      const recipe = favorite.recipe;
      if (!recipe) {
        return null;
      }
      if (typeof recipe === "string") {
        return recipe;
      }
      return recipe._id;
    })
    .filter(Boolean) as string[];

  return new Set(ids.map(String));
}

export async function getFavorites() {
  const response = await api.get<FavoriteItem[]>("/favorites");
  return response.data;
}

export async function toggleFavorite(recipeId: string) {
  const response = await api.post<ToggleFavoriteResponse>(`/recipes/${recipeId}/favorite`, {});
  return response.data;
}

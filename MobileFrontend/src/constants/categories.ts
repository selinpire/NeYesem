export const allRecipeCategory = "Tümü";

export const recipeCategories = [
  "Ana Yemek",
  "Çorba",
  "Tatlı",
  "Salata",
  "Kahvaltı",
  "İçecek",
  "Atıştırmalık",
  "Diğer",
] as const;

export const recipeFilterCategories = [allRecipeCategory, ...recipeCategories] as const;

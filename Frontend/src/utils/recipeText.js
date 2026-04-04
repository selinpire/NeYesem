/** Kart listeleri için açıklama özeti (detay sayfasında tam metin gösterilir). */
export function truncateRecipeDescription(text, maxChars = 120) {
  if (!text || typeof text !== "string") return "";
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxChars) return normalized;
  return `${normalized.slice(0, maxChars).trim()}…`;
}

export function recipeOwnerId(recipe) {
  if (!recipe?.createdBy) return null;
  const v = recipe.createdBy;
  if (typeof v === "object" && v !== null && v._id != null) return String(v._id);
  return String(v);
}

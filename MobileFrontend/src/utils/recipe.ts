import { Recipe, RecipeOwner } from "../types";

export function truncateRecipeDescription(text?: string, maxChars = 120) {
  if (!text || typeof text !== "string") {
    return "";
  }

  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxChars) {
    return normalized;
  }

  return `${normalized.slice(0, maxChars).trim()}...`;
}

export function recipeOwnerId(recipe?: Recipe | null) {
  const owner = recipe?.createdBy;
  return recipeOwnerFromValue(owner);
}

export function recipeOwnerFromValue(owner?: RecipeOwner | null) {
  if (!owner) {
    return null;
  }
  if (typeof owner === "object" && owner._id) {
    return String(owner._id);
  }
  return String(owner);
}

export function splitLinesToList(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function formatCommentDate(value?: string) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

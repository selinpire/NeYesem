const Recipe = require("../models/recipe");
const redisService = require("./redisService");

const REDIS_KEY = "recipe:autocomplete";

const rebuildCache = async () => {
  const recipes = await Recipe.find().select("title").lean();
  const titles = [...new Set(recipes.map((r) => r.title).filter(Boolean))];
  await redisService.set(REDIS_KEY, titles);
  return titles;
};

const getSuggestions = async (query) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  let cached = await redisService.get(REDIS_KEY);
  let titles = cached ? JSON.parse(cached) : null;

  if (!titles) {
    titles = await rebuildCache();
  }

  return titles.filter((title) => title.toLowerCase().startsWith(q)).slice(0, 10);
};

module.exports = {
  rebuildCache,
  getSuggestions,
};

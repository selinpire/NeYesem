const Recipe = require("../models/recipe");
const { attachSummaries } = require("../utils/recipeRatingStats");
const lastSearchService = require("../services/lastSearchService");

const searchRecipes = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q || !q.trim()) {
      return res.status(400).json({ message: "Arama sorgusu gerekli" });
    }

    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    });

    const withRatings = await attachSummaries(recipes);

    try {
      await lastSearchService.addSearch(req.user.id, q.trim());
    } catch (redisError) {
      console.log("Son arama kaydedilemedi:", redisError.message);
    }

    res.status(200).json(withRatings);
  } catch (error) {
    res.status(500).json({
      message: "Arama yapılamadı",
      error: error.message,
    });
  }
};

const getLastSearches = async (req, res) => {
  try {
    const searches = await lastSearchService.getLastSearches(req.user.id);
    res.status(200).json({ searches });
  } catch (error) {
    res.status(503).json({
      message: "Son aramalar alınamadı",
      error: error.message,
    });
  }
};

const clearLastSearches = async (req, res) => {
  try {
    await lastSearchService.clearLastSearches(req.user.id);
    res.status(200).json({ message: "Son aramalar temizlendi" });
  } catch (error) {
    res.status(503).json({
      message: "Son aramalar temizlenemedi",
      error: error.message,
    });
  }
};

module.exports = {
  searchRecipes,
  getLastSearches,
  clearLastSearches,
};

const Favorite = require("../models/favorite");
const Recipe = require("../models/recipe");
const { attachSummaries } = require("../utils/recipeRatingStats");

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate("recipe");
    const recipes = favorites.map((f) => f.recipe).filter(Boolean);
    const enrichedList = await attachSummaries(recipes);
    const byId = new Map(enrichedList.map((r) => [String(r._id), r]));

    const payload = favorites.map((f) => {
      const o = f.toObject ? f.toObject() : { ...f };
      if (o.recipe) {
        const enriched = byId.get(String(o.recipe._id));
        o.recipe = enriched || o.recipe;
      }
      return o;
    });

    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ message: "Favoriler listelenirken hata oluştu", error: error.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Tarif bulunamadı." });
    }

    const existing = await Favorite.findOne({ user: userId, recipe: recipeId });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      recipe.favoritesCount = Math.max(0, (recipe.favoritesCount || 0) - 1);
      await recipe.save();
      return res.status(200).json({
        favorited: false,
        favoritesCount: recipe.favoritesCount,
        message: "Favorilerden çıkarıldı.",
      });
    }

    await Favorite.create({ user: userId, recipe: recipeId });
    recipe.favoritesCount = (recipe.favoritesCount || 0) + 1;
    await recipe.save();

    return res.status(200).json({
      favorited: true,
      favoritesCount: recipe.favoritesCount,
      message: "Favorilere eklendi.",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Bu tarif zaten favorilerinizde." });
    }
    res.status(500).json({ message: "Favori işlemi yapılamadı.", error: error.message });
  }
};

module.exports = {
  getFavorites,
  toggleFavorite,
};
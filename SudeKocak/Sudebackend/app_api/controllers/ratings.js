const Rating = require("../models/rating");
const Recipe = require("../models/recipe");
const { getSummaryForRecipeId } = require("../utils/recipeRatingStats");

const upsertRating = async (req, res) => {
  try {
    const recipeId = req.params.recipeId || req.body.recipeId;
    const scoreRaw = req.body.score;

    if (!recipeId) {
      return res.status(400).json({ message: "Tarif bilgisi gerekli." });
    }

    if (scoreRaw === undefined || scoreRaw === null || scoreRaw === "") {
      return res.status(400).json({ message: "Puan (score) gerekli." });
    }

    const score = Number(scoreRaw);
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      return res.status(400).json({ message: "Puan 1 ile 5 arasında tam sayı olmalıdır." });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Tarif bulunamadı." });
    }

    const userId = req.user.id;

    await Rating.findOneAndUpdate(
      { user: userId, recipe: recipeId },
      {
        $set: { score },
        $setOnInsert: { user: userId, recipe: recipeId },
      },
      { upsert: true, new: true, runValidators: true }
    );

    const summary = await getSummaryForRecipeId(recipeId);

    res.status(200).json({
      message: "Puanınız kaydedildi.",
      score,
      averageRating: summary.averageRating,
      ratingsCount: summary.ratingsCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Puan verilirken hata oluştu.", error: error.message });
  }
};

module.exports = {
  upsertRating,
};

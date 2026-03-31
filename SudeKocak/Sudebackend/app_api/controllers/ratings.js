const Rating = require("../models/rating");

const addRating = async (req, res) => {
  try {
    const { recipeId, score } = req.body;

    if (!recipeId || !score) {
      return res.status(400).json({ message: "recipeId ve score gerekli" });
    }

    if (score < 1 || score > 5) {
      return res.status(400).json({ message: "Puan 1 ile 5 arasında olmalı" });
    }

    const existingRating = await Rating.findOne({
      user: req.user.id,
      recipe: recipeId,
    });

    if (existingRating) {
      return res.status(409).json({ message: "Bu tarif için zaten puan verdin" });
    }

    const rating = await Rating.create({
      user: req.user.id,
      recipe: recipeId,
      score,
    });

    res.status(201).json({
      message: "Puan başarıyla verildi",
      rating,
    });
  } catch (error) {
    res.status(500).json({ message: "Puan verilirken hata oluştu", error: error.message });
  }
};

module.exports = {
  addRating,
};
const Favorite = require("../models/favorite");

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate("recipe");

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Favoriler listelenirken hata oluştu", error: error.message });
  }
};

module.exports = {
  getFavorites,
};
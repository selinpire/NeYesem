const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userName: {
    type: String,
    trim: true,
  },
  /** Eski kayıtlar (yalnızca metin kullanıcı adı) */
  user: {
    type: String,
    trim: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  ingredients: [String],
  steps: [String],
  category: {
    type: String,
    enum: ["Ana Yemek", "Çorba", "Tatlı", "Salata", "Kahvaltı", "İçecek", "Atıştırmalık", "Diğer"],
    default: "Diğer",
  },
  image: String,
  cookingTime: {
    type: String,
    default: "",
  },
  videoUrl: String,
  favoritesCount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
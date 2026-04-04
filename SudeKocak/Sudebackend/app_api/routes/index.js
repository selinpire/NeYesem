const express = require("express");
const router = express.Router();
const aiRoutes = require("./aiRoutes");

// Controllers
const authController = require("../controllers/authController");
const userController = require("../controllers/users");
const favoriteController = require("../controllers/favorites");
const ratingController = require("../controllers/ratings");
const recipesController = require("../controllers/recipes");
const commentsController = require("../controllers/comments");


// Middleware
const authMiddleware = require("../config/authMiddleware");
const optionalAuth = require("../config/optionalAuth");


router.use("/ai", aiRoutes);

// ==================== RECİPE ====================

router.get("/recipes/my", authMiddleware, recipesController.getMyRecipes);
router.post("/recipes", authMiddleware, recipesController.addRecipe);
router.get("/recipes", recipesController.getAllRecipes);
router.get("/recipes/search", recipesController.searchRecipes);
router.get("/recipes/category/list", recipesController.getRecipesByCategory);
router.get("/recipes/:recipeId", optionalAuth, recipesController.getRecipeById);
router.put("/recipes/:recipeId", authMiddleware, recipesController.updateRecipe);
router.delete("/recipes/:recipeId", authMiddleware, recipesController.deleteRecipe);

router.post("/recipes/:recipeId/comments", authMiddleware, commentsController.addComment);
router.delete(
  "/recipes/:recipeId/comments/:commentId",
  authMiddleware,
  commentsController.deleteComment
);

router.post("/recipes/:recipeId/favorite", authMiddleware, favoriteController.toggleFavorite);

router.post("/recipes/:recipeId/rating", authMiddleware, ratingController.upsertRating);

router.post("/recipes/:recipeId/video", authMiddleware, recipesController.addVideo);

router.delete("/recipes/:recipeId/video", authMiddleware, recipesController.deleteVideo);

// ==================== AUTH ====================
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);

// ==================== USERS ====================
router.get("/users/:userId", authMiddleware, userController.getProfile);
router.put("/users/:userId", authMiddleware, userController.updateProfile);
router.delete("/users/:userId", authMiddleware, userController.deleteAccount);

// ==================== FAVORITES ====================
router.get("/favorites", authMiddleware, favoriteController.getFavorites);

// ==================== RATINGS ====================
router.post("/ratings", authMiddleware, ratingController.upsertRating);


module.exports = router;
const express = require("express");
const router = express.Router();
const aiRoutes = require("./aiRoutes");

const recipesController = require("../controllers/recipes");
const commentsController = require("../controllers/comments");

router.use("/ai", aiRoutes);

router.post("/recipes", recipesController.addRecipe);
router.get("/recipes", recipesController.getAllRecipes);
router.get("/recipes/search", recipesController.searchRecipes);
router.get("/recipes/:recipeId", recipesController.getRecipeById);
router.put("/recipes/:recipeId", recipesController.updateRecipe);
router.delete("/recipes/:recipeId", recipesController.deleteRecipe);
router.get("/recipes/category/list", recipesController.getRecipesByCategory);

router.post("/recipes/:recipeId/comments", commentsController.addComment);

router.post("/recipes/:recipeId/favorite", recipesController.addFavorite);

router.post("/recipes/:recipeId/video", recipesController.addVideo);

router.delete("/recipes/:recipeId/video", recipesController.deleteVideo);

module.exports = router;
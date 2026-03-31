const express = require("express");
const router = express.Router();
const { suggestMeals, analyzeCalories } = require("../controllers/aiController");

router.post("/suggest-meals", suggestMeals);
router.post("/analyze-calories", analyzeCalories);

module.exports = router;
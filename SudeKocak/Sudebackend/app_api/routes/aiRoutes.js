const express = require("express");
const router = express.Router();
const { suggestMeals } = require("../controllers/aiController");

router.post("/suggest-meals", suggestMeals);

module.exports = router;
const { getMealSuggestionsByMood, getCalorieAnalysis } = require("../services/aiService");

const suggestMeals = async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json({
        success: false,
        message: "mood alanı zorunludur",
      });
    }

    const result = await getMealSuggestionsByMood(mood);

    return res.status(200).json({
      success: true,
      message: "Yemek önerileri başarıyla oluşturuldu",
      data: result,
    });
  } catch (error) {
    console.error("AI öneri hatası:", error.message);

    if (
      error.message === "Geçersiz mood değeri" ||
      error.message === "AI çıktısı JSON formatında değil"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "AI önerisi oluşturulamadı",
      error: error.message,
    });
  }
};

const analyzeCalories = async (req, res) => {
  try {
    const { recipe } = req.body;

    if (!recipe) {
      return res.status(400).json({
        success: false,
        message: "recipe alanı zorunludur",
      });
    }

    const result = await getCalorieAnalysis(recipe);

    return res.status(200).json({
      success: true,
      message: "Kalori analizi başarıyla oluşturuldu",
      data: result,
    });
  } catch (error) {
    console.error("Kalori analiz hatası:", error.message);

    if (error.message === "AI çıktısı JSON formatında değil") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Kalori analizi oluşturulamadı",
      error: error.message,
    });
  }
};

module.exports = {
  suggestMeals,
  analyzeCalories,
};
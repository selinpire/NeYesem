const Recipe = require("../models/recipe");

const createResponse = (res, status, content) => {
  res.status(status).json(content);
};

const addRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    createResponse(res, 201, {
      message: "Tarif başarıyla oluşturuldu.",
      recipe,
    });
  } catch (error) {
    createResponse(res, 400, {
      message: "Tarif oluşturulamadı.",
      error: error.message,
    });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    createResponse(res, 200, recipes);
  } catch (error) {
    createResponse(res, 500, {
      message: "Tarifler alınamadı.",
      error: error.message,
    });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      return createResponse(res, 404, {
        message: "Tarif bulunamadı.",
      });
    }

    createResponse(res, 200, recipe);
  } catch (error) {
    createResponse(res, 400, {
      message: "Geçersiz tarif id.",
      error: error.message,
    });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.recipeId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return createResponse(res, 404, {
        message: "Tarif bulunamadı.",
      });
    }

    createResponse(res, 200, {
      message: "Tarif başarıyla güncellendi.",
      recipe,
    });
  } catch (error) {
    createResponse(res, 400, {
      message: "Tarif güncellenemedi.",
      error: error.message,
    });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.recipeId);

    if (!recipe) {
      return createResponse(res, 404, {
        message: "Tarif bulunamadı.",
      });
    }

    createResponse(res, 200, {
      message: "Tarif başarıyla silindi.",
    });
  } catch (error) {
    createResponse(res, 400, {
      message: "Tarif silinemedi.",
      error: error.message,
    });
  }
};

const searchRecipes = async (req, res) => {
  try {
    const q = req.query.q;

    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    });

    createResponse(res, 200, recipes);
  } catch (error) {
    createResponse(res, 400, {
      message: "Arama yapılamadı.",
      error: error.message,
    });
  }
};

const getRecipesByCategory = async (req, res) => {
  try {
    const recipes = await Recipe.find({ category: req.query.category });
    createResponse(res, 200, recipes);
  } catch (error) {
    createResponse(res, 400, {
      message: "Kategoriye göre listeleme yapılamadı.",
      error: error.message,
    });
  }
};




const addFavorite = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      return createResponse(res, 404, { message: "Tarif bulunamadı." });
    }

    recipe.favoritesCount = (recipe.favoritesCount || 0) + 1;
    await recipe.save();

    createResponse(res, 200, {
      message: "Favori eklendi.",
      favoritesCount: recipe.favoritesCount,
      recipe: recipe
    });
  } catch (error) {
    createResponse(res, 400, {
      message: "Favori eklenemedi.",
      error: error.message
    });
  }
};

const addVideo = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      return createResponse(res, 404, { message: "Tarif bulunamadı." });
    }

    recipe.videoUrl = req.body.videoUrl;
    await recipe.save();

    createResponse(res, 200, {
      message: "Video eklendi.",
      recipe: recipe
    });
  } catch (error) {
    createResponse(res, 400, {
      message: "Video eklenemedi.",
      error: error.message
    });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      return createResponse(res, 404, { message: "Tarif bulunamadı." });
    }

    if (!recipe.videoUrl) {
      return createResponse(res, 400, { message: "Silinecek video bulunamadı." });
    }

    recipe.videoUrl = "";
    await recipe.save();

    createResponse(res, 200, {
      message: "Video silindi.",
      recipe: recipe
    });
  } catch (error) {
    createResponse(res, 400, {
      message: "Video silinemedi.",
      error: error.message
    });
  }
};

module.exports = {
  addRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  getRecipesByCategory,
  addFavorite,
  addVideo,
  deleteVideo,
};
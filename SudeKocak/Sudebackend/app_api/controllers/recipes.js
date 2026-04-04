const Recipe = require("../models/recipe");
const Rating = require("../models/rating");
const { getSummaryForRecipeId, attachSummaries } = require("../utils/recipeRatingStats");

const createResponse = (res, status, content) => {
  res.status(status).json(content);
};

const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const MAX_IMAGE_PAYLOAD_CHARS = 12 * 1024 * 1024;

const isValidImageUrl = (url) => {
  if (!url) return true;
  const lower = url.toLowerCase().split("?")[0];
  return ALLOWED_IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
};

const isAllowedDataImage = (value) => {
  if (typeof value !== "string" || !value.startsWith("data:")) return false;
  return /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(value);
};

const isValidRecipeImageValue = (value) => {
  if (!value || typeof value !== "string") return false;
  if (value.length > MAX_IMAGE_PAYLOAD_CHARS) return false;
  if (isAllowedDataImage(value)) return true;
  if (/^https?:\/\//i.test(value)) return isValidImageUrl(value);
  return false;
};

const addRecipe = async (req, res) => {
  try {
    const recipeData = { ...req.body };

    if (!recipeData.image || typeof recipeData.image !== "string" || !recipeData.image.trim()) {
      return createResponse(res, 400, {
        message:
          "Tarif görseli zorunludur. Yalnızca .jpg, .jpeg, .png veya .webp dosyası yükleyin (URL kabul edilmez).",
      });
    }

    const trimmedImg = recipeData.image.trim();
    if (/^https?:\/\//i.test(trimmedImg) || trimmedImg.startsWith("//")) {
      return createResponse(res, 400, {
        message:
          "Görsel URL ile eklenemez. Yalnızca .jpg, .jpeg, .png veya .webp dosyası yükleyerek gönderin.",
      });
    }

    if (!isAllowedDataImage(recipeData.image)) {
      return createResponse(res, 400, {
        message:
          "Geçersiz görsel türü. Yalnızca JPEG, PNG veya WebP içeren yüklenmiş dosya kabul edilir (.jpg, .jpeg, .png, .webp).",
      });
    }

    if (recipeData.image.length > MAX_IMAGE_PAYLOAD_CHARS) {
      return createResponse(res, 400, {
        message: "Görsel dosyası çok büyük. Daha küçük bir görsel seçin.",
      });
    }

    if (req.user) {
      recipeData.createdBy = req.user.id;
    }
    const recipe = await Recipe.create(recipeData);
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

const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id });
    const withRatings = await attachSummaries(recipes);
    createResponse(res, 200, withRatings);
  } catch (error) {
    createResponse(res, 500, {
      message: "Tarifler alınamadı.",
      error: error.message,
    });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    const withRatings = await attachSummaries(recipes);
    createResponse(res, 200, withRatings);
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

    const plain = recipe.toObject();
    const summary = await getSummaryForRecipeId(recipe._id);
    let myRating = null;
    if (req.user && req.user.id) {
      const mine = await Rating.findOne({
        user: req.user.id,
        recipe: recipe._id,
      })
        .select("score")
        .lean();
      myRating = mine?.score ?? null;
    }

    createResponse(res, 200, {
      ...plain,
      ...summary,
      myRating,
    });
  } catch (error) {
    createResponse(res, 400, {
      message: "Geçersiz tarif id.",
      error: error.message,
    });
  }
};

const updateRecipe = async (req, res) => {
  try {
    if (req.body.image !== undefined && req.body.image !== null) {
      const imgStr = String(req.body.image).trim();
      if (imgStr !== "" && !isValidRecipeImageValue(req.body.image)) {
        return createResponse(res, 400, {
          message:
            "Geçersiz görsel. Yalnızca .jpg, .jpeg, .png veya .webp (yüklenen dosya veya uyumlu adres) kabul edilir.",
        });
      }
      if (typeof req.body.image === "string" && req.body.image.length > MAX_IMAGE_PAYLOAD_CHARS) {
        return createResponse(res, 400, {
          message: "Görsel dosyası çok büyük. Daha küçük bir görsel seçin.",
        });
      }
    }

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

    const withRatings = await attachSummaries(recipes);
    createResponse(res, 200, withRatings);
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
    const withRatings = await attachSummaries(recipes);
    createResponse(res, 200, withRatings);
  } catch (error) {
    createResponse(res, 400, {
      message: "Kategoriye göre listeleme yapılamadı.",
      error: error.message,
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
  getMyRecipes,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  getRecipesByCategory,
  addVideo,
  deleteVideo
};
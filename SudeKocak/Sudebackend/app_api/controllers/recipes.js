const Recipe = require("../models/recipe");
const Rating = require("../models/rating");
const Favorite = require("../models/favorite");
const { getSummaryForRecipeId, attachSummaries } = require("../utils/recipeRatingStats");
const { toPublicComments } = require("../utils/commentPublic");

const ALLOWED_RECIPE_UPDATE_FIELDS = [
  "title",
  "description",
  "category",
  "ingredients",
  "steps",
  "image",
  "cookingTime",
  "videoUrl",
];

function pickAllowedRecipeUpdates(body) {
  const out = {};
  for (const k of ALLOWED_RECIPE_UPDATE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, k)) {
      out[k] = body[k];
    }
  }
  return out;
}

function assertRecipeOwner(res, recipe, userId) {
  if (!recipe.createdBy) {
    createResponse(res, 403, {
      message: "Bu tarif güncellenemez veya silinemez (sahip bilgisi yok).",
    });
    return false;
  }
  if (String(recipe.createdBy) !== String(userId)) {
    createResponse(res, 403, {
      message: "Yalnızca kendi tarifinizi düzenleyebilir veya silebilirsiniz.",
    });
    return false;
  }
  return true;
}

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

const MAX_VIDEO_URL_LEN = 2048;

/** Boş string = video yok. null error = geçersiz. */
function normalizeOptionalVideoUrl(value) {
  if (value === undefined || value === null) {
    return { ok: true, url: "" };
  }
  if (typeof value !== "string") {
    return { ok: false, error: "Video bağlantısı geçersiz." };
  }
  const t = value.trim();
  if (!t) {
    return { ok: true, url: "" };
  }
  if (t.length > MAX_VIDEO_URL_LEN) {
    return { ok: false, error: "Video bağlantısı çok uzun." };
  }
  let u;
  try {
    u = new URL(t);
  } catch {
    return { ok: false, error: "Geçersiz video bağlantısı." };
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return { ok: false, error: "Video bağlantısı yalnızca http veya https olabilir." };
  }
  return { ok: true, url: t };
}

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

    const nv = normalizeOptionalVideoUrl(recipeData.videoUrl);
    if (!nv.ok) {
      return createResponse(res, 400, { message: nv.error });
    }
    recipeData.videoUrl = nv.url;

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
    plain.comments = toPublicComments(plain.comments || []);
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
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      return createResponse(res, 404, {
        message: "Tarif bulunamadı.",
      });
    }

    if (!assertRecipeOwner(res, recipe, req.user.id)) {
      return;
    }

    const payload = pickAllowedRecipeUpdates(req.body);

    if (Object.prototype.hasOwnProperty.call(payload, "image")) {
      if (payload.image !== undefined && payload.image !== null) {
        const imgStr = String(payload.image).trim();
        if (imgStr !== "" && !isValidRecipeImageValue(payload.image)) {
          return createResponse(res, 400, {
            message:
              "Geçersiz görsel. Yalnızca .jpg, .jpeg, .png veya .webp (yüklenen dosya veya uyumlu adres) kabul edilir.",
          });
        }
        if (typeof payload.image === "string" && payload.image.length > MAX_IMAGE_PAYLOAD_CHARS) {
          return createResponse(res, 400, {
            message: "Görsel dosyası çok büyük. Daha küçük bir görsel seçin.",
          });
        }
      }
    }

    if (Object.prototype.hasOwnProperty.call(payload, "videoUrl")) {
      const nv = normalizeOptionalVideoUrl(payload.videoUrl);
      if (!nv.ok) {
        return createResponse(res, 400, { message: nv.error });
      }
      payload.videoUrl = nv.url;
    }

    Object.assign(recipe, payload);
    await recipe.save({ validateModifiedOnly: true });

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
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      return createResponse(res, 404, {
        message: "Tarif bulunamadı.",
      });
    }

    if (!assertRecipeOwner(res, recipe, req.user.id)) {
      return;
    }

    const recipeId = recipe._id;
    await Promise.all([
      Rating.deleteMany({ recipe: recipeId }),
      Favorite.deleteMany({ recipe: recipeId }),
    ]);
    await Recipe.findByIdAndDelete(recipeId);

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

    if (!assertRecipeOwner(res, recipe, req.user.id)) {
      return;
    }

    const nv = normalizeOptionalVideoUrl(req.body.videoUrl);
    if (!nv.ok) {
      return createResponse(res, 400, { message: nv.error });
    }
    if (!nv.url) {
      return createResponse(res, 400, { message: "Video URL gerekli." });
    }
    recipe.videoUrl = nv.url;
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

    if (!assertRecipeOwner(res, recipe, req.user.id)) {
      return;
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
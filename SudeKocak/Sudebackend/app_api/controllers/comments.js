const Recipe = require("../models/recipe");
const User = require("../models/user");
const { toPublicComments } = require("../utils/commentPublic");

const createResponse = (res, status, content) => {
  res.status(status).json(content);
};

const MAX_LEN = 2000;

const addComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      return createResponse(res, 404, { message: "Tarif bulunamadı." });
    }

    const raw = typeof req.body.text === "string" ? req.body.text : "";
    const text = raw.trim();
    if (!text) {
      return createResponse(res, 400, { message: "Yorum metni boş olamaz." });
    }
    if (text.length > MAX_LEN) {
      return createResponse(res, 400, {
        message: `Yorum en fazla ${MAX_LEN} karakter olabilir.`,
      });
    }

    const author = await User.findById(req.user.id).select("username").lean();
    if (!author) {
      return createResponse(res, 401, { message: "Kullanıcı bulunamadı." });
    }

    recipe.comments.push({
      userId: req.user.id,
      userName: author.username,
      text,
    });

    await recipe.save();

    createResponse(res, 201, {
      message: "Yorum başarıyla eklendi.",
      comments: toPublicComments(recipe.comments),
    });
  } catch (error) {
    createResponse(res, 400, {
      message: "Yorum eklenemedi.",
      error: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      return createResponse(res, 404, { message: "Tarif bulunamadı." });
    }

    const comment = recipe.comments.id(req.params.commentId);

    if (!comment) {
      return createResponse(res, 404, { message: "Yorum bulunamadı." });
    }

    if (!comment.userId) {
      return createResponse(res, 403, {
        message: "Bu yorum güvenli silme için uygun değil.",
      });
    }

    if (String(comment.userId) !== String(req.user.id)) {
      return createResponse(res, 403, {
        message: "Yalnızca kendi yorumunuzu silebilirsiniz.",
      });
    }

    comment.deleteOne();
    await recipe.save();

    createResponse(res, 200, {
      message: "Yorum başarıyla silindi.",
      comments: toPublicComments(recipe.comments),
    });
  } catch (error) {
    createResponse(res, 400, {
      message: "Yorum silinemedi.",
      error: error.message,
    });
  }
};

module.exports = {
  addComment,
  deleteComment,
};

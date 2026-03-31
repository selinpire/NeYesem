const Recipe = require("../models/recipe");

const createResponse = (res, status, content) => {
  res.status(status).json(content);
};

const addComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      return createResponse(res, 404, { message: "Tarif bulunamadı." });
    }

    recipe.comments.push({
      user: req.body.user,
      text: req.body.text,
    });

    await recipe.save();

    createResponse(res, 201, {
      message: "Yorum başarıyla eklendi.",
      comments: recipe.comments,
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

    comment.deleteOne();
    await recipe.save();

    createResponse(res, 200, {
      message: "Yorum başarıyla silindi.",
      comments: recipe.comments,
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
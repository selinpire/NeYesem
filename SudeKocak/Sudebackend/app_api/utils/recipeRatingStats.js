const mongoose = require("mongoose");
const Rating = require("../models/rating");

async function getSummaryForRecipeId(recipeId) {
  const oid = new mongoose.Types.ObjectId(String(recipeId));
  const agg = await Rating.aggregate([
    { $match: { recipe: oid } },
    { $group: { _id: null, avg: { $avg: "$score" }, count: { $sum: 1 } } },
  ]);
  if (!agg.length) {
    return { averageRating: null, ratingsCount: 0 };
  }
  return {
    averageRating: Math.round(agg[0].avg * 10) / 10,
    ratingsCount: agg[0].count,
  };
}

async function getSummariesForRecipeIds(recipeIds) {
  if (!recipeIds.length) return new Map();
  const oids = recipeIds.map((id) => new mongoose.Types.ObjectId(String(id)));
  const agg = await Rating.aggregate([
    { $match: { recipe: { $in: oids } } },
    { $group: { _id: "$recipe", avg: { $avg: "$score" }, count: { $sum: 1 } } },
  ]);
  const map = new Map();
  for (const row of agg) {
    map.set(String(row._id), {
      averageRating: Math.round(row.avg * 10) / 10,
      ratingsCount: row.count,
    });
  }
  return map;
}

async function attachSummaries(recipes) {
  if (!recipes || !recipes.length) return [];
  const ids = recipes.map((r) => r._id);
  const map = await getSummariesForRecipeIds(ids);
  return recipes.map((r) => {
    const plain = r.toObject ? r.toObject() : { ...r };
    const s = map.get(String(r._id));
    return {
      ...plain,
      averageRating: s?.averageRating ?? null,
      ratingsCount: s?.ratingsCount ?? 0,
    };
  });
}

module.exports = {
  getSummaryForRecipeId,
  attachSummaries,
};

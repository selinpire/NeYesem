const redisService = require("./redisService");

const MAX_SEARCHES = 10;
const TTL_SECONDS = 7 * 24 * 60 * 60;

const getKey = (userId) => `user:${userId}:last_searches`;

const addSearch = async (userId, query) => {
  const normalized = query.trim();
  if (!normalized) return;

  const key = getKey(userId);
  await redisService.lRem(key, 0, normalized);
  await redisService.lPush(key, normalized);
  await redisService.lTrim(key, 0, MAX_SEARCHES - 1);
  await redisService.expire(key, TTL_SECONDS);
};

const getLastSearches = async (userId) => {
  return redisService.lRange(getKey(userId), 0, MAX_SEARCHES - 1);
};

const clearLastSearches = async (userId) => {
  await redisService.del(getKey(userId));
};

module.exports = {
  addSearch,
  getLastSearches,
  clearLastSearches,
};

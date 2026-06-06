const crypto = require("crypto");
const redisService = require("./redisService");

const TTL_SECONDS = 7 * 24 * 60 * 60;

const getKey = (userId) => `refresh_token:${userId}`;

const generateRefreshToken = () => crypto.randomBytes(40).toString("hex");

const saveRefreshToken = async (userId, refreshToken) => {
  await redisService.setWithTTL(getKey(userId), refreshToken, TTL_SECONDS);
};

const getRefreshToken = async (userId) => {
  return redisService.get(getKey(userId));
};

const deleteRefreshToken = async (userId) => {
  await redisService.del(getKey(userId));
};

module.exports = {
  generateRefreshToken,
  saveRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
};

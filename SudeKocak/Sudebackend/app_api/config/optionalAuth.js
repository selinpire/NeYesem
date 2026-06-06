const jwt = require("jsonwebtoken");
const redisService = require("../services/redisService");

/**
 * Varsa JWT doğrular ve req.user atar; yoksa veya geçersizse 401 dönmeden devam eder.
 * getRecipeById gibi herkese açık uçlarda myRating için kullanılır.
 */
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    if (await redisService.isTokenBlacklisted(token)) {
      return res.status(401).json({ message: "Token geçersiz veya oturum sonlandırıldı" });
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    req.user = undefined;
  }

  next();
}

module.exports = optionalAuth;

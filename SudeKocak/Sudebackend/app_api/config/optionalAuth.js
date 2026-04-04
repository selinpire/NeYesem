const jwt = require("jsonwebtoken");

/**
 * Varsa JWT doğrular ve req.user atar; yoksa veya geçersizse 401 dönmeden devam eder.
 * getRecipeById gibi herkese açık uçlarda myRating için kullanılır.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    req.user = undefined;
  }
  next();
}

module.exports = optionalAuth;

const jwt = require("jsonwebtoken");
const redisService = require("../services/redisService");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token gerekli" });
  }

  const token = authHeader.split(" ")[1];

  try {
    if (await redisService.isTokenBlacklisted(token)) {
      return res.status(401).json({ message: "Token geçersiz veya oturum sonlandırıldı" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Geçersiz token" });
  }
};

module.exports = authMiddleware;

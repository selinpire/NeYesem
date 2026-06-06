const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const refreshTokenService = require("../services/refreshTokenService");

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

const createAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

const buildAuthResponse = async (user) => {
  const accessToken = createAccessToken(user);
  const refreshToken = refreshTokenService.generateRefreshToken();

  let refreshTokenSaved = true;
  try {
    await refreshTokenService.saveRefreshToken(user._id, refreshToken);
  } catch (error) {
    refreshTokenSaved = false;
    console.log("Refresh token Redis'e kaydedilemedi:", error.message);
  }

  return {
    accessToken,
    refreshToken: refreshTokenSaved ? refreshToken : null,
    token: accessToken,
    refreshTokenExpiresIn: refreshTokenSaved ? REFRESH_TOKEN_TTL_SECONDS : null,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  };
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tüm alanlar zorunlu" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Bu email zaten kayıtlı" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const authData = await buildAuthResponse(user);

    res.status(201).json({
      message: "Kayıt başarılı",
      ...authData,
    });
  } catch (error) {
    res.status(500).json({ message: "Kayıt sırasında hata oluştu", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email ve şifre gerekli" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Şifre yanlış" });
    }

    const authData = await buildAuthResponse(user);

    res.status(200).json({
      message: "Giriş başarılı",
      ...authData,
    });
  } catch (error) {
    res.status(500).json({ message: "Giriş sırasında hata oluştu", error: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: clientRefreshToken, userId } = req.body;

    if (!clientRefreshToken || !userId) {
      return res.status(401).json({ message: "Refresh token gerekli" });
    }

    const storedToken = await refreshTokenService.getRefreshToken(userId);

    if (!storedToken) {
      return res.status(401).json({ message: "Refresh token bulunamadı" });
    }

    if (storedToken !== clientRefreshToken) {
      return res.status(403).json({ message: "Refresh token geçersiz" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı" });
    }

    const accessToken = createAccessToken(user);

    res.status(200).json({
      message: "Access token yenilendi",
      accessToken,
      token: accessToken,
    });
  } catch (error) {
    res.status(503).json({
      message: "Token yenilenemedi",
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    try {
      await refreshTokenService.deleteRefreshToken(req.user.id);
    } catch (error) {
      console.log("Refresh token Redis'ten silinemedi:", error.message);
    }
    res.status(200).json({ message: "Çıkış başarılı" });
  } catch (error) {
    res.status(500).json({
      message: "Çıkış sırasında hata oluştu",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};

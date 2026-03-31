const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
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

    const token = createToken(user);

    res.status(201).json({
      message: "Kayıt başarılı",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
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

    const token = createToken(user);

    res.status(200).json({
      message: "Giriş başarılı",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Giriş sırasında hata oluştu", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Çıkış başarılı, istemci tarafında token silinmeli" });
  } catch (error) {
    res.status(500).json({ message: "Çıkış sırasında hata oluştu", error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
};
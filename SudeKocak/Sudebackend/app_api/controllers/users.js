const User = require("../models/user");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Sadece kendi profilini görüntüleyebilirsin" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Profil alınırken hata oluştu", error: error.message });
  }
};




const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Sadece kendi profilini güncelleyebilirsin" });
    }

    const { username, email, password, bio, profileImage } = req.body;

    const updateData = {};

    if (username !== undefined) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    if (email !== undefined) {
      const existingUser = await User.findOne({ email });

      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(409).json({ message: "Bu email başka bir kullanıcı tarafından kullanılıyor" });
      }

      updateData.email = email;
    }

    if (password !== undefined) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Şifre en az 6 karakter olmalı" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json({
      message: "Profil güncellendi",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Profil güncellenirken hata oluştu",
      error: error.message,
    });
  }
};


const deleteAccount = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Sadece kendi hesabını silebilirsin" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json({ message: "Hesap başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Hesap silinirken hata oluştu", error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
};
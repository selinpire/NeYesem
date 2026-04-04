import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile, getApiErrorMessage } from "../../services/userService";

function ProfileEditForm({ initialProfile, onSuccess, onCancel }) {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    profileImage: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setFormData({
        username: initialProfile.username || "",
        email: initialProfile.email || "",
        bio: initialProfile.bio || "",
        profileImage: initialProfile.profileImage || "",
      });
    }
  }, [initialProfile]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await updateProfile(user.id, formData);
      const token = localStorage.getItem("token");
      login(
        {
          id: user.id,
          username: res.user.username,
          email: res.user.email,
        },
        token
      );
      if (onSuccess) {
        onSuccess(res.user);
      } else {
        setMessage({ text: res.message || "Profil başarıyla güncellendi.", type: "success" });
      }
    } catch (err) {
      setMessage({
        text: getApiErrorMessage(err, "Güncelleme sırasında hata oluştu."),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-edit-form">
      <h2>Profili Düzenle</h2>
      <p className="profile-edit-hint">
        Yalnızca kendi hesabınızın bilgilerini güncelleyebilirsiniz; bu kural sunucu tarafında da
        doğrulanır.
      </p>

      {message.text && (
        <div className={`profile-alert profile-alert--${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      <label className="profile-field-label">
        <span>Kullanıcı adı</span>
        <input
          type="text"
          name="username"
          autoComplete="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </label>
      <label className="profile-field-label">
        <span>E-posta</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <label className="profile-field-label">
        <span>Hakkımda</span>
        <textarea
          name="bio"
          placeholder="Kendinizi kısaca tanıtın..."
          value={formData.bio}
          onChange={handleChange}
          rows={4}
        />
      </label>
      <label className="profile-field-label">
        <span>Profil fotoğrafı (URL)</span>
        <input
          type="url"
          name="profileImage"
          placeholder="https://..."
          value={formData.profileImage}
          onChange={handleChange}
        />
      </label>

      <div className="profile-form-actions">
        <button type="submit" className="primary-btn" disabled={saving}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button type="button" className="secondary-btn" onClick={onCancel} disabled={saving}>
          İptal
        </button>
      </div>
    </form>
  );
}

export default ProfileEditForm;

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile, deleteAccount } from "../services/userService";

function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    profileImage: "",
  });

  const [updateMsg, setUpdateMsg] = useState({ text: "", type: "" });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    async function fetchProfile() {
      try {
        const data = await getProfile(user.id);
        setProfile(data);
        setFormData({
          username: data.username || "",
          email: data.email || "",
          bio: data.bio || "",
          profileImage: data.profileImage || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMsg({ text: "", type: "" });

    try {
      const res = await updateProfile(user.id, formData);
      setProfile(res.user);
      login(
        { id: user.id, username: res.user.username, email: res.user.email },
        localStorage.getItem("token")
      );
      setUpdateMsg({ text: "Profil başarıyla güncellendi.", type: "success" });
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setUpdateMsg({ text: "Güncelleme sırasında hata oluştu.", type: "error" });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount(user.id);
      setDeleteMessage("Hesabınız silindi.");
      logout();
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      setDeleteMessage("Hesap silinirken hata oluştu.");
    }
  };

  const avatarLetter = profile?.username?.[0]?.toUpperCase() || "K";

  if (loading) {
    return (
      <main className="page">
        <p>Yükleniyor...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="page">
        <p>Profil bulunamadı.</p>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="profile-page">

        {deleteMessage && (
          <div className="profile-alert profile-alert--success">
            {deleteMessage}
          </div>
        )}

        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-page-avatar">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profil" className="profile-page-img" />
              ) : (
                <span>{avatarLetter}</span>
              )}
            </div>
            <div className="profile-card-info">
              <h1 className="profile-card-name">{profile.username}</h1>
              <p className="profile-card-email">{profile.email}</p>
              {profile.bio && <p className="profile-card-bio">{profile.bio}</p>}
            </div>
          </div>

          <div className="profile-actions">
            <button className="primary-btn" onClick={() => { setEditMode((p) => !p); setUpdateMsg({ text: "", type: "" }); }}>
              {editMode ? "Vazgeç" : "Profili Güncelle"}
            </button>
            <Link to="/favorites" className="secondary-btn">
              Favorilerim
            </Link>
            <button className="delete-btn" onClick={() => setShowDeleteConfirm(true)}>
              Hesabı Sil
            </button>
          </div>

          {updateMsg.text && (
            <div className={`profile-alert profile-alert--${updateMsg.type}`}>
              {updateMsg.text}
            </div>
          )}

          {editMode && (
            <form onSubmit={handleUpdate} className="profile-edit-form">
              <h2>Profili Düzenle</h2>
              <input
                type="text"
                name="username"
                placeholder="Kullanıcı Adı"
                value={formData.username}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="E-posta"
                value={formData.email}
                onChange={handleChange}
              />
              <textarea
                name="bio"
                placeholder="Hakkımda"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
              />
              <input
                type="text"
                name="profileImage"
                placeholder="Profil Fotoğrafı URL"
                value={formData.profileImage}
                onChange={handleChange}
              />
              <button type="submit" className="primary-btn" disabled={updateLoading}>
                {updateLoading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </form>
          )}
        </div>

        {showDeleteConfirm && (
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Hesabı Sil</h2>
              <p>Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
              <div className="modal-actions">
                <button className="delete-btn" onClick={handleDelete}>
                  Evet, Sil
                </button>
                <button className="secondary-btn" onClick={() => setShowDeleteConfirm(false)}>
                  Vazgeç
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Profile;

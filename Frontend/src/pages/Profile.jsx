import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, deleteAccount, getApiErrorMessage } from "../services/userService";
import DeleteAccountModal from "../components/profile/DeleteAccountModal";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [updatedBanner, setUpdatedBanner] = useState(false);

  useEffect(() => {
    if (location.state?.profileUpdated) {
      setUpdatedBanner(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      setLoadError("");
      try {
        const data = await getProfile(user.id);
        setProfile(data);
      } catch (err) {
        setLoadError(getApiErrorMessage(err, "Profil yüklenemedi."));
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await deleteAccount(user.id);
      logout();
      navigate("/", { replace: true, state: { accountDeleted: true } });
    } catch (err) {
      setDeleteError(getApiErrorMessage(err, "Hesap silinirken hata oluştu."));
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = () => {
    setDeleteError("");
    setShowDeleteConfirm(true);
  };

  const avatarLetter = profile?.username?.[0]?.toUpperCase() || "K";

  if (loading) {
    return (
      <main className="page">
        <p>Yükleniyor...</p>
      </main>
    );
  }

  if (loadError || !profile) {
    return (
      <main className="page">
        <div className="profile-page">
          <div className="profile-alert profile-alert--error" role="alert">
            {loadError || "Profil bulunamadı."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="profile-page">
        {updatedBanner && (
          <div className="profile-alert profile-alert--success" role="status">
            Profiliniz güncellendi.
          </div>
        )}

        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-page-avatar">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="" className="profile-page-img" />
              ) : (
                <span aria-hidden="true">{avatarLetter}</span>
              )}
            </div>
            <div className="profile-card-info">
              <h1 className="profile-card-name">{profile.username}</h1>
              <p className="profile-card-email">{profile.email}</p>
              <div className="profile-bio-block">
                <span className="profile-bio-label">Hakkımda</span>
                <p className="profile-card-bio">
                  {profile.bio?.trim() ? profile.bio : "Henüz bir açıklama eklenmedi."}
                </p>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <Link to="/profile/edit" className="primary-btn">
              Profili Güncelle
            </Link>
            <Link to="/favorites" className="secondary-btn">
              Favorilerim
            </Link>
            <button type="button" className="delete-btn" onClick={openDeleteModal}>
              Hesabı Sil
            </button>
          </div>
        </div>

        <DeleteAccountModal
          open={showDeleteConfirm}
          onClose={() => !deleteLoading && setShowDeleteConfirm(false)}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
          error={deleteError}
        />
      </div>
    </main>
  );
}

export default Profile;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, getApiErrorMessage } from "../services/userService";
import ProfileEditForm from "../components/profile/ProfileEditForm";

function ProfileEdit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    async function load() {
      try {
        const data = await getProfile(user.id);
        setProfile(data);
      } catch (err) {
        setError(getApiErrorMessage(err, "Profil yüklenemedi."));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  const handleSuccess = () => {
    navigate("/profile", { replace: true, state: { profileUpdated: true } });
  };

  if (loading) {
    return (
      <main className="page">
        <p>Yükleniyor...</p>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="page">
        <div className="profile-page">
          <div className="profile-alert profile-alert--error" role="alert">
            {error || "Profil bulunamadı."}
          </div>
          <Link to="/profile" className="primary-btn" style={{ marginTop: "16px", display: "inline-block" }}>
            Profile dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="profile-page">
        <div className="profile-edit-page-header">
          <Link to="/profile" className="profile-back-link">
            ← Profile dön
          </Link>
          <h1 className="profile-edit-page-title">Profili Güncelle</h1>
        </div>
        <div className="profile-card">
          <ProfileEditForm
            initialProfile={profile}
            onSuccess={handleSuccess}
            onCancel={() => navigate("/profile")}
          />
        </div>
      </div>
    </main>
  );
}

export default ProfileEdit;

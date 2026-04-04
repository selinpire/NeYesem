import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import { toggleFavorite } from "../services/favoriteService";
import { getApiErrorMessage } from "../services/userService";

function FavoriteHeartButton({
  recipeId,
  favorited,
  onFavoriteChange,
  variant = "card",
}) {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [guestHint, setGuestHint] = useState(false);
  const [error, setError] = useState("");

  const id = recipeId != null ? String(recipeId) : "";

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    if (!id) return;

    if (!user) {
      setGuestHint(true);
      return;
    }

    try {
      setLoading(true);
      const data = await toggleFavorite(id);
      onFavoriteChange?.(Boolean(data.favorited));
    } catch (err) {
      setError(getApiErrorMessage(err, "İşlem yapılamadı."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`favorite-heart-wrap favorite-heart-wrap--${variant}`}>
      <button
        type="button"
        className="favorite-heart-btn"
        onClick={handleClick}
        disabled={loading || !id}
        aria-pressed={favorited}
        aria-label={favorited ? "Favorilerden çıkar" : "Favorilere ekle"}
        title={favorited ? "Favorilerden çıkar" : "Favorilere ekle"}
      >
        {favorited ? (
          <AiFillHeart className="favorite-heart-icon favorite-heart-icon--filled" />
        ) : (
          <AiOutlineHeart className="favorite-heart-icon" />
        )}
      </button>

      {!user && guestHint && (
        <p className="favorite-heart-guest-hint" role="status">
          Favorilere eklemek için giriş yapmalısınız.{" "}
          <Link
            to="/login"
            state={{ from: location.pathname }}
            className="favorite-heart-login-link"
            onClick={(e) => e.stopPropagation()}
          >
            Giriş yap
          </Link>
        </p>
      )}

      {error && (
        <p className="favorite-heart-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default FavoriteHeartButton;

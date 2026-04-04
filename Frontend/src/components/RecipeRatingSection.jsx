import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { submitRecipeRating } from "../services/ratingService";
import { getApiErrorMessage } from "../services/userService";
import StarRatingDisplay from "./StarRatingDisplay";

function RecipeRatingSection({
  recipeId,
  averageRating,
  ratingsCount,
  myRating: initialMyRating,
  onStatsUpdate,
}) {
  const { user } = useAuth();
  const location = useLocation();
  const [hover, setHover] = useState(0);
  const [localMy, setLocalMy] = useState(initialMyRating ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLocalMy(initialMyRating ?? null);
  }, [initialMyRating, recipeId]);

  const handlePick = async (score) => {
    if (!user || !recipeId) return;
    setError("");
    setLoading(true);
    try {
      const data = await submitRecipeRating(recipeId, score);
      setLocalMy(data.score);
      onStatsUpdate?.({
        averageRating: data.averageRating,
        ratingsCount: data.ratingsCount,
        myRating: data.score,
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Puan kaydedilemedi."));
    } finally {
      setLoading(false);
    }
  };

  const activeLevel = hover || localMy || 0;

  return (
    <div className="recipe-rating-section">
      <h2 className="detail-section-title">Puanlama</h2>
      <StarRatingDisplay
        averageRating={averageRating}
        ratingsCount={ratingsCount}
      />

      {user ? (
        <>
          <p className="recipe-rating-hint">
            {localMy
              ? `Verdiğiniz puan: ${localMy} yıldız (tekrar seçerek güncelleyebilirsiniz).`
              : "1 ile 5 yıldız arasında puan verin."}
          </p>
          <div className="recipe-rating-pick" role="group" aria-label="Yıldız seç">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                className={`recipe-rating-star-btn${activeLevel >= s ? " is-on" : ""}`}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                onClick={() => handlePick(s)}
                disabled={loading}
                aria-label={`${s} yıldız`}
              >
                {activeLevel >= s ? (
                  <FaStar className="recipe-rating-star-icon" />
                ) : (
                  <FaRegStar className="recipe-rating-star-icon" />
                )}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="recipe-rating-guest">
          Puan vermek için{" "}
          <Link to="/login" state={{ from: location.pathname }}>
            giriş yapmalısınız
          </Link>
          .
        </p>
      )}

      {error && (
        <p className="form-error recipe-rating-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default RecipeRatingSection;

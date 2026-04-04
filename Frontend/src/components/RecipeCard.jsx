import { Link } from "react-router-dom";
import FavoriteHeartButton from "./FavoriteHeartButton";
import StarRatingDisplay from "./StarRatingDisplay";
import { truncateRecipeDescription, recipeOwnerId } from "../utils/recipeText";

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M12 6v6l4 2" />
    </svg>
  );
}

/**
 * Ortak tarif kartı: görsel, kategori etiketi, başlık, kısa açıklama, süre, aksiyonlar.
 */
function RecipeCard({
  recipe,
  favorited = false,
  onFavoriteChange,
  showFavorite = true,
  detailButtonLabel = "Detay",
  currentUserId = null,
  onRequestDelete,
}) {
  if (!recipe?._id) return null;

  const ownerId = recipeOwnerId(recipe);
  const isOwner = Boolean(currentUserId && ownerId && String(currentUserId) === String(ownerId));

  const desc = recipe.description?.trim()
    ? truncateRecipeDescription(recipe.description)
    : "Açıklama bulunmuyor.";
  const fullDesc = recipe.description?.trim() || "";

  const timeLabel = recipe.cookingTime?.trim() || "—";

  return (
    <article className="recipe-list-card">
      <div className="recipe-list-card-image-wrap">
        <img
          src={recipe.image || "https://via.placeholder.com/600x400?text=Tarif+Gorseli"}
          alt={recipe.title}
          className="recipe-list-card-image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/600x400?text=Tarif+Gorseli";
          }}
        />
        {showFavorite && (
          <FavoriteHeartButton
            recipeId={recipe._id}
            favorited={favorited}
            onFavoriteChange={onFavoriteChange}
            variant="card"
          />
        )}
      </div>

      <div className="recipe-list-card-body">
        <span className="category-tag">{recipe.category || "Diğer"}</span>
        <h3 className="recipe-list-card-title">
          <Link to={`/recipes/${recipe._id}`}>{recipe.title}</Link>
        </h3>
        <p className="recipe-list-card-desc" title={fullDesc || undefined}>
          {desc}
        </p>
        <StarRatingDisplay
          averageRating={recipe.averageRating}
          ratingsCount={recipe.ratingsCount}
          compact
        />

        <div className="recipe-list-card-footer">
          <span className="time-info">
            <ClockIcon />
            {timeLabel}
          </span>
        </div>

        <div className="recipe-list-card-actions">
          <Link to={`/recipes/${recipe._id}`} className="recipe-btn-sm">
            {detailButtonLabel}
          </Link>
          {isOwner && (
            <>
              <Link to={`/recipes/${recipe._id}/edit`} className="recipe-btn-sm recipe-btn-sm--secondary">
                Tarif Güncelle
              </Link>
              <button
                type="button"
                className="recipe-btn-sm recipe-btn-sm--danger"
                onClick={() => onRequestDelete?.(recipe)}
              >
                Tarif Sil
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default RecipeCard;

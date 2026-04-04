import { Link } from "react-router-dom";
import FavoriteHeartButton from "./FavoriteHeartButton";
import StarRatingDisplay from "./StarRatingDisplay";

function RecipeCard({ recipe, favorited = false, onFavoriteChange }) {
  return (
    <div className="recipe-card">
      <div className="recipe-card-image-wrap">
        <img
          src={
            recipe.image ||
            "https://via.placeholder.com/300x200?text=Tarif+Gorseli"
          }
          alt={recipe.title}
          className="recipe-card-image"
        />
        <FavoriteHeartButton
          recipeId={recipe._id}
          favorited={favorited}
          onFavoriteChange={onFavoriteChange}
          variant="card"
        />
      </div>

      <div className="recipe-card-body">
        <h3>{recipe.title}</h3>
        <p>{recipe.category || "Kategori yok"}</p>
        <StarRatingDisplay
          averageRating={recipe.averageRating}
          ratingsCount={recipe.ratingsCount}
          compact
        />
        <p className="recipe-description">
          {recipe.description || "Açıklama bulunmuyor."}
        </p>

        <Link to={`/recipes/${recipe._id}`} className="recipe-btn">
          Detayı Gör
        </Link>
      </div>
    </div>
  );
}

export default RecipeCard;
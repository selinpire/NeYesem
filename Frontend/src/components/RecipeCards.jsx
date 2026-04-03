import { Link } from "react-router-dom";

function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <img
        src={
          recipe.image ||
          "https://via.placeholder.com/300x200?text=Tarif+Gorseli"
        }
        alt={recipe.title}
        className="recipe-card-image"
      />

      <div className="recipe-card-body">
        <h3>{recipe.title}</h3>
        <p>{recipe.category || "Kategori yok"}</p>
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
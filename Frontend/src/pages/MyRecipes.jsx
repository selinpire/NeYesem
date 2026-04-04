import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getMyRecipes } from "../services/recipeService";
import { getApiErrorMessage } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import StarRatingDisplay from "../components/StarRatingDisplay";

function truncateDescription(text, max = 140) {
  if (!text || typeof text !== "string") return "";
  const oneLine = text.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max)}…`;
}

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [addedBanner, setAddedBanner] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.recipeAdded) {
      setAddedBanner(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    async function fetchMyRecipes() {
      setFetchError("");
      try {
        const data = await getMyRecipes();
        setRecipes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setFetchError(getApiErrorMessage(err, "Tarifler yüklenemedi."));
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchMyRecipes();
    }
  }, [user]);

  return (
    <main className="page">
      <div className="recipes-header">
        <h1>Tariflerim</h1>
        <p>Sadece senin eklediğin tarifler burada listeleniyor (sunucudan hesabına göre çekilir).</p>
      </div>

      {addedBanner && (
        <div className="profile-alert profile-alert--success my-recipes-banner" role="status">
          Tarif başarıyla eklendi
        </div>
      )}

      {fetchError && (
        <div className="profile-alert profile-alert--error" role="alert">
          {fetchError}
        </div>
      )}

      {loading && <p>Yükleniyor...</p>}

      {!loading && !fetchError && recipes.length === 0 && (
        <div className="empty-state">
          <p>Henüz tarif eklemediniz.</p>
          <Link to="/add-recipe" className="primary-btn" style={{ marginTop: "16px" }}>
            Tarif Ekle
          </Link>
        </div>
      )}

      {!loading && recipes.length > 0 && (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="recipe-card-image"
                />
              )}
              <div className="recipe-card-body">
                <h3>{recipe.title}</h3>
                <p className="recipe-description">{truncateDescription(recipe.description)}</p>
                <p>{recipe.category}</p>
                <StarRatingDisplay
                  averageRating={recipe.averageRating}
                  ratingsCount={recipe.ratingsCount}
                  compact
                />
                <Link to={`/recipes/${recipe._id}`} className="recipe-btn">
                  Tarife Git
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyRecipes;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getFavorites } from "../services/favoriteService";
import { getApiErrorMessage } from "../services/userService";
import FavoriteHeartButton from "../components/FavoriteHeartButton";
import StarRatingDisplay from "../components/StarRatingDisplay";

function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFavorites() {
      setError("");
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (err) {
        setError(getApiErrorMessage(err, "Favoriler yüklenemedi."));
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  return (
    <main className="page">
      <div className="favorites-page">
        <h1>Favorilerim</h1>
        <p>Beğendiğin tarifler burada görünüyor.</p>

        {error && (
          <div className="profile-alert profile-alert--error" style={{ marginTop: "16px" }} role="alert">
            {error}
          </div>
        )}

        {loading && <p style={{ marginTop: "16px" }}>Yükleniyor...</p>}

        {!loading && !error && favorites.length === 0 && (
          <div className="empty-state">
            <p>Henüz favori tarif eklenmedi.</p>
            <Link to="/recipes" className="primary-btn" style={{ marginTop: "16px" }}>
              Tariflere Göz At
            </Link>
          </div>
        )}

        {!loading && favorites.length > 0 && (
          <div className="recipes-grid" style={{ marginTop: "24px" }}>
            {favorites.map((fav) => {
              const recipe = fav.recipe;
              if (!recipe) return null;
              return (
                <div key={fav._id} className="recipe-card">
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
                      favorited
                      onFavoriteChange={(stillFav) => {
                        if (!stillFav) {
                          setFavorites((prev) =>
                            prev.filter((x) => String(x.recipe?._id) !== String(recipe._id))
                          );
                        }
                      }}
                      variant="card"
                    />
                  </div>
                  <div className="recipe-card-body">
                    <h3>{recipe.title}</h3>
                    <p className="recipe-description">{recipe.description}</p>
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
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Favorites;

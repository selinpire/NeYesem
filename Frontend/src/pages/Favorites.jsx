import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getFavorites } from "../services/favoriteService";

function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchFavorites() {
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user]);

  if (!user) {
    return (
      <main className="page">
        <div className="empty-state">
          <p>Favorilerinizi görmek için giriş yapmanız gerekiyor.</p>
          <Link to="/login" className="primary-btn" style={{ marginTop: "16px" }}>
            Giriş Yap
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="favorites-page">
        <h1>Favorilerim</h1>
        <p>Beğendiğin tarifler burada görünüyor.</p>

        {loading && <p>Yükleniyor...</p>}

        {!loading && favorites.length === 0 && (
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
                  {recipe.image && (
                    <img src={recipe.image} alt={recipe.title} className="recipe-card-image" />
                  )}
                  <div className="recipe-card-body">
                    <h3>{recipe.title}</h3>
                    <p className="recipe-description">{recipe.description}</p>
                    <p>{recipe.category}</p>
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

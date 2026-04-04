import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import RecipeCard from "../components/RecipeCard";
import { getAllRecipes } from "../services/recipeService";
import { getFavorites, buildFavoriteRecipeIdSet } from "../services/favoriteService";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../services/userService";

const FEATURED_COUNT = 6;

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());

  const refreshFavoriteIds = useCallback(async () => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    try {
      const list = await getFavorites();
      setFavoriteIds(buildFavoriteRecipeIdSet(list));
    } catch {
      setFavoriteIds(new Set());
    }
  }, [user]);

  useEffect(() => {
    refreshFavoriteIds();
  }, [refreshFavoriteIds]);

  useEffect(() => {
    if (location.state?.accountDeleted) {
      setAccountDeleted(true);
      navigate("/", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError("");
      try {
        const data = await getAllRecipes();
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        setRecipes(list.slice(0, FEATURED_COUNT));
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, "Tarifler yüklenemedi."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleFavoriteChange = useCallback((recipeId, nextFavorited) => {
    const sid = String(recipeId);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (nextFavorited) next.add(sid);
      else next.delete(sid);
      return next;
    });
  }, []);

  return (
    <main>
      <div className="page">
        {accountDeleted && (
          <div className="home-flash profile-alert profile-alert--success" role="status">
            Hesabınız silindi. Yine görüşmek üzere.
          </div>
        )}
        <Hero />
      </div>

      <section id="sample-recipes" className="sample-recipes-section">
        <div className="page">
          <div className="section-header">
            <div>
              <span className="section-tag">Öne Çıkan Tarifler</span>
              <h2 className="section-title">
                Bugün ne pişirsek? <span>İşte fikirler!</span>
              </h2>
              <p className="section-subtitle">
                Mutfak deneyiminizi zenginleştirecek özenle seçilmiş tarifler.
              </p>
            </div>
            <Link to="/recipes" className="view-all-btn">
              Tümünü Gör
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {error && (
            <div className="profile-alert profile-alert--error" role="alert" style={{ marginBottom: "20px" }}>
              {error}
            </div>
          )}

          {loading && <p>Öne çıkan tarifler yükleniyor...</p>}

          {!loading && !error && recipes.length === 0 && (
            <p>Henüz listelenecek tarif yok. İlk tarifi sen ekle!</p>
          )}

          {!loading && recipes.length > 0 && (
            <div className="recipes-grid sample-recipes-grid">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  favorited={favoriteIds.has(String(recipe._id))}
                  onFavoriteChange={(next) => handleFavoriteChange(recipe._id, next)}
                  showFavorite
                  detailButtonLabel="Detay"
                  currentUserId={user?.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Home;

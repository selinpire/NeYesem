import { useCallback, useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import {
  getAllRecipes,
  searchRecipes,
  getRecipesByCategory,
} from "../services/recipeService";
import { getFavorites, buildFavoriteRecipeIdSet } from "../services/favoriteService";
import { useAuth } from "../context/AuthContext";

function Recipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
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

  const handleFavoriteChange = useCallback((recipeId, nextFavorited) => {
    const sid = String(recipeId);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (nextFavorited) next.add(sid);
      else next.delete(sid);
      return next;
    });
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllRecipes();
      setRecipes(data);
      setSelectedCategory("Tümü");
    } catch (err) {
      setError("Tarifler alınamadı.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");

      if (!searchText.trim()) {
        await loadRecipes();
        return;
      }

      const data = await searchRecipes(searchText);
      setRecipes(data);
    } catch (err) {
      setError("Arama sırasında hata oluştu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (category) => {
    try {
      setSelectedCategory(category);
      setLoading(true);
      setError("");

      if (category === "Tümü") {
        const data = await getAllRecipes();
        setRecipes(data);
      } else {
        const data = await getRecipesByCategory(category);
        setRecipes(data);
      }
    } catch (err) {
      setError("Kategoriye göre tarifler alınamadı.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  return (
    <main className="page">
      <div className="recipes-header">
        <h1>Tarifler</h1>
        <p>Lezzetli tarifleri keşfet ve detaylarını incele.</p>
      </div>

      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        onSearch={handleSearch}
        onReset={loadRecipes}
      />

      <div className="recipes-layout">
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        <div className="recipes-content">
          {loading && <p>Tarifler yükleniyor...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && recipes.length === 0 && (
            <p>Gösterilecek tarif bulunamadı.</p>
          )}

          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                favorited={favoriteIds.has(String(recipe._id))}
                onFavoriteChange={(next) => handleFavoriteChange(recipe._id, next)}
                currentUserId={user?.id}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Recipes;
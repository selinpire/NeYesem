import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyRecipes } from "../services/recipeService";
import { useAuth } from "../context/AuthContext";

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchMyRecipes() {
      try {
        const data = await getMyRecipes();
        setRecipes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyRecipes();
  }, []);

  if (!user) {
    return (
      <main className="page">
        <div className="empty-state">
          <p>Tariflerinizi görmek için giriş yapmanız gerekiyor.</p>
          <Link to="/login" className="primary-btn" style={{ marginTop: "16px" }}>
            Giriş Yap
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="recipes-header">
        <h1>Tariflerim</h1>
        <p>Sadece senin eklediğin tarifler burada listeleniyor.</p>
      </div>

      {loading && <p>Yükleniyor...</p>}

      {!loading && recipes.length === 0 && (
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
                <p className="recipe-description">{recipe.description}</p>
                <p>{recipe.category}</p>
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

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../services/recipeService";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        setError("Tarif detayı alınamadı.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <main className="page">
        <p>Tarif detayı yükleniyor...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <p>{error}</p>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="page">
        <p>Tarif bulunamadı.</p>
      </main>
    );
  }

  return (
    <main className="page recipe-detail-page">
      <div className="recipe-detail-card">
        <img
          src={
            recipe.image ||
            "https://via.placeholder.com/700x350?text=Tarif+Gorseli"
          }
          alt={recipe.title}
          className="recipe-detail-image"
        />

        <div className="recipe-detail-content">
          <h1>{recipe.title}</h1>
          <p><strong>Kategori:</strong> {recipe.category || "Belirtilmemiş"}</p>
          <p>
            <strong>Açıklama:</strong>{" "}
            {recipe.description || "Açıklama bulunmuyor."}
          </p>

          {recipe.ingredients && (
            <div className="detail-section">
              <h3>Malzemeler</h3>
              <p>{recipe.ingredients}</p>
            </div>
          )}

          {recipe.instructions && (
            <div className="detail-section">
              <h3>Hazırlanışı</h3>
              <p>{recipe.instructions}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default RecipeDetail;

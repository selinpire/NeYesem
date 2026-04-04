import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRecipeById, deleteRecipe } from "../services/recipeService";
import { getApiErrorMessage } from "../services/userService";
import { getFavorites, buildFavoriteRecipeIdSet } from "../services/favoriteService";
import { useAuth } from "../context/AuthContext";
import FavoriteHeartButton from "../components/FavoriteHeartButton";
import RecipeRatingSection from "../components/RecipeRatingSection";
import RecipeCommentsSection from "../components/RecipeCommentsSection";
import RecipeDetailVideo from "../components/RecipeDetailVideo";
import DeleteRecipeModal from "../components/DeleteRecipeModal";
import { recipeOwnerId } from "../utils/recipeText";

function RecipeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorited, setFavorited] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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
  }, [id, user?.id]);

  useEffect(() => {
    if (!user || !recipe?._id) {
      setFavorited(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list = await getFavorites();
        if (cancelled) return;
        const ids = buildFavoriteRecipeIdSet(list);
        setFavorited(ids.has(String(recipe._id)));
      } catch {
        if (!cancelled) setFavorited(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, recipe?._id]);

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

  const hasIngredients = Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
  const hasSteps = Array.isArray(recipe.steps) && recipe.steps.length > 0;

  const ownerId = recipeOwnerId(recipe);
  const isOwner = Boolean(user && ownerId && String(user.id) === String(ownerId));

  const handleConfirmDelete = async () => {
    if (!recipe?._id) return;
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await deleteRecipe(recipe._id);
      setDeleteOpen(false);
      navigate("/my-recipes", { replace: true, state: { recipeDeleted: true } });
    } catch (err) {
      setDeleteError(getApiErrorMessage(err, "Tarif silinemedi."));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <main className="page recipe-detail-page">
      <div className="recipe-detail-card">
        <div className="recipe-detail-media">
          <div className="recipe-detail-image-wrap">
            <img
              src={
                recipe.image ||
                "https://via.placeholder.com/700x350?text=Tarif+Gorseli"
              }
              alt={recipe.title}
              className="recipe-detail-image"
            />
            <FavoriteHeartButton
              recipeId={recipe._id}
              favorited={favorited}
              onFavoriteChange={(next) => setFavorited(next)}
              variant="card"
            />
          </div>
          <RecipeDetailVideo
            key={recipe._id}
            videoUrl={recipe.videoUrl}
            posterUrl={recipe.image || undefined}
            title={recipe.title}
          />
        </div>

        <div className="recipe-detail-content">
          <h1>{recipe.title}</h1>
          {isOwner && (
            <div className="recipe-detail-owner-actions">
              <Link to={`/recipes/${recipe._id}/edit`} className="recipe-btn-sm recipe-btn-sm--secondary">
                Tarif Güncelle
              </Link>
              <button
                type="button"
                className="recipe-btn-sm recipe-btn-sm--danger"
                onClick={() => {
                  setDeleteError("");
                  setDeleteOpen(true);
                }}
              >
                Tarif Sil
              </button>
            </div>
          )}
          <p>
            <strong>Kategori:</strong> {recipe.category || "Belirtilmemiş"}
          </p>
          {recipe.cookingTime?.trim() && (
            <p>
              <strong>Tahmini süre:</strong> {recipe.cookingTime}
            </p>
          )}

          <RecipeRatingSection
            recipeId={recipe._id}
            averageRating={recipe.averageRating}
            ratingsCount={recipe.ratingsCount ?? 0}
            myRating={recipe.myRating}
            onStatsUpdate={(data) => {
              setRecipe((r) =>
                r
                  ? {
                      ...r,
                      averageRating: data.averageRating,
                      ratingsCount: data.ratingsCount,
                      myRating: data.myRating,
                    }
                  : r
              );
            }}
          />

          <div className="detail-section">
            <h2 className="detail-section-title">Açıklama</h2>
            {recipe.description?.trim() ? (
              <p className="recipe-plain-description">{recipe.description}</p>
            ) : (
              <p className="recipe-plain-description recipe-plain-description--empty">
                Açıklama bulunmuyor.
              </p>
            )}
          </div>

          {hasIngredients && (
            <div className="detail-section">
              <h3>Malzemeler (liste)</h3>
              <ul className="recipe-detail-list">
                {recipe.ingredients.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {hasSteps && (
            <div className="detail-section">
              <h3>Adımlar</h3>
              <ol className="recipe-detail-list recipe-detail-list--numbered">
                {recipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          <RecipeCommentsSection
            recipeId={recipe._id}
            comments={recipe.comments}
            onCommentsUpdate={(next) =>
              setRecipe((r) => (r ? { ...r, comments: next } : r))
            }
          />
        </div>
      </div>

      <DeleteRecipeModal
        open={deleteOpen}
        recipeTitle={recipe.title}
        onClose={() => {
          if (!deleteLoading) setDeleteOpen(false);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        error={deleteError}
      />
    </main>
  );
}

export default RecipeDetail;

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getMyRecipes, deleteRecipe } from "../services/recipeService";
import { getApiErrorMessage } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import DeleteRecipeModal from "../components/DeleteRecipeModal";

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [addedBanner, setAddedBanner] = useState(false);
  const [updatedBanner, setUpdatedBanner] = useState(false);
  const [deletedBanner, setDeletedBanner] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const loadList = async () => {
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
  };

  useEffect(() => {
    const s = location.state;
    if (!s || typeof s !== "object") return;
    if (s.recipeAdded) {
      setAddedBanner(true);
    } else if (s.recipeUpdated) {
      setUpdatedBanner(true);
    } else if (s.recipeDeleted) {
      setDeletedBanner(true);
    } else {
      return;
    }
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (user) {
      loadList();
    }
  }, [user]);

  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setDeleteTarget(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await deleteRecipe(deleteTarget._id);
      setRecipes((prev) => prev.filter((r) => String(r._id) !== String(deleteTarget._id)));
      closeDeleteModal();
      setDeletedBanner(true);
    } catch (err) {
      setDeleteError(getApiErrorMessage(err, "Tarif silinemedi."));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="recipes-header">
        <h1>Tariflerim</h1>
        <p>Sadece senin eklediğin tarifler burada listeleniyor (sunucudan hesabına göre çekilir).</p>
      </div>

      {addedBanner && (
        <div className="profile-alert profile-alert--success my-recipes-banner" role="status">
          Tarif başarıyla eklendi.
        </div>
      )}
      {updatedBanner && (
        <div className="profile-alert profile-alert--success my-recipes-banner" role="status">
          Tarif başarıyla güncellendi.
        </div>
      )}
      {deletedBanner && (
        <div className="profile-alert profile-alert--success my-recipes-banner" role="status">
          Tarif başarıyla silindi.
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
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              showFavorite={false}
              detailButtonLabel="Tarife Git"
              currentUserId={user?.id}
              onRequestDelete={(r) => setDeleteTarget(r)}
            />
          ))}
        </div>
      )}

      <DeleteRecipeModal
        open={Boolean(deleteTarget)}
        recipeTitle={deleteTarget?.title}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        error={deleteError}
      />
    </main>
  );
}

export default MyRecipes;

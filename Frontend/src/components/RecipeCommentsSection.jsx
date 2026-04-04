import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addRecipeComment, deleteRecipeComment } from "../services/commentService";
import { getApiErrorMessage } from "../services/userService";

function formatCommentDate(value) {
  if (!value) return "";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
}

function RecipeCommentsSection({ recipeId, comments = [], onCommentsUpdate }) {
  const { user } = useAuth();
  const location = useLocation();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !recipeId) return;
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Yorum metni boş olamaz.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await addRecipeComment(recipeId, trimmed);
      onCommentsUpdate?.(data.comments ?? []);
      setText("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Yorum gönderilemedi."));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!user || !recipeId || !commentId) return;
    setError("");
    setDeletingId(commentId);
    try {
      const data = await deleteRecipeComment(recipeId, commentId);
      onCommentsUpdate?.(data.comments ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Yorum silinemedi."));
    } finally {
      setDeletingId(null);
    }
  };

  const list = Array.isArray(comments) ? comments : [];

  return (
    <div className="recipe-comments-section">
      <h2 className="detail-section-title">Yorumlar</h2>

      {user ? (
        <form className="recipe-comments-form" onSubmit={handleSubmit}>
          <label htmlFor="recipe-comment-text" className="recipe-comments-label">
            Yorumunuz
          </label>
          <textarea
            id="recipe-comment-text"
            className="recipe-comments-textarea"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tarifle ilgili düşüncelerinizi yazın..."
            maxLength={2000}
            disabled={loading}
          />
          <div className="recipe-comments-form-footer">
            <span className="recipe-comments-char-hint">{text.length} / 2000</span>
            <button type="submit" className="recipe-btn recipe-comments-submit" disabled={loading}>
              {loading ? "Gönderiliyor..." : "Yorum gönder"}
            </button>
          </div>
        </form>
      ) : (
        <p className="recipe-rating-guest">
          Yorum yapmak için{" "}
          <Link to="/login" state={{ from: location.pathname }}>
            giriş yapmalısınız
          </Link>
          .
        </p>
      )}

      {error && (
        <p className="form-error recipe-comments-error" role="alert">
          {error}
        </p>
      )}

      {list.length === 0 ? (
        <p className="recipe-comments-empty">Henüz yorum yok. İlk yorumu siz yazın.</p>
      ) : (
        <ul className="recipe-comments-list">
          {list.map((c) => {
            const canDelete =
              user &&
              c.userId != null &&
              String(c.userId) === String(user.id);
            return (
              <li key={c._id} className="recipe-comments-item">
                <div className="recipe-comments-item-head">
                  <span className="recipe-comments-author">{c.userName}</span>
                  <time className="recipe-comments-date" dateTime={c.createdAt}>
                    {formatCommentDate(c.createdAt)}
                  </time>
                </div>
                <p className="recipe-comments-body">{c.text}</p>
                {canDelete && (
                  <button
                    type="button"
                    className="recipe-comments-delete"
                    onClick={() => handleDelete(c._id)}
                    disabled={deletingId === c._id}
                  >
                    {deletingId === c._id ? "Siliniyor..." : "Sil"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default RecipeCommentsSection;

function DeleteRecipeModal({ open, recipeTitle, onClose, onConfirm, loading, error }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-recipe-title"
      >
        <h2 id="delete-recipe-title">Tarifi Sil</h2>
        <p>
          Bu tarifi silmek istediğinize emin misiniz?
          {recipeTitle ? (
            <>
              {" "}
              <strong>{recipeTitle}</strong> kalıcı olarak kaldırılacaktır.
            </>
          ) : null}
        </p>
        {error && (
          <div className="profile-alert profile-alert--error" role="alert">
            {error}
          </div>
        )}
        <div className="modal-actions">
          <button type="button" className="delete-btn" onClick={onConfirm} disabled={loading}>
            {loading ? "Siliniyor..." : "Evet, sil"}
          </button>
          <button type="button" className="secondary-btn" onClick={onClose} disabled={loading}>
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteRecipeModal;

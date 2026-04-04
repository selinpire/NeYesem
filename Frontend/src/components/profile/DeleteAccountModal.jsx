function DeleteAccountModal({ open, onClose, onConfirm, loading, error }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
      >
        <h2 id="delete-account-title">Hesabı Sil</h2>
        <p>
          Hesabınızı silmek istediğinizden emin misiniz? Tarifleriniz, favorileriniz ve
          puanlarınız kalıcı olarak silinir. Bu işlem geri alınamaz.
        </p>
        {error && (
          <div className="profile-alert profile-alert--error" role="alert">
            {error}
          </div>
        )}
        <div className="modal-actions">
          <button type="button" className="delete-btn" onClick={onConfirm} disabled={loading}>
            {loading ? "Siliniyor..." : "Evet, hesabımı sil"}
          </button>
          <button type="button" className="secondary-btn" onClick={onClose} disabled={loading}>
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountModal;

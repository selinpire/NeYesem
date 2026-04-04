import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRecipe, getRecipeById, updateRecipe, deleteRecipeVideo } from "../services/recipeService";
import { getApiErrorMessage } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { recipeOwnerId } from "../utils/recipeText";

const CATEGORIES = [
  "Ana Yemek",
  "Çorba",
  "Tatlı",
  "Salata",
  "Kahvaltı",
  "İçecek",
  "Atıştırmalık",
  "Diğer",
];

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
]);

const MAX_FILE_BYTES = 5 * 1024 * 1024;

function hasAllowedExtension(filename) {
  if (!filename || typeof filename !== "string") return false;
  const lower = filename.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function validateImageFile(file) {
  if (!file) return "Lütfen bir görsel dosyası seçin.";

  if (!hasAllowedExtension(file.name)) {
    return "Geçersiz dosya türü. Yalnızca .jpg, .jpeg, .png veya .webp uzantılı dosyalar seçilebilir.";
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    return "Geçersiz dosya türü. Dosya JPEG, PNG veya WebP görseli olmalıdır (.jpg, .jpeg, .png, .webp).";
  }

  if (file.size > MAX_FILE_BYTES) {
    return "Dosya en fazla 5 MB olabilir.";
  }

  return "";
}

function isValidDataImagePayload(value) {
  return (
    typeof value === "string" &&
    /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(value)
  );
}

function isHttpRecipeImage(value) {
  if (typeof value !== "string") return false;
  const t = value.trim();
  return /^https?:\/\//i.test(t) && !t.startsWith("//");
}

const emptyForm = () => ({
  title: "",
  description: "",
  category: "",
  image: "",
  cookingTime: "",
  videoUrl: "",
});

function RecipeEditor({ mode, recipeId }) {
  const isEdit = mode === "edit";
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyForm);
  const [imageFileName, setImageFileName] = useState("");
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadLoading, setLoadLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState("");
  const [videoDeleting, setVideoDeleting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isEdit || !recipeId) {
      setLoadLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoadError("");
      setLoadLoading(true);
      try {
        const data = await getRecipeById(recipeId);
        if (cancelled) return;

        const oid = recipeOwnerId(data);
        if (user && oid && String(user.id) !== String(oid)) {
          setLoadError("Bu tarifi düzenleme yetkiniz yok.");
          return;
        }

        setFormData({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          image: data.image || "",
          cookingTime: data.cookingTime || "",
          videoUrl: data.videoUrl || "",
        });
        setImageFileName(data.image ? "Mevcut görsel" : "");
      } catch {
        if (!cancelled) setLoadError("Tarif yüklenemedi.");
      } finally {
        if (!cancelled) setLoadLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isEdit, recipeId, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setImageError("");
    if (!file) {
      return;
    }

    const msg = validateImageFile(file);
    if (msg) {
      setImageError(msg);
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== "string" || !isValidDataImagePayload(result)) {
        setImageError(
          "Geçersiz görsel içeriği. Yalnızca .jpg, .jpeg, .png veya .webp dosyası yükleyebilirsiniz."
        );
        return;
      }
      setFormData((prev) => ({ ...prev, image: result }));
      setImageFileName(file.name);
    };
    reader.onerror = () => {
      setImageError("Dosya okunamadı. Başka bir dosya deneyin.");
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setImageFileName("");
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateImageForSubmit = () => {
    const imgRaw = formData.image?.trim() || "";

    if (!imgRaw) {
      return isEdit
        ? "Tarif görseli zorunludur. Mevcut görseli kaldırdıysanız yeni bir dosya seçin."
        : "Tarif için bir görsel yüklemeniz gerekir. Yalnızca .jpg, .jpeg, .png veya .webp dosyası seçin; URL kullanılamaz.";
    }

    if (!isEdit) {
      if (/^https?:\/\//i.test(imgRaw) || imgRaw.startsWith("//")) {
        return "Görsel URL ile eklenemez. Lütfen yalnızca .jpg, .jpeg, .png veya .webp uzantılı dosya yükleyin.";
      }
      if (!isValidDataImagePayload(imgRaw)) {
        return "Geçersiz görsel. Yalnızca dosya yükleyerek JPEG, PNG veya WebP görseli ekleyebilirsiniz (.jpg, .jpeg, .png, .webp).";
      }
    } else {
      if (isHttpRecipeImage(imgRaw)) {
        return null;
      }
      if (!isValidDataImagePayload(imgRaw)) {
        return "Geçersiz görsel. Yeni görsel yüklerken yalnızca .jpg, .jpeg, .png veya .webp dosyası seçin.";
      }
    }

    return null;
  };

  const handleRemoveVideo = async () => {
    if (!isEdit || !recipeId) return;
    setError("");
    setVideoDeleting(true);
    try {
      await deleteRecipeVideo(recipeId);
      setFormData((prev) => ({ ...prev, videoUrl: "" }));
    } catch (err) {
      setError(getApiErrorMessage(err, "Video kaldırılamadı."));
    } finally {
      setVideoDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imgErr = validateImageForSubmit();
    if (imgErr) {
      setImageError(imgErr);
      return;
    }

    if (!formData.category) {
      setError("Lütfen bir kategori seçin.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (isEdit) {
        await updateRecipe(recipeId, formData);
        navigate("/my-recipes", { replace: true, state: { recipeUpdated: true } });
      } else {
        await addRecipe(formData);
        navigate("/my-recipes", { replace: true, state: { recipeAdded: true } });
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 413) {
        setError(
          "Gönderilen veri çok büyük. Daha küçük veya daha düşük çözünürlüklü bir görsel seçin (.jpg, .webp önerilir)."
        );
      } else {
        setError(
          getApiErrorMessage(
            err,
            isEdit ? "Tarif güncellenirken hata oluştu." : "Tarif eklenirken hata oluştu."
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (isEdit && loadLoading) {
    return (
      <main className="page">
        <p>Tarif yükleniyor...</p>
      </main>
    );
  }

  if (isEdit && loadError) {
    return (
      <main className="page">
        <div className="form-container">
          <p className="form-error">{loadError}</p>
          <button type="button" className="primary-btn" style={{ marginTop: "16px" }} onClick={() => navigate("/my-recipes")}>
            Tariflerime dön
          </button>
        </div>
      </main>
    );
  }

  const hasVideo = Boolean(formData.videoUrl?.trim());
  const imageOk = Boolean(formData.image?.trim());
  const submitDisabled = loading || !!imageError || !imageOk || !formData.category;

  return (
    <main className="page">
      <div className="form-container">
        <h1>{isEdit ? "Tarifi Güncelle" : "Tarif Ekle"}</h1>
        <p>{isEdit ? "Tarif bilgilerini düzenleyin." : "Yeni bir tarif paylaş."}</p>

        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="form-field">
            <label className="form-label">Tarif Başlığı</label>
            <input
              type="text"
              name="title"
              placeholder="Örn: Fırında Lazanya"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Tarif Açıklaması</label>
            <textarea
              name="description"
              placeholder="Malzemeleri, yapılış adımlarını ve püf noktalarını düz metin olarak yazabilirsiniz. Satır sonları korunur."
              value={formData.description}
              onChange={handleChange}
              rows={14}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" id="category-label">
              Kategori
            </label>
            <div className="category-picker">
              <div className="category-picker-summary" aria-live="polite">
                {formData.category ? (
                  <>
                    Seçilen: <strong>{formData.category}</strong>
                  </>
                ) : (
                  <span className="category-picker-placeholder">
                    Aşağıdaki listeden kaydırarak bir kategori seçin
                  </span>
                )}
              </div>
              <div className="category-picker-scroll" role="listbox" aria-labelledby="category-label">
                {CATEGORIES.map((cat) => {
                  const id = `cat-opt-${cat.replace(/\s+/g, "-")}`;
                  const selected = formData.category === cat;
                  return (
                    <button
                      key={cat}
                      id={id}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={`category-option${selected ? " is-selected" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                    >
                      <span className="category-option-label">{cat}</span>
                      {selected && (
                        <span className="category-option-check" aria-hidden="true">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="category-picker-scroll-hint">Çok seçenek olduğunda liste dikey kaydırılır.</p>
            </div>
            {!formData.category && (
              <p className="form-hint" style={{ marginTop: "6px" }}>
                Kaydırılabilir listeden bir kategori seçiniz.
              </p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Tahmini Yapılış Süresi</label>
            <input
              type="text"
              name="cookingTime"
              placeholder="Örn: 30 dk, 1 saat 15 dk"
              value={formData.cookingTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Tarif Görseli {isEdit ? "" : "(zorunlu)"}</label>
            <p className="form-hint">
              {isEdit
                ? "Mevcut görsel korunur. Değiştirmek için yeni dosya seçin (.jpg, .jpeg, .png, .webp)."
                : "Yalnızca cihazınızdan dosya seçin: .jpg, .jpeg, .png, .webp. Bağlantı (URL) ile görsel eklenmez."}
            </p>
            <div className="recipe-image-upload">
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="recipe-image-input-hidden"
                onChange={handleFileChange}
                aria-invalid={!!imageError}
              />
              <button type="button" className="recipe-image-pick-btn" onClick={() => fileInputRef.current?.click()}>
                Dosya seç
              </button>
              {imageFileName && (
                <span className="recipe-image-filename" title={imageFileName}>
                  {imageFileName}
                </span>
              )}
              {formData.image && (
                <button type="button" className="recipe-image-clear secondary-btn" onClick={clearImage}>
                  Kaldır
                </button>
              )}
            </div>
            {formData.image && !imageError && (
              <div className="recipe-image-preview-wrap">
                <img src={formData.image} alt="Tarif görseli önizlemesi" className="recipe-image-preview" />
              </div>
            )}
            {imageError && <p className="form-error">{imageError}</p>}
          </div>

          <div className="form-field">
            <label className="form-label">Video URL (isteğe bağlı)</label>
            <p className="form-hint">
              YouTube, Vimeo veya doğrudan video dosyası bağlantısı. Boş bırakırsanız detay sayfasında video alanı
              gösterilmez.
            </p>
            {isEdit && hasVideo && (
              <div className="recipe-editor-current-video">
                <p className="recipe-editor-video-label">Mevcut video</p>
                <a
                  href={formData.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="recipe-editor-video-link"
                >
                  {formData.videoUrl}
                </a>
                <button
                  type="button"
                  className="secondary-btn recipe-editor-remove-video"
                  onClick={handleRemoveVideo}
                  disabled={videoDeleting}
                >
                  {videoDeleting ? "Kaldırılıyor..." : "Videoyu Sil"}
                </button>
              </div>
            )}
            <input
              type="url"
              name="videoUrl"
              placeholder="https://www.youtube.com/watch?v=…"
              value={formData.videoUrl}
              onChange={handleChange}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={submitDisabled}>
            {loading ? (isEdit ? "Kaydediliyor..." : "Ekleniyor...") : isEdit ? "Değişiklikleri Kaydet" : "Tarifi Ekle"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default RecipeEditor;

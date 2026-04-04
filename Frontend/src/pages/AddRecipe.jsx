import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRecipe } from "../services/recipeService";
import { getApiErrorMessage } from "../services/userService";

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

function AddRecipe() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    cookingTime: "",
    videoUrl: "",
  });

  const [imageFileName, setImageFileName] = useState("");
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setImageError("");
    if (!file) {
      setFormData((prev) => ({ ...prev, image: "" }));
      setImageFileName("");
      return;
    }

    const msg = validateImageFile(file);
    if (msg) {
      setImageError(msg);
      e.target.value = "";
      setFormData((prev) => ({ ...prev, image: "" }));
      setImageFileName("");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== "string" || !isValidDataImagePayload(result)) {
        setImageError(
          "Geçersiz görsel içeriği. Yalnızca .jpg, .jpeg, .png veya .webp dosyası yükleyebilirsiniz."
        );
        setFormData((prev) => ({ ...prev, image: "" }));
        setImageFileName("");
        return;
      }
      setFormData((prev) => ({ ...prev, image: result }));
      setImageFileName(file.name);
    };
    reader.onerror = () => {
      setImageError("Dosya okunamadı. Başka bir dosya deneyin.");
      setFormData((prev) => ({ ...prev, image: "" }));
      setImageFileName("");
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setImageFileName("");
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imgRaw = formData.image?.trim() || "";

    if (!imgRaw) {
      setImageError(
        "Tarif için bir görsel yüklemeniz gerekir. Yalnızca .jpg, .jpeg, .png veya .webp dosyası seçin; URL kullanılamaz."
      );
      return;
    }

    if (/^https?:\/\//i.test(imgRaw) || imgRaw.startsWith("//")) {
      setImageError(
        "Görsel URL ile eklenemez. Lütfen yalnızca .jpg, .jpeg, .png veya .webp uzantılı dosya yükleyin."
      );
      return;
    }

    if (!isValidDataImagePayload(imgRaw)) {
      setImageError(
        "Geçersiz görsel. Yalnızca dosya yükleyerek JPEG, PNG veya WebP görseli ekleyebilirsiniz (.jpg, .jpeg, .png, .webp)."
      );
      return;
    }

    if (!formData.category) {
      setError("Lütfen bir kategori seçin.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await addRecipe(formData);
      navigate("/my-recipes", { replace: true, state: { recipeAdded: true } });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 413) {
        setError(
          "Gönderilen veri çok büyük. Daha küçük veya daha düşük çözünürlüklü bir görsel seçin (.jpg, .webp önerilir)."
        );
      } else {
        setError(getApiErrorMessage(err, "Tarif eklenirken hata oluştu."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="form-container">
        <h1>Tarif Ekle</h1>
        <p>Yeni bir tarif paylaş.</p>

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
              <div
                className="category-picker-scroll"
                role="listbox"
                aria-labelledby="category-label"
              >
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
            <label className="form-label">Tarif Görseli (zorunlu)</label>
            <p className="form-hint">
              Yalnızca cihazınızdan dosya seçin: <strong>.jpg</strong>, <strong>.jpeg</strong>, <strong>.png</strong>,{" "}
              <strong>.webp</strong>. Bağlantı (URL) ile görsel eklenmez; geçersiz tür seçilirse hata gösterilir.
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
              <button
                type="button"
                className="recipe-image-pick-btn"
                onClick={() => fileInputRef.current?.click()}
              >
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
                <img src={formData.image} alt="Seçilen tarif görseli önizlemesi" className="recipe-image-preview" />
              </div>
            )}
            {imageError && <p className="form-error">{imageError}</p>}
          </div>

          <div className="form-field">
            <label className="form-label">Video URL (isteğe bağlı)</label>
            <input
              type="text"
              name="videoUrl"
              placeholder="https://youtube.com/..."
              value={formData.videoUrl}
              onChange={handleChange}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={loading || !!imageError || !formData.image}>
            {loading ? "Ekleniyor..." : "Tarifi Ekle"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default AddRecipe;

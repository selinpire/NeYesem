import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRecipe } from "../services/recipeService";

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

const isValidImageUrl = (url) => {
  if (!url) return true;
  const lower = url.toLowerCase().split("?")[0];
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
};

function AddRecipe() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    cookingTime: "",
    videoUrl: "",
  });

  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "image") {
      if (value && !isValidImageUrl(value)) {
        setImageError("Sadece .jpg, .jpeg, .png, .webp uzantılı görseller kabul edilir.");
      } else {
        setImageError("");
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.image && !isValidImageUrl(formData.image)) {
      setImageError("Sadece .jpg, .jpeg, .png, .webp uzantılı görseller kabul edilir.");
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
      navigate("/my-recipes");
    } catch (err) {
      console.error(err);
      setError("Tarif eklenirken hata oluştu.");
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
            <label className="form-label">Açıklama</label>
            <p className="form-hint">
              Düzenli tarif için şu formatı kullanabilirsin:&nbsp;
              <code># Başlık</code>&nbsp;
              <code>## Alt Başlık</code>&nbsp;
              <code>- Madde</code>
            </p>
            <textarea
              name="description"
              placeholder={"# Lazanya Tarifi Anlatımı İçin Malzemeler\n\n## İç harcı için;\n- 400 gr kıyma\n- 2 adet soğan\n\n## Beşamel sosu için;\n- 3 su bardağı süt\n- 2 yemek kaşığı tereyağı\n\n## Yapılışı\n\nFırını 180 dereceye ısıtın..."}
              value={formData.description}
              onChange={handleChange}
              rows="14"
              className="markdown-textarea"
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Kategori</label>
            <div className="category-scroll-wrapper">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-chip${formData.category === cat ? " active" : ""}`}
                  onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                >
                  {cat}
                </button>
              ))}
            </div>
            {!formData.category && (
              <p className="form-hint" style={{ marginTop: "6px" }}>Bir kategori seçiniz.</p>
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
            <label className="form-label">Görsel URL</label>
            <input
              type="text"
              name="image"
              placeholder="https://example.com/gorsel.jpg"
              value={formData.image}
              onChange={handleChange}
            />
            {imageError && <p className="form-error">{imageError}</p>}
            <p className="form-hint">Kabul edilen formatlar: .jpg .jpeg .png .webp</p>
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

          <button type="submit" disabled={loading || !!imageError}>
            {loading ? "Ekleniyor..." : "Tarifi Ekle"}
          </button>

        </form>
      </div>
    </main>
  );
}

export default AddRecipe;

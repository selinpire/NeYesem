import { useState } from "react";
import { FaRobot, FaPaperPlane, FaMagic } from "react-icons/fa";
import RecipeCard from "./RecipeCard";
import { suggestRecipesByMood } from "../services/aiRecipeService";
import { getApiErrorMessage } from "../services/userService";

const MOOD_CHIPS = [
  "Mutlu",
  "Yorgun",
  "Enerjik",
  "Üzgün",
  "Rahat",
  "Pratik bir şey istiyorum",
  "Hafif bir şey istiyorum",
  "Tatlı canım çekti",
];

function MoodRecipeAssistant({ user, favoriteIds, onFavoriteChange }) {
  const [mood, setMood] = useState("");
  const [assistantMessage, setAssistantMessage] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noRecipeMatch, setNoRecipeMatch] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = mood.trim();
    if (!text || loading) return;
    setError("");
    setNoRecipeMatch(false);
    setLoading(true);
    setRecipes([]);
    setAssistantMessage("");
    try {
      const res = await suggestRecipesByMood(text);
      if (!res.success || !res.data) {
        setError(res.message || "Öneri alınamadı.");
        return;
      }
      const list = Array.isArray(res.data.recipes) ? res.data.recipes : [];
      setAssistantMessage(res.data.assistantMessage || "");
      setRecipes(list);
      setNoRecipeMatch(list.length === 0);
    } catch (err) {
      setError(getApiErrorMessage(err, "Öneri oluşturulamadı."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ai-mood-section" aria-labelledby="ai-mood-title">
      <div className="ai-mood-panel">
        <div className="ai-mood-panel-glow" aria-hidden />

        <header className="ai-mood-header">
          <div className="ai-mood-title-row">
            <span className="ai-badge ai-badge--lg">
              <FaMagic aria-hidden />
              AI Asistan
            </span>
            <h2 id="ai-mood-title">Moduna göre akıllı tarif önerisi</h2>
          </div>
          <p className="ai-mood-lead">
            Nasıl hissediyorsun veya neye ihtiyacın var? Yapay zeka, sitedeki gerçek tarifler arasından
            sana uygun olanları seçer.
          </p>
        </header>

        <div className="ai-mood-chat">
          <div className="ai-mood-bot-row">
            <div className="ai-mood-avatar" aria-hidden>
              <FaRobot />
            </div>
            <div className="ai-mood-bubble ai-mood-bubble--bot">
              <p>
                Merhaba! Bugünkü modunu yaz ya da aşağıdaki etiketlerden birine dokun. Veritabanındaki
                tariflere göre <strong>akıllı öneriler</strong> hazırlayayım.
              </p>
            </div>
          </div>

          {assistantMessage && (
            <div className="ai-mood-bot-row ai-mood-bot-row--reply">
              <div className="ai-mood-avatar" aria-hidden>
                <FaRobot />
              </div>
              <div className="ai-mood-bubble ai-mood-bubble--bot ai-mood-bubble--accent">
                <p>{assistantMessage}</p>
              </div>
            </div>
          )}

          <div className="ai-mood-chips" role="group" aria-label="Hızlı mod seçenekleri">
            {MOOD_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                className="ai-mood-chip"
                onClick={() => setMood(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          <form className="ai-mood-form" onSubmit={handleSubmit}>
            <label htmlFor="ai-mood-input" className="visually-hidden">
              Modun veya isteğin
            </label>
            <textarea
              id="ai-mood-input"
              className="ai-mood-input"
              rows={2}
              placeholder="Örn: Çok yorgunum, az uğraştıracak sıcak bir şey istiyorum…"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              maxLength={220}
              disabled={loading}
            />
            <button type="submit" className="ai-mood-send" disabled={loading || !mood.trim()}>
              {loading ? (
                "Düşünüyorum…"
              ) : (
                <>
                  <FaPaperPlane aria-hidden />
                  Öner
                </>
              )}
            </button>
          </form>

          <p className="ai-mood-footnote">
            <strong>Yapay zeka desteklidir.</strong> Öneriler tahminidir; tarifler sitede kayıtlı
            içeriklerden gelir.
          </p>

          {error && (
            <p className="form-error ai-mood-error" role="alert">
              {error}
            </p>
          )}
        </div>

        {noRecipeMatch && assistantMessage && !error && (
          <p className="ai-mood-no-match" role="status">
            Şu an veritabanındaki tarifler arasında bu moda çok uygun eşleşme çıkmadı; metni biraz değiştirip tekrar
            deneyebilirsin.
          </p>
        )}

        {recipes.length > 0 && (
          <div className="ai-mood-results">
            <h3 className="ai-mood-results-title">Sana seçtiklerim</h3>
            <div className="recipes-grid ai-mood-results-grid">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  favorited={favoriteIds?.has(String(recipe._id))}
                  onFavoriteChange={(next) => onFavoriteChange?.(recipe._id, next)}
                  showFavorite={Boolean(user)}
                  detailButtonLabel="Detay"
                  currentUserId={user?.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default MoodRecipeAssistant;

import { FaBolt, FaRobot } from "react-icons/fa";

function MacroPill({ label, value }) {
  if (!value) return null;
  return (
    <span className="ai-nutrition-macro">
      <span className="ai-nutrition-macro-label">{label}</span>
      <span className="ai-nutrition-macro-value">{value}</span>
    </span>
  );
}

/**
 * Tarif detayında yapay zeka kalori tahmini (backend: aiNutritionEstimate).
 */
function RecipeAiNutritionCard({ estimate, skipped, failed }) {
  if (skipped) {
    return (
      <aside className="ai-nutrition-card ai-nutrition-card--muted" aria-label="Kalori analizi">
        <div className="ai-nutrition-card-head">
          <span className="ai-badge">
            <FaRobot aria-hidden />
            AI
          </span>
          <h2 className="ai-nutrition-title">Yapay zeka kalori analizi</h2>
        </div>
        <p className="ai-nutrition-muted-text">
          Tahmini kalori analizi sunucuda yapılandırılmadı (API anahtarı yok).
        </p>
      </aside>
    );
  }

  if (failed && !estimate?.totalCalories) {
    return (
      <aside className="ai-nutrition-card ai-nutrition-card--muted" aria-label="Kalori analizi">
        <div className="ai-nutrition-card-head">
          <span className="ai-badge">
            <FaRobot aria-hidden />
            AI
          </span>
          <h2 className="ai-nutrition-title">Yapay zeka kalori analizi</h2>
        </div>
        <p className="ai-nutrition-muted-text">
          Şu an tahmini kalori hesaplanamadı. Daha sonra tekrar deneyebilirsiniz.
        </p>
      </aside>
    );
  }

  if (!estimate || !estimate.totalCalories) {
    return null;
  }

  const per = estimate.caloriesPerServing;

  return (
    <aside className="ai-nutrition-card" aria-label="Yapay zeka destekli kalori tahmini">
      <div className="ai-nutrition-card-glow" aria-hidden />
      <div className="ai-nutrition-card-inner">
        <div className="ai-nutrition-card-head">
          <span className="ai-badge ai-badge--pulse">
            <FaRobot aria-hidden />
            Yapay Zeka Destekli
          </span>
          <div className="ai-nutrition-icon-wrap" aria-hidden>
            <FaBolt className="ai-nutrition-bolt" />
          </div>
        </div>

        <h2 className="ai-nutrition-heading">AI analiz sonucu — tahmini kalori</h2>

        <div className="ai-nutrition-numbers">
          <div className="ai-nutrition-kcal-main">
            <span className="ai-nutrition-kcal-value">{Math.round(estimate.totalCalories)}</span>
            <span className="ai-nutrition-kcal-unit">kcal</span>
            <span className="ai-nutrition-kcal-hint">yaklaşık toplam</span>
          </div>
          {per != null && per > 0 && (
            <div className="ai-nutrition-kcal-secondary">
              ~{Math.round(per)} kcal / porsiyon <span className="ai-nutrition-approx">(tahmini)</span>
            </div>
          )}
        </div>

        <div className="ai-nutrition-macros">
          <MacroPill label="Protein" value={estimate.protein} />
          <MacroPill label="Karbonhidrat" value={estimate.carbs} />
          <MacroPill label="Yağ" value={estimate.fat} />
        </div>

        {estimate.suggestion?.trim() && (
          <p className="ai-nutrition-suggestion">
            <strong>Akıllı not:</strong> {estimate.suggestion}
          </p>
        )}

        <p className="ai-nutrition-disclaimer">
          Bu değerler tarif içeriği yapay zeka ile analiz edilerek <strong>tahmini</strong> olarak
          oluşturulmuştur; tıbbi veya kesin beslenme bilgisi yerine geçmez.
        </p>
      </div>
    </aside>
  );
}

export default RecipeAiNutritionCard;

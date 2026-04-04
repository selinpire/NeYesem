import { HiSparkles } from "react-icons/hi2";

function fmtCal(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return "—";
  return `${Math.round(x)}`;
}

function macroLabel(tr) {
  if (!tr || typeof tr !== "string") return "—";
  const t = tr.trim().toLowerCase();
  if (["düşük", "orta", "yüksek"].includes(t)) {
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  return tr;
}

/**
 * @param {object} props
 * @param {object | null | undefined} props.estimate — GET /recipes/:id → aiCalorieEstimate
 * @param {boolean} props.hasIngredients
 */
function RecipeAiCalorieSection({ estimate, hasIngredients }) {
  return (
    <section
      className="recipe-ai-calorie"
      aria-labelledby="recipe-ai-calorie-heading"
    >
      <div className="recipe-ai-calorie__glow" aria-hidden />
      <div className="recipe-ai-calorie__inner">
        <header className="recipe-ai-calorie__head">
          <span className="recipe-ai-calorie__badge" aria-hidden>
            AI
          </span>
          <div className="recipe-ai-calorie__title-wrap">
            <span className="recipe-ai-calorie__icon" aria-hidden>
              <HiSparkles />
            </span>
            <div>
              <h2 id="recipe-ai-calorie-heading" className="recipe-ai-calorie__title">
                Yapay zeka destekli kalori tahmini
              </h2>
              <p className="recipe-ai-calorie__subtitle">
                Bu tarif için tahmini kalori analizi
              </p>
            </div>
          </div>
        </header>

        {!hasIngredients && (
          <p className="recipe-ai-calorie__hint">
            Malzeme listesi olmadan yapay zeka ile anlamlı bir kalori tahmini üretilemez. Tarife
            malzeme eklediğinizde bu bölüm otomatik olarak dolar.
          </p>
        )}

        {hasIngredients && !estimate && (
          <p className="recipe-ai-calorie__hint">
            Tahmini analiz şu an gösterilemiyor (servis geçici olarak kullanılamıyor olabilir). Sayfayı
            daha sonra yenilemeyi deneyin.
          </p>
        )}

        {hasIngredients && estimate && (
          <>
            <p className="recipe-ai-calorie__disclaimer">
              Bu değerler tarif içeriği yapay zeka ile analiz edilerek <strong>tahmini</strong> olarak
              oluşturulmuştur; laboratuvar ölçümü değildir ve kişiden kişiye değişebilir.
            </p>

            <div className="recipe-ai-calorie__stats">
              <div className="recipe-ai-calorie__stat recipe-ai-calorie__stat--hero">
                <span className="recipe-ai-calorie__stat-label">Toplam (tahmini)</span>
                <span className="recipe-ai-calorie__stat-value">
                  {fmtCal(estimate.totalCalories)}
                  <span className="recipe-ai-calorie__unit"> kcal</span>
                </span>
              </div>
              <div className="recipe-ai-calorie__stat">
                <span className="recipe-ai-calorie__stat-label">Porsiyon başı (tahmini)</span>
                <span className="recipe-ai-calorie__stat-value">
                  {fmtCal(estimate.caloriesPerServing)}
                  <span className="recipe-ai-calorie__unit"> kcal</span>
                </span>
              </div>
            </div>

            <ul className="recipe-ai-calorie__macros" aria-label="Makro dağılımı (tahmini seviye)">
              <li>
                <span className="recipe-ai-calorie__macro-label">Protein</span>
                <span className="recipe-ai-calorie__macro-pill">{macroLabel(estimate.protein)}</span>
              </li>
              <li>
                <span className="recipe-ai-calorie__macro-label">Karbonhidrat</span>
                <span className="recipe-ai-calorie__macro-pill">{macroLabel(estimate.carbs)}</span>
              </li>
              <li>
                <span className="recipe-ai-calorie__macro-label">Yağ</span>
                <span className="recipe-ai-calorie__macro-pill">{macroLabel(estimate.fat)}</span>
              </li>
            </ul>

            {estimate.suggestion?.trim() && (
              <div className="recipe-ai-calorie__suggestion">
                <span className="recipe-ai-calorie__suggestion-label">AI önerisi</span>
                <p>{estimate.suggestion.trim()}</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default RecipeAiCalorieSection;

import Hero from "../components/Hero";
import { Link } from "react-router-dom";

const sampleRecipes = [
  {
    id: 1,
    title: "Kremalı Mantar Çorbası",
    category: "Çorba",
    description:
      "Kadifemsi dokusu ve zengin aromasıyla kış günlerinin vazgeçilmez klasiği. 30 dakikada hazır!",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
    time: "30 dk",
    difficulty: "Kolay",
  },
  {
    id: 2,
    title: "Fırında Tavuk But",
    category: "Ana Yemek",
    description:
      "Baharatlar ve limon ile marine edilmiş, dışı çıtır içi sulu fırın tavuğu. Aile sofralarının favorisi.",
    image:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600&q=80",
    time: "55 dk",
    difficulty: "Orta",
  },
  {
    id: 3,
    title: "Akdeniz Salatası",
    category: "Salata",
    description:
      "Taze sebzeler, zeytin ve beyaz peynirle hazırlanan ferahlatıcı Akdeniz salatası. Sağlıklı ve doyurucu.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    time: "15 dk",
    difficulty: "Kolay",
  },
  {
    id: 4,
    title: "Çikolatalı Sufle",
    category: "Tatlı",
    description:
      "İçinden sıcak çikolata akan, dışı hafif çıtır tatlı. Misafirlerinizi etkileyecek şık bir lezzet.",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80",
    time: "25 dk",
    difficulty: "Zor",
  },
  {
    id: 5,
    title: "Ev Yapımı Lazanya",
    category: "Ana Yemek",
    description:
      "Bolonez sos ve beşamel ile katman katman hazırlanan, fırından çıktığı gibi sofraya gelen nefis lazanya.",
    image:
      "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&q=80",
    time: "80 dk",
    difficulty: "Orta",
  },
  {
    id: 6,
    title: "Limonlu Cheesecake",
    category: "Tatlı",
    description:
      "Taze limon kabuğu ve kremalı peynirden hazırlanan tazeleyici no-bake cheesecake tarifi.",
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80",
    time: "20 dk",
    difficulty: "Kolay",
  },
];

const difficultyColor = {
  Kolay: "badge--green",
  Orta: "badge--orange",
  Zor: "badge--red",
};

function Home() {
  return (
    <main>
      <div className="page">
        <Hero />
      </div>

      <section id="sample-recipes" className="sample-recipes-section">
        <div className="page">
          <div className="section-header">
            <div>
              <span className="section-tag">Öne Çıkan Tarifler</span>
              <h2 className="section-title">
                Bugün ne pişirsek? <span>İşte fikirler!</span>
              </h2>
              <p className="section-subtitle">
                Mutfak deneyiminizi zenginleştirecek özenle seçilmiş tarifler.
              </p>
            </div>
            <Link to="/recipes" className="view-all-btn">
              Tümünü Gör
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="sample-recipes-grid">
            {sampleRecipes.map((recipe) => (
              <div className="sample-card" key={recipe.id}>
                <div className="sample-card-image-wrapper">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="sample-card-image"
                    loading="lazy"
                  />
                  <span
                    className={`difficulty-badge ${difficultyColor[recipe.difficulty]}`}
                  >
                    {recipe.difficulty}
                  </span>
                  <div className="sample-card-overlay">
                    <Link
                      to="/recipes"
                      className="overlay-btn"
                    >
                      Tarife Git
                    </Link>
                  </div>
                </div>
                <div className="sample-card-body">
                  <span className="category-tag">{recipe.category}</span>
                  <h3 className="sample-card-title">{recipe.title}</h3>
                  <p className="sample-card-desc">{recipe.description}</p>
                  <div className="sample-card-footer">
                    <span className="time-info">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path
                          strokeLinecap="round"
                          d="M12 6v6l4 2"
                        />
                      </svg>
                      {recipe.time}
                    </span>
                    <Link to="/recipes" className="recipe-btn-sm">
                      Detay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;

import heroImage from "../assets/solkısım.png";

function Hero() {
  const handleScroll = () => {
    const section = document.getElementById("sample-recipes");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-badge">
          Lezzetli Tarifler &bull; Kolay Yapım &bull; İştah Açıcı Sunumlar
        </span>
        <h1>
          Mutfakta <span>ilham</span> arayanlar için en lezzetli{" "}
          <span>tarifler</span> burada!
        </h1>
        <p className="hero-text">
          Binlerce tarif arasından favorini bul, adım adım pişir, sevdiklerinle
          paylaş. Her öğün özel, her lokma bir deneyim.
        </p>
        <button className="primary-btn hero-cta" onClick={handleScroll}>
          Tarifleri Keşfet
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <div className="hero-visual">
        <div className="hero-image-wrapper">
          <img src={heroImage} alt="Lezzetli Yemek" className="hero-img" />
          <div className="hero-badge-float hero-badge-float--top">
            <span>500+</span>
            <p>Tarif</p>
          </div>
          <div className="hero-badge-float hero-badge-float--bottom">
            <span>⭐ 4.9</span>
            <p>Kullanıcı Puanı</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

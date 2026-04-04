import { useEffect, useRef, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { parseRecipeVideoUrl } from "../utils/recipeVideo";

function EmbedVideoPreview({ iframeSrc, thumbUrl, posterUrl, title }) {
  const [active, setActive] = useState(false);
  const thumb =
    thumbUrl ||
    posterUrl ||
    "https://via.placeholder.com/1280x720?text=Video";

  useEffect(() => {
    setActive(false);
  }, [iframeSrc]);

  return (
    <div className="recipe-video-aspect">
      {!active ? (
        <button
          type="button"
          className="recipe-video-preview-btn"
          onClick={() => setActive(true)}
          aria-label={`${title} — videoyu oynat`}
        >
          <img src={thumb} alt="" className="recipe-video-preview-thumb" />
          <span className="recipe-video-preview-overlay" aria-hidden="true">
            <FaPlayCircle className="recipe-video-play-icon" />
          </span>
        </button>
      ) : (
        <iframe
          className="recipe-video-frame"
          src={iframeSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </div>
  );
}

function DirectVideoPlayer({ src, posterUrl, title }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setStarted(false);
    setBroken(false);
  }, [src]);

  const handlePlay = () => {
    setStarted(true);
    requestAnimationFrame(() => {
      ref.current?.play?.().catch(() => {});
    });
  };

  if (broken) {
    return (
      <div className="recipe-video-aspect recipe-video-fallback">
        <p className="recipe-video-fallback-text">
          Bu adres tarayıcıda doğrudan oynatılamadı. Bağlantıyı yeni sekmede deneyebilirsiniz.
        </p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="recipe-video-fallback-link"
        >
          Videoyu aç
        </a>
      </div>
    );
  }

  return (
    <div className="recipe-video-aspect recipe-video-aspect--direct">
      <video
        ref={ref}
        className="recipe-video-frame recipe-detail-video-el"
        src={src}
        poster={posterUrl || undefined}
        controls={started}
        playsInline
        preload="metadata"
        onError={() => setBroken(true)}
        aria-label={title}
      />
      {!started && (
        <button
          type="button"
          className="recipe-video-overlay-play"
          onClick={handlePlay}
          aria-label="Videoyu oynat"
        >
          <FaPlayCircle className="recipe-video-play-icon" />
        </button>
      )}
    </div>
  );
}

/**
 * videoUrl doluysa görsel bloğunun altında video alanı gösterir.
 * YouTube / Vimeo: önizleme + tıklayınca embed. Doğrudan URL: poster + tıklayınca kontroller.
 */
function RecipeDetailVideo({ videoUrl, posterUrl, title }) {
  const parsed = parseRecipeVideoUrl(videoUrl);
  if (!parsed) return null;

  const label = `${title} — yapılış videosu`;

  if (parsed.kind === "youtube") {
    const embedSrc = `${parsed.embedBase}?autoplay=1&rel=0`;
    return (
      <section className="recipe-detail-video" aria-label="Yapılış videosu">
        <h2 className="recipe-detail-video-title">Yapılış videosu</h2>
        <EmbedVideoPreview
          iframeSrc={embedSrc}
          thumbUrl={parsed.thumbUrl}
          posterUrl={posterUrl}
          title={label}
        />
      </section>
    );
  }

  if (parsed.kind === "vimeo") {
    const embedSrc = `${parsed.embedBase}?autoplay=1`;
    return (
      <section className="recipe-detail-video" aria-label="Yapılış videosu">
        <h2 className="recipe-detail-video-title">Yapılış videosu</h2>
        <EmbedVideoPreview
          iframeSrc={embedSrc}
          thumbUrl={parsed.thumbUrl}
          posterUrl={posterUrl}
          title={label}
        />
      </section>
    );
  }

  return (
    <section className="recipe-detail-video" aria-label="Yapılış videosu">
      <h2 className="recipe-detail-video-title">Yapılış videosu</h2>
      <DirectVideoPlayer src={parsed.src} posterUrl={posterUrl} title={label} />
    </section>
  );
}

export default RecipeDetailVideo;

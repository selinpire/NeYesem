import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

function StarRatingDisplay({ averageRating, ratingsCount, compact = false }) {
  const count = Number(ratingsCount) || 0;
  const hasData =
    averageRating != null && !Number.isNaN(Number(averageRating)) && count > 0;

  if (!hasData) {
    return compact ? (
      <span className="star-rating-none star-rating-none--compact">Henüz puan yok</span>
    ) : (
      <p className="star-rating-none">Henüz değerlendirme yok.</p>
    );
  }

  const avg = Number(averageRating);
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (avg >= i) {
      stars.push(<FaStar key={i} className="star-icon star-icon--full" aria-hidden />);
    } else if (avg >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="star-icon star-icon--half" aria-hidden />);
    } else {
      stars.push(<FaRegStar key={i} className="star-icon star-icon--empty" aria-hidden />);
    }
  }

  return (
    <div
      className={`star-rating-display${compact ? " star-rating-display--compact" : ""}`}
      aria-label={`Ortalama ${avg} üzerinden 5, ${count} değerlendirme`}
    >
      <span className="star-rating-stars">{stars}</span>
      <span className="star-rating-text">
        <strong>{avg}</strong> / 5
        {!compact && (
          <span className="star-rating-count"> · {count} değerlendirme</span>
        )}
        {compact && <span className="star-rating-count"> ({count})</span>}
      </span>
    </div>
  );
}

export default StarRatingDisplay;

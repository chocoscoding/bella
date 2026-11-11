import { restaurant } from "@/lib/restaurant";

export function GoogleRating() {
  const { score, count, url } = restaurant.googleRating;
  return (
    <div className="google-rating-wrap">
      <a className="google-rating pill" href={url} target="_blank" rel="noopener noreferrer"
        aria-label={`Rated ${score} out of 5 from ${count} Google reviews. Read reviews on Google Maps (opens in a new tab)`}
        title="Google rating checked October 21, 2026">
        <span className="google-rating-source">Google</span>
        <span className="google-rating-score">{score.toFixed(1)}<small>/ 5</small></span>
        <span className="google-rating-stars" aria-hidden="true">
          <span>★★★★★</span><span style={{ width: `${score / 5 * 100}%` }}>★★★★★</span>
        </span>
        <span className="google-rating-count">{count.toLocaleString("en-US")} reviews</span>
        <span className="google-rating-cta" aria-hidden="true">Read reviews ↗</span>
      </a>
    </div>
  );
}

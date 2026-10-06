function Rating({ rating, onRatingChange }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="rating">
      <p className="rating-label">Rate:</p>

      <div className="stars">
        {stars.map((star) => {
          const fillAmount = Math.max(
            0,
            Math.min(1, rating - (star - 1))
          );

          return (
            <div className="star-wrapper" key={star}>
              <span
                className="star"
                style={{
                  "--fill": `${fillAmount * 100}%`,
                }}
              >
                ★
              </span>

              <div
                className="star-half left"
                onClick={() => onRatingChange(star - 0.5)}
                title={`${star - 0.5} stars`}
              />

              <div
                className="star-half right"
                onClick={() => onRatingChange(star)}
                title={`${star} stars`}
              />
            </div>
          );
        })}
      </div>

      {rating > 0 && (
  <>
    <p className="rating-number">
      {rating} / 5
    </p>

    <button
      className="clear-rating"
      onClick={() => onRatingChange(0)}
    >
      Clear rating
    </button>
  </>
)}
    </div>
  );
}

export default Rating;
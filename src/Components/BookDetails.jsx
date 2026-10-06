import Rating from "./Rating";
import Review from "./Review";

function BookDetails({
  book,
  onClose,
  onRatingChange,
  onReviewSave,
  onReviewDelete,
}) {
  return (
    <div className="book-details-overlay">
      <div className="book-details">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="book-details-content">
          <div className="book-cover-container">
            {book.cover ? (
              <img
                src={book.cover}
                alt={`Cover of ${book.title}`}
                className="book-cover"
              />
            ) : (
              <div className="book-cover-placeholder">
                📖
              </div>
            )}
          </div>

          <div className="book-information">
            <h2>{book.title}</h2>

            <p className="author">
              by {book.author}
            </p>

            <p className="description">
              {book.description ||
                "A little description will live here soon."}
            </p>

            <Rating
              rating={book.rating || 0}
              onRatingChange={onRatingChange}
            />

            <Review
              key={book.id}
              review={book.review}
              onSave={onReviewSave}
              onDelete={onReviewDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
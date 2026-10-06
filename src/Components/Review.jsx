import { useState } from "react";

function Review({ review, onSave, onDelete }) {
  const [text, setText] = useState(review || "");
  const [isEditing, setIsEditing] = useState(!review);

  function handleSave() {
    onSave(text);
    setIsEditing(false);
  }

  function handleDelete() {
    setText("");
    onDelete();
    setIsEditing(true);
  }

  return (
    <div className="review-section">
      <h3>My little review</h3>

      {isEditing ? (
        <>
          <textarea
            className="review-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="What did this book make you feel?"
          />

          <div className="review-actions">
            <button className="save-review" onClick={handleSave}>
              💾 Save Review
            </button>

            {review && (
              <button className="cancel-review" onClick={() => {
                setText(review);
                setIsEditing(false);
              }}>
                Cancel
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="review-note">
            <span className="pin">📌</span>
            <p>{review}</p>
          </div>

          <div className="review-actions">
            <button
              className="edit-review"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit
            </button>

            <button
              className="delete-review"
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Review;
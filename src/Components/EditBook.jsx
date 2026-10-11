import { useState } from "react";

function EditBook({ book, onSave, onCancel }) {
  const [title, setTitle] = useState(book.title || "");
  const [author, setAuthor] = useState(book.author || "");
  const [status, setStatus] = useState(book.status || "tbr");
  const [cover, setCover] = useState(book.cover || "");
  const [description, setDescription] = useState(book.description || "");
  const [startDate, setStartDate] = useState(book.startDate || "");
  const [endDate, setEndDate] = useState(book.endDate || "");

  function handleSubmit(event) {
    event.preventDefault();

    onSave({
      ...book,
      title: title.trim(),
      author: author.trim(),
      status,
      cover: cover.trim(),
      description: description.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
    });
  }

  return (
    <div className="edit-book-overlay">
      <div className="edit-book-panel">
        <button
          type="button"
          className="close-button"
          onClick={onCancel}
        >
          ×
        </button>

        <h2>Edit Book ✏️</h2>
        <p>Updating: {book.title}</p>

        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </label>

          <label>
            Author
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              required
            />
          </label>

          <label>
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="tbr">To Read</option>
              <option value="reading">Currently Reading</option>
              <option value="finished">Finished Reading</option>
              <option value="before">Before Books</option>
            </select>
          </label>

          <label>
            Cover URL
            <input
              value={cover}
              onChange={(event) => setCover(event.target.value)}
              placeholder="Paste a book cover image URL"
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <label>
            Start Date
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>

          <label>
            End Date
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>

          <div className="edit-book-actions">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBook;
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

    const updatedBook = {
      ...book,
      title: title.trim(),
      author: author.trim(),
      status,
      cover: cover.trim(),
      description: description.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
    };

    onSave(updatedBook);
  }

  return (
    <div className="edit-book">
      <h2>Edit Book ✏️</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>

          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label>Author</label>

          <input
            type="text"
            value={author}
            onChange={(event) =>
              setAuthor(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label>Status</label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="tbr">To Read</option>
            <option value="reading">
              Currently Reading
            </option>
            <option value="finished">
              Finished Reading
            </option>
            <option value="before">
              Before Books
            </option>
          </select>
        </div>

        <div>
          <label>Cover URL</label>

          <input
            type="text"
            value={cover}
            onChange={(event) =>
              setCover(event.target.value)
            }
            placeholder="Paste a book cover image URL"
          />
        </div>

        <div>
          <label>Description</label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="A little description..."
          />
        </div>

        <div>
          <label>Start Date</label>

          <input
            type="date"
            value={startDate}
            onChange={(event) =>
              setStartDate(event.target.value)
            }
          />
        </div>

        <div>
          <label>End Date</label>

          <input
            type="date"
            value={endDate}
            onChange={(event) =>
              setEndDate(event.target.value)
            }
          />
        </div>

        <div>
          <button type="submit">
            Save Changes
          </button>

          <button
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditBook;


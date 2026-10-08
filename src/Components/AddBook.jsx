import { useState } from "react";

function AddBook({ onAddBook }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("tbr");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const newBook = {
      id: Date.now(),
      title: title.trim(),
      author: author.trim(),
      status: status,
      cover: cover.trim(),
      description: description.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
      rating: null,
      review: "",
      color: "#9C8AC4",
      order: 0,
    };

    onAddBook(newBook);
  }

  return (
    <div className="add-book">
      <h2>Add a Book</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>

          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Enter the book title"
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
            placeholder="Enter the author"
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

        <button type="submit">
          Add Book
        </button>
      </form>
    </div>
  );
}

export default AddBook;
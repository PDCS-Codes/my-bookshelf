import { useEffect, useState } from "react";
import "./App.css";
import ReadingRoom from "./Components/ReadingRoom/ReadingRoom";
import books from "./data/books";
import Book from "./Components/Book";
import BookDetails from "./Components/BookDetails";

const STORAGE_KEY = "my-bookshelf-books";

function App() {
  const [bookList, setBookList] = useState(() => {
    const savedBooks = localStorage.getItem(STORAGE_KEY);

    if (savedBooks) {
      return JSON.parse(savedBooks);
    }

    return [...books].sort((a, b) => a.order - b.order);
  });

  const [draggedBookId, setDraggedBookId] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookList));
  }, [bookList]);

  // -------------------------
  // BOOK GROUPS
  // -------------------------

  const beforeBooks = bookList.filter((book) => book.status === "before");

  const booksToRead = bookList.filter((book) => book.status === "tbr");

  const finishedBooks = bookList.filter((book) => book.status === "finished");

  const currentlyReading = bookList.filter((book) => book.status === "reading");

  const totalBooksRead = beforeBooks.length + finishedBooks.length;

  // -------------------------
  // DATE
  // -------------------------

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // -------------------------
  // DRAG & DROP
  // -------------------------

  function handleDragStart(bookId) {
    setDraggedBookId(bookId);
  }

  function handleDrop(targetBookId) {
    if (draggedBookId === null || draggedBookId === targetBookId) {
      return;
    }

    const currentBooks = [...bookList];

    const draggedIndex = currentBooks.findIndex(
      (book) => book.id === draggedBookId,
    );

    const targetIndex = currentBooks.findIndex(
      (book) => book.id === targetBookId,
    );

    const [draggedBook] = currentBooks.splice(draggedIndex, 1);

    currentBooks.splice(targetIndex, 0, draggedBook);

    const reorderedBooks = currentBooks.map((book, index) => ({
      ...book,
      order: index,
    }));

    setBookList(reorderedBooks);
    setDraggedBookId(null);
  }

  // -------------------------
  // RATING
  // -------------------------

  function handleRatingChange(newRating) {
    setBookList((currentBooks) =>
      currentBooks.map((book) =>
        book.id === selectedBook.id ? { ...book, rating: newRating } : book,
      ),
    );

    setSelectedBook((currentBook) => ({
      ...currentBook,
      rating: newRating,
    }));
  }

  // -------------------------
  // REVIEW
  // -------------------------

  function handleReviewSave(newReview) {
    setBookList((currentBooks) =>
      currentBooks.map((book) =>
        book.id === selectedBook.id ? { ...book, review: newReview } : book,
      ),
    );

    setSelectedBook((currentBook) => ({
      ...currentBook,
      review: newReview,
    }));
  }

  function handleReviewDelete() {
    setBookList((currentBooks) =>
      currentBooks.map((book) =>
        book.id === selectedBook.id ? { ...book, review: "" } : book,
      ),
    );

    setSelectedBook((currentBook) => ({
      ...currentBook,
      review: "",
    }));
  }

  // -------------------------
  // SHELF
  // -------------------------

  function renderShelf(bookGroup) {
    if (bookGroup.length === 0) {
      return (
        <div className="empty-shelf">
          <p>No books here yet 📖</p>
        </div>
      );
    }

    return (
      <div className="shelf">
        {bookGroup.map((book) => (
          <Book
            key={book.id}
            title={book.title}
            color={book.color}
            onDragStart={() => handleDragStart(book.id)}
            onDrop={() => handleDrop(book.id)}
            onClick={() => setSelectedBook(book)}
          />
        ))}
      </div>
    );
  }

  // -------------------------
  // HOME
  // -------------------------

  function renderHome() {
    return (
      <main className="home-page">
        <section
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1200px",
            height: "600px",
            margin: "0 auto",
            overflow: "hidden",
            borderRadius: "28px",
          }}
        >
          <img
            src="/reading-room.jpg"
            alt="Reading room"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "45px",
              left: "50%",
              transform: "translateX(-50%)",

              width: "min(500px, 80%)",

              padding: "22px 30px",

              textAlign: "center",

              background: "rgba(255, 248, 232, 0.72)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",

              border: "1px solid rgba(255, 255, 255, 0.45)",
              borderRadius: "22px",

              boxShadow: "0 10px 30px rgba(50, 35, 20, 0.2)",

              color: "#49352a",
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                fontSize: "1rem",
                fontStyle: "italic",
              }}
            >
              {formattedDate}
            </p>

            <h1
              style={{
                margin: "5px 0",
                fontSize: "3rem",
              }}
            >
              Hello Chanara!
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: "1.05rem",
              }}
            >
              Welcome back to your little reading world.
            </p>
          </div>
        </section>

        <section className="reading-summary">
          <div className="lifetime-count">
            <span className="count-icon">📚</span>

            <div>
              <strong>{totalBooksRead}</strong>
              <p>books read</p>
            </div>
          </div>

          <div className="summary-card">
            <span>📖</span>
            <strong>{beforeBooks.length}</strong>
            <p>Before Books</p>
          </div>

          <div className="summary-card">
            <span>📚</span>
            <strong>{booksToRead.length}</strong>
            <p>To Read</p>
          </div>

          <div className="summary-card">
            <span>🌷</span>
            <strong>{finishedBooks.length}</strong>
            <p>Finished</p>
          </div>
        </section>

        {currentlyReading.length > 0 && (
          <section className="currently-reading">
            <h2>Currently Reading 📖</h2>

            {currentlyReading.map((book) => (
              <button
                key={book.id}
                className="current-book-card"
                onClick={() => setSelectedBook(book)}
              >
                {book.cover ? (
                  <img src={book.cover} alt={`Cover of ${book.title}`} />
                ) : (
                  <div className="current-book-placeholder">📖</div>
                )}

                <div>
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                </div>
              </button>
            ))}
          </section>
        )}
      </main>
    );
  }

  // -------------------------
  // LIBRARY
  // -------------------------

  function renderLibrary() {
    return (
      <main className="library-page">
        <h1>My Library 📚</h1>

        <section className="library-section">
          <h2>
            📖 Before Books
            <span className="book-count">{beforeBooks.length}</span>
          </h2>

          {renderShelf(beforeBooks)}
        </section>

        <section className="library-section">
          <h2>
            📚 Books To Read
            <span className="book-count">{booksToRead.length}</span>
          </h2>

          {renderShelf(booksToRead)}
        </section>

        <section className="library-section">
          <h2>
            🌷 Finished Reading
            <span className="book-count">{finishedBooks.length}</span>
          </h2>

          {renderShelf(finishedBooks)}
        </section>
      </main>
    );
  }

  // -------------------------
  // OTHER PAGES
  // -------------------------

  function renderStats() {
    return (
      <main className="placeholder-page">
        <h1>Reading Stats 📊</h1>
        <p>Your reading trends will live here.</p>
      </main>
    );
  }

  function renderCalendar() {
    return (
      <main className="placeholder-page">
        <h1>Reading Calendar 📅</h1>
        <p>Your reading history will live here.</p>
      </main>
    );
  }

  return (
    <div className="app">
      {activeTab === "home" && renderHome()}

      {activeTab === "library" && renderLibrary()}

      {activeTab === "stats" && renderStats()}

      {activeTab === "calendar" && renderCalendar()}

      {selectedBook && (
        <BookDetails
          key={selectedBook.id}
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onRatingChange={handleRatingChange}
          onReviewSave={handleReviewSave}
          onReviewDelete={handleReviewDelete}
        />
      )}

      <nav className="bottom-navigation">
        <button
          className={activeTab === "home" ? "nav-button active" : "nav-button"}
          onClick={() => setActiveTab("home")}
        >
          <span>🏠</span>
          Home
        </button>

        <button
          className={
            activeTab === "library" ? "nav-button active" : "nav-button"
          }
          onClick={() => setActiveTab("library")}
        >
          <span>📚</span>
          Library
        </button>

        <button
          className={activeTab === "stats" ? "nav-button active" : "nav-button"}
          onClick={() => setActiveTab("stats")}
        >
          <span>📊</span>
          Stats
        </button>

        <button
          className={
            activeTab === "calendar" ? "nav-button active" : "nav-button"
          }
          onClick={() => setActiveTab("calendar")}
        >
          <span>📅</span>
          Calendar
        </button>
      </nav>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import "./App.css";

import books from "./data/books";
import Book from "./Components/Book";
import BookDetails from "./Components/BookDetails";
import AddBook from "./Components/AddBook";
import EditBook from "./Components/EditBook";
import ReadingCalendar from "./Components/ReadingCalendar";

const STORAGE_KEY = "my-bookshelf-books";

const BOOK_COLORS = [
  "#D98F8F", // Dusty rose
  "#7C9AC7", // Powder blue
  "#8EAD88", // Sage green
  "#7FA7A0", // Soft teal
  "#D9A85C", // Butter gold
  "#A98BC4", // Lavender
  "#D47F5C", // Terracotta
  "#E5B5C8", // Blush pink
  "#8C7CB8", // Periwinkle
  "#E6CFA3", // Warm cream
  "#7395A5", // Muted blue
  "#B5A16F", // Olive gold
];

function App() {
  const [bookList, setBookList] = useState(() => {
    const savedBooks = localStorage.getItem(STORAGE_KEY);

    const existingBooks = savedBooks
      ? JSON.parse(savedBooks)
      : [...books].sort((a, b) => a.order - b.order);

    const usedColors = [];

    return existingBooks.map((book, index) => {
      // Keep the existing colour if it hasn't already been used.
      if (book.color && !usedColors.includes(book.color)) {
        usedColors.push(book.color);
        return book;
      }

      // Otherwise, assign an unused colour from our palette.
      const availableColors = BOOK_COLORS.filter(
        (color) => !usedColors.includes(color),
      );

      const colorPool =
        availableColors.length > 0 ? availableColors : BOOK_COLORS;

      const color = colorPool[index % colorPool.length];

      usedColors.push(color);

      return { ...book, color };
    });
  });

  const [draggedBookId, setDraggedBookId] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [showAddBook, setShowAddBook] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);


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

  const filteredBooks = bookList.filter((book) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [book.title, book.author, book.description, book.review].some(
      (value) => (value || "").toLowerCase().includes(query),
    );
  });

  const visibleBeforeBooks = filteredBooks.filter(
    (book) => book.status === "before",
  );

  const visibleBooksToRead = filteredBooks.filter(
    (book) => book.status === "tbr",
  );

  const visibleFinishedBooks = filteredBooks.filter(
    (book) => book.status === "finished",
  );

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
  // ADD BOOK
  // -------------------------

  function handleAddBook(newBook) {
    setBookList((currentBooks) => {
      const usedColors = currentBooks.map((book) => book.color);

      const availableColors = BOOK_COLORS.filter(
        (color) => !usedColors.includes(color),
      );

      const colorPool =
        availableColors.length > 0 ? availableColors : BOOK_COLORS;

      const color = colorPool[Math.floor(Math.random() * colorPool.length)];

      return [
        ...currentBooks,
        {
          ...newBook,
          color,
          order: currentBooks.length,
        },
      ];
    });

    setShowAddBook(false);
  }

  // -------------------------
  // EDIT BOOK
  // -------------------------

  function handleEditBook(book) {
    setEditingBook(book);
    setSelectedBook(null);
  }

  function handleSaveEdit(updatedBook) {
    setBookList((currentBooks) =>
      currentBooks.map((book) =>
        book.id === updatedBook.id ? updatedBook : book,
      ),
    );

    // Close both windows after saving
    setEditingBook(null);
    setSelectedBook(null);
  }

  // -------------------------
  // DELETE BOOK
  // -------------------------

  function handleDeleteBook(bookToDelete) {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${bookToDelete.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    setBookList((currentBooks) =>
      currentBooks.filter((book) => book.id !== bookToDelete.id),
    );

    setSelectedBook(null);
  }

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
              Hello Chanara! 🌷
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

        
<section className="summary-grid">
  <div className="summary-card">
    <img
      src="/icons/library.png"
      alt=""
      className="section-icon"
    />
    <strong>{totalBooksRead}</strong>
    <p>Books in My Journey</p>
  </div>

  <div className="summary-card">
    <img
      src="/icons/currently-reading.png"
      alt=""
      className="section-icon"
    />
    <strong>{currentlyReading.length}</strong>
    <p>Currently Reading</p>
  </div>

  <div className="summary-card">
    📖
    <strong>{booksToRead.length}</strong>
    <p>Books To Read</p>
  </div>

  <div className="summary-card">
    <img
      src="/icons/finished-reading.png"
      alt=""
      className="section-icon"
    />
    <strong>{finishedBooks.length}</strong>
    <p>Finished</p>
  </div>
</section>


        {currentlyReading.length > 0 && (
          <section className="currently-reading">
            <h2 className="library-section-heading">
              <img
                src="/icons/currently-reading.png"
                alt=""
                className="section-icon"
              />
              Currently Reading
            </h2>

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
        <h1 className="library-page-heading">
          <img src="/icons/library.png" alt="" className="page-heading-icon" />
          My Library
        </h1>

        <div className="library-search">
          <img src="/icons/search.png" alt="" className="search-icon" />

          <input
            type="search"
            placeholder="Search titles, authors, descriptions, reviews..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <section className="library-section">
          <button
            className="add-book-button"
            onClick={() => setShowAddBook(true)}
          >
            <img src="/icons/add.png" alt="" className="add-book-icon" />
            Add Book
          </button>

          {showAddBook && (
            <AddBook
              onAddBook={handleAddBook}
              onCancel={() => setShowAddBook(false)}
            />
          )}

          <h2>
            📖 Before Books
            <span className="book-count">{beforeBooks.length}</span>
          </h2>

          {renderShelf(visibleBeforeBooks)}
        </section>

        <section className="library-section">
          <h2>
            📚 Books To Read
            <span className="book-count">{booksToRead.length}</span>
          </h2>

          {renderShelf(visibleBooksToRead)}
        </section>

        <section className="library-section">
          <h2 className="library-section-heading">
            <img
              src="/icons/finished-reading.png"
              alt=""
              className="section-icon"
            />
            Finished Reading
            <span className="book-count">{finishedBooks.length}</span>
          </h2>

          {renderShelf(visibleFinishedBooks)}
        </section>
      </main>
    );
  }

  // -------------------------
  // STATS
  // -------------------------

  function renderStats() {
    const totalBooksRead = beforeBooks.length + finishedBooks.length;

    const currentYear = new Date().getFullYear();

    const monthlyReading = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;

      const count = finishedBooks.filter((book) => {
        if (!book.endDate) return false;

        const [bookYear, bookMonth] = book.endDate.split("-").map(Number);

        return bookYear === currentYear && bookMonth === month;
      }).length;

      return {
        month: new Date(currentYear, index, 1).toLocaleDateString("en-US", {
          month: "short",
        }),
        count,
      };
    });

    const maxMonthlyBooks = Math.max(
      1,
      ...monthlyReading.map((item) => item.count),
    );

    const averageRatingBooks = bookList.filter(
      (book) =>
        (book.status === "before" || book.status === "finished") &&
        typeof book.rating === "number" &&
        book.rating > 0,
    );

    const averageRating =
      averageRatingBooks.length > 0
        ? (
            averageRatingBooks.reduce((total, book) => total + book.rating, 0) /
            averageRatingBooks.length
          ).toFixed(1)
        : "—";

    return (
      <main className="stats-page">
        <header className="stats-heading">
          <h1>My Reading Stats 📊</h1>
          <p>A little look at your reading journey. 🌷</p>
        </header>

        <section className="stats-grid">
          <article className="stat-card">
            <span className="stat-icon">📚</span>
            <p className="stat-label">Lifetime Books</p>
            <h2>{totalBooksRead}</h2>
            <span className="stat-note">Your reading collection</span>
          </article>

          <article className="stat-card">
            <span className="stat-icon">🌸</span>
            <p className="stat-label">Finished Reading</p>
            <h2>{finishedBooks.length}</h2>
            <span className="stat-note">Books completed</span>
          </article>

          <article className="stat-card">
            <span className="stat-icon">🌱</span>
            <p className="stat-label">Currently Reading</p>
            <h2>{currentlyReading.length}</h2>
            <span className="stat-note">Stories in progress</span>
          </article>

          <article className="stat-card">
            <span className="stat-icon">☕</span>
            <p className="stat-label">Want to Read</p>
            <h2>{booksToRead.length}</h2>
            <span className="stat-note">Stories waiting for you</span>
          </article>

          <article className="stat-card">
            <span className="stat-icon">⭐</span>
            <p className="stat-label">Average Rating</p>
            <h2>
              {averageRating}
              {averageRating !== "—" ? " / 5" : ""}
            </h2>
            <span className="stat-note">
              Across {averageRatingBooks.length} rated books
            </span>
          </article>
        </section>

        <section className="monthly-chart-card">
          <div className="chart-heading">
            <div>
              <h2>My Reading Year 🌷</h2>
              <p>Books finished each month in {currentYear}</p>
            </div>
            <span className="chart-total">
              {monthlyReading.reduce((sum, item) => sum + item.count, 0)} books
            </span>
          </div>

          <div className="bar-chart">
            {monthlyReading.map((item) => (
              <div className="bar-chart-column" key={item.month}>
                <span className="bar-chart-value">{item.count || ""}</span>

                <div className="bar-chart-track">
                  <div
                    className="bar-chart-bar"
                    style={{
                      height: `${(item.count / maxMonthlyBooks) * 100}%`,
                    }}
                    title={`${item.count} books finished in ${item.month}`}
                  />
                </div>

                <span className="bar-chart-month">{item.month}</span>
              </div>
            ))}
          </div>

          <p className="chart-footnote">
            Your completed books, month by month. Every story counts. 📚
          </p>
        </section>
      </main>
    );
  }

  // -------------------------
  // CALENDAR
  // -------------------------

  function renderCalendar() {
    return <ReadingCalendar books={bookList} />;
  }

  // -------------------------
  // APP
  // -------------------------

  return (
    <div className={`app ${isDarkMode ? "dark-mode" : ""}`}>
      
<button
  type="button"
  className="theme-toggle"
  onClick={() => setIsDarkMode((currentMode) => !currentMode)}
  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
>
  {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
</button>

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
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
        />
      )}

      {editingBook && (
        <EditBook
          key={editingBook.id}
          book={editingBook}
          onSave={handleSaveEdit}
          onCancel={() => setEditingBook(null)}
        />
      )}

      <nav className="bottom-navigation">
        <button
          className={activeTab === "home" ? "nav-button active" : "nav-button"}
          onClick={() => setActiveTab("home")}
        >
          <img src="/icons/home.png" alt="" className="nav-icon" />
          Home
        </button>

        <button
          className={
            activeTab === "library" ? "nav-button active" : "nav-button"
          }
          onClick={() => setActiveTab("library")}
        >
          <img src="/icons/library.png" alt="" className="nav-icon" />
          Library
        </button>

        <button
          className={activeTab === "stats" ? "nav-button active" : "nav-button"}
          onClick={() => setActiveTab("stats")}
        >
          <img src="/icons/stats.png" alt="" className="nav-icon" />
          Stats
        </button>

        <button
          className={
            activeTab === "calendar" ? "nav-button active" : "nav-button"
          }
          onClick={() => setActiveTab("calendar")}
        >
          <img src="/icons/calendar.png" alt="" className="nav-icon" />
          Calendar
        </button>
      </nav>
    </div>
  );
}

export default App;

import { useState } from "react";
import "./App.css";
import books from "./data/books";
import Book from "./Components/Book";
import BookDetails from "./Components/BookDetails";

function App() {
  const [bookList, setBookList] = useState(
    [...books].sort((a, b) => a.order - b.order)
  );

  const [draggedBookId, setDraggedBookId] = useState(null);

  const [selectedBook, setSelectedBook] = useState(null);

  function handleDragStart(bookId) {
    setDraggedBookId(bookId);
  }

  function handleDrop(targetBookId) {
    if (
      draggedBookId === null ||
      draggedBookId === targetBookId
    ) {
      return;
    }

    const currentBooks = [...bookList];

    const draggedIndex = currentBooks.findIndex(
      (book) => book.id === draggedBookId
    );

    const targetIndex = currentBooks.findIndex(
      (book) => book.id === targetBookId
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

  function handleRatingChange(newRating) {
    setBookList((currentBooks) =>
      currentBooks.map((book) =>
        book.id === selectedBook.id
          ? { ...book, rating: newRating }
          : book
      )
    );

    setSelectedBook((currentBook) => ({
      ...currentBook,
      rating: newRating,
    }));
  }

  return (
    <div className="app">
      <h1>My Bookshelf</h1>

      <p>A little place for all the books I've read.</p>

      <h2>The Books That Came Before</h2>

      <div className="shelf">
        {bookList.map((book) => (
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

      {selectedBook && (
        <BookDetails
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onRatingChange={handleRatingChange}
        />
      )}
    </div>
  );
}

export default App;
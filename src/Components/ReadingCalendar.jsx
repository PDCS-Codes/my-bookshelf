
import { useState } from "react";

function ReadingCalendar({ books }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function goToPreviousMonth() {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
  }

  function goToNextMonth() {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
  }

  function getBooksForDate(day) {
    const date = [
      year,
      String(month + 1).padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-");

    return books
      .filter(
        (book) => book.startDate === date || book.endDate === date
      )
      .map((book) => ({
        ...book,
        eventType:
          book.startDate === date ? "started" : "finished",
      }));
  }

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  return (
    <main className="calendar-page">
      <h1>My Reading Calendar 📅</h1>

      <section className="reading-calendar">
        <header className="calendar-header">
          <button
            type="button"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            ←
          </button>

          <h2>{monthName}</h2>

          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            →
          </button>
        </header>

        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day) => (
              <div className="calendar-weekday" key={day}>
                {day}
              </div>
            )
          )}

          {Array.from({ length: firstDay }, (_, index) => (
            <div
              className="calendar-day empty"
              key={`empty-${index}`}
            />
          ))}

          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const dateKey = [
              year,
              String(month + 1).padStart(2, "0"),
              String(day).padStart(2, "0"),
            ].join("-");

            const isToday =
              isCurrentMonth && today.getDate() === day;

            return (
              <div
                className={`calendar-day${isToday ? " today" : ""}${
                  selectedDate === dateKey ? " selected" : ""
                }`}
                key={day}
                onClick={() => setSelectedDate(dateKey)}
              >
                <span>{day}</span>

                <div className="calendar-events">
                  {getBooksForDate(day).map((book) => (
                    <div
                      className={`calendar-event ${book.eventType}`}
                      key={`${book.id}-${book.eventType}`}
                      title={`${book.title} — ${
                        book.eventType === "started"
                          ? "Started reading"
                          : "Finished reading"
                      }`}
                    >
                      {book.eventType === "started" ? "📖" : "🌸"}
                      <span>{book.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedDate && (
          <div className="selected-date-details">
            <h3>
              {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </h3>

            {books.filter(
              (book) =>
                book.startDate === selectedDate ||
                book.endDate === selectedDate
            ).length === 0 ? (
              <p>No reading activity recorded for this day. 🌿</p>
            ) : (
              books
                .filter(
                  (book) =>
                    book.startDate === selectedDate ||
                    book.endDate === selectedDate
                )
                .map((book) => (
                  <div className="selected-date-book" key={book.id}>
                    {book.startDate === selectedDate && (
                      <p>📖 Started reading: {book.title}</p>
                    )}

                    {book.endDate === selectedDate && (
                      <p>🌸 Finished reading: {book.title}</p>
                    )}
                  </div>
                ))
            )}
          </div>
        )}

      </section>
    </main>
  );
}

export default ReadingCalendar;

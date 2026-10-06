function Book({ title, color, onDragStart, onDrop, onClick }) {
  return (
    <div
      className="book"
      style={{ backgroundColor: color }}
      draggable
      onDragStart={onDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      onClick={onClick}
      title={title}
    >
      <span>{title}</span>
    </div>
  );
}

export default Book;
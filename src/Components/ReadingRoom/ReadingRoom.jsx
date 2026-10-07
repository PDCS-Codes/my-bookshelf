function ReadingRoom({ date }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "600px",
        overflow: "hidden",
        backgroundImage: "url('/reading-room.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          paddingTop: "55px",

          textAlign: "center",

          color: "white",

          textShadow: "0 2px 8px rgba(0, 0, 0, 0.7)",
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            fontSize: "1.05rem",
            fontStyle: "italic",
          }}
        >
          {date}
        </p>

        <h1
          style={{
            margin: "8px 0",
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
          }}
        >
          Hello Chanara! 🌷
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            fontSize: "1.15rem",
          }}
        >
          Welcome back to your little reading world.
        </p>
      </div>
    </div>
  );
}

export default ReadingRoom;
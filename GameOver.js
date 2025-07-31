import "../style.css";

const GameOver = ({ status }) => {
  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="intro-container">
      <div className="intro-content">
        <h1 className="tagline">
          {status === "won" ? "🎉 You Survived!" : "💀 You Died!"}
        </h1>

        <p className="result-text">
          {status === "won"
            ? "Congratulations! You made it to the end safely."
            : "You were eliminated. Better luck next time."}
        </p>

        <button className="start-button" onClick={handleRestart}>
          🔁 Restart Game
        </button>
      </div>
    </div>
  );
};

export default GameOver;

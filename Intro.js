import "../style.css";

const Intro = ({ onStart }) => {
  const playSound = () => {
    const introSound = new Audio("/sounds/squidgame.mp3");
    introSound.play();
  };

  return (
    <div className="intro-container">
      <div className="intro-content">
        <h1 className="tagline">🦑 Red Light, Green Light Begins</h1>
        <button
          className="start-button"
          onClick={() => {
            playSound();
            onStart();
          }}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Intro;

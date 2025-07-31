import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import Intro from "./components/Intro";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
import "./style.css";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showGame, setShowGame] = useState(false);
  const [gameResult, setGameResult] = useState(null); // "won" or "died"

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleGameOver = (status) => {
    setGameResult(status);
    setShowGame(false);
  };

  const handleRestart = () => {
    setGameResult(null);
    setShowGame(true);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : gameResult ? (
        <GameOver status={gameResult} onRestart={handleRestart} />
      ) : showGame ? (
        <Game onGameOver={handleGameOver} />
      ) : (
        <Intro onStart={() => setShowGame(true)} />
      )}
    </>
  );
};

export default App;

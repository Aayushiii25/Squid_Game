import { useEffect, useState } from "react";
import "../style.css";

const Timer = ({ onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(5 * 60); // 5 min

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp(); // ⏱️ Call parent to trigger GameOver
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="timer-display">
      {minutes}:{seconds}
    </div>
  );
};

export default Timer;

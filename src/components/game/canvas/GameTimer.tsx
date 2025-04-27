
import { useState, useEffect, useRef } from "react";
import { Timer } from "lucide-react";

interface GameTimerProps {
  matchDuration?: number;
}

export const GameTimer = ({ matchDuration = 15 }: GameTimerProps) => {
  const [remainingTime, setRemainingTime] = useState<number>(matchDuration * 60);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (matchDuration) {
      setRemainingTime(matchDuration * 60);
      timerInterval.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev > 0) return prev - 1;
          if (timerInterval.current) clearInterval(timerInterval.current);
          return 0;
        });
      }, 1000);
    }

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [matchDuration]);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-background/80 rounded px-4 py-2 shadow font-bold text-lg">
      <Timer className="h-5 w-5 mr-2" />
      <span>
        {Math.floor(remainingTime / 60)
          .toString()
          .padStart(2, '0')}:
        {(remainingTime % 60).toString().padStart(2, '0')}
      </span>
    </div>
  );
};

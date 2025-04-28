
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle } from 'lucide-react';

interface EAFC25MatchTimerProps {
  startTime: Date | null;
  durationMinutes: number;
  onTimeEnd: () => void;
}

export function EAFC25MatchTimer({ 
  startTime, 
  durationMinutes, 
  onTimeEnd 
}: EAFC25MatchTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(durationMinutes * 60);
  const [progress, setProgress] = useState<number>(100);
  const [isAlmostOver, setIsAlmostOver] = useState<boolean>(false);

  useEffect(() => {
    if (!startTime) return;
    
    const totalSeconds = durationMinutes * 60;
    const interval = setInterval(() => {
      const now = new Date();
      const secondsPassed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const remaining = Math.max(0, totalSeconds - secondsPassed);
      
      setTimeRemaining(remaining);
      setProgress((remaining / totalSeconds) * 100);
      
      // Set warning when less than 10% of time remains
      if (remaining < totalSeconds * 0.1) {
        setIsAlmostOver(true);
      }
      
      // End match when timer reaches zero
      if (remaining <= 0) {
        clearInterval(interval);
        onTimeEnd();
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, durationMinutes, onTimeEnd]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`p-4 ${isAlmostOver ? 'border-red-500' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className={`h-5 w-5 ${isAlmostOver ? 'text-red-500' : ''}`} />
          <span className="font-medium">Match Timer</span>
        </div>
        <span className={`font-bold text-lg ${isAlmostOver ? 'text-red-500 animate-pulse' : ''}`}>
          {formatTime(timeRemaining)}
        </span>
      </div>
      
      <Progress value={progress} className={isAlmostOver ? 'bg-red-100' : ''} />
      
      {isAlmostOver && (
        <div className="mt-2 flex items-center gap-2 text-xs text-red-500">
          <AlertTriangle className="h-4 w-4" />
          <span>Match ending soon. Prepare to take screenshots of the final score!</span>
        </div>
      )}
    </Card>
  );
}

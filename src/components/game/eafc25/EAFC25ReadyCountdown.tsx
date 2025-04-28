
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EAFC25ReadyCountdownProps {
  endTime: Date | null;
  isActive: boolean;
  readyPlayersCount: number;
  totalPlayers: number;
}

export function EAFC25ReadyCountdown({ 
  endTime,
  isActive,
  readyPlayersCount,
  totalPlayers
}: EAFC25ReadyCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(300); // 5 minutes in seconds
  const [progress, setProgress] = useState<number>(100);
  const [isAlmostOver, setIsAlmostOver] = useState<boolean>(false);

  useEffect(() => {
    if (!endTime || !isActive) return;
    
    const totalSeconds = 5 * 60; // 5 minutes
    
    const interval = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
      
      setTimeRemaining(remaining);
      setProgress((remaining / totalSeconds) * 100);
      
      // Set warning when less than 20% of time remains
      if (remaining < totalSeconds * 0.2) {
        setIsAlmostOver(true);
      } else {
        setIsAlmostOver(false);
      }
      
      // End countdown when timer reaches zero
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [endTime, isActive]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Don't render if not active and all players aren't ready
  if (!isActive && readyPlayersCount === 0) {
    return null;
  }

  return (
    <Card className={`p-4 mb-4 ${isAlmostOver ? 'border-amber-500' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isActive ? (
            <>
              <Clock className={`h-5 w-5 ${isAlmostOver ? 'text-amber-500' : ''}`} />
              <span className="font-medium">Waiting for all players to get ready</span>
            </>
          ) : (
            <>
              <Users className="h-5 w-5" />
              <span className="font-medium">Ready Status</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={readyPlayersCount === totalPlayers ? "success" : "default"}>
            {readyPlayersCount}/{totalPlayers} Ready
          </Badge>
          {isActive && (
            <span className={`font-bold text-lg ${isAlmostOver ? 'text-amber-500 animate-pulse' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          )}
        </div>
      </div>
      
      {isActive && (
        <>
          <Progress value={progress} className={isAlmostOver ? 'bg-amber-100' : ''} />
          
          {isAlmostOver && (
            <div className="mt-2 flex items-center gap-2 text-xs text-amber-500">
              <AlertTriangle className="h-4 w-4" />
              <span>Get ready soon! Match will be canceled if not all players are ready.</span>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

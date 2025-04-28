
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { arenaRoomService } from '@/services/arena/ArenaRoomWebSocketService';

interface EAFC25ReadyCountdownProps {
  roomId: string;
  readyPlayersCount: number;
  totalPlayers: number;
}

export function EAFC25ReadyCountdown({ 
  roomId,
  readyPlayersCount,
  totalPlayers
}: EAFC25ReadyCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(300); // 5 minutes in seconds
  const [progress, setProgress] = useState<number>(100);
  const [isAlmostOver, setIsAlmostOver] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [endTime, setEndTime] = useState<Date | null>(null);

  // Connect to the service when the component mounts
  useEffect(() => {
    if (!roomId) return;
    
    console.log(`[ReadyCountdown] Connecting to room ${roomId} and setting up timer listeners`);
    
    // Connect to room channel
    arenaRoomService.connectToRoom(roomId);
    
    // Listen for timer updates
    const unsubscribe = arenaRoomService.onTimerChange(roomId, (newEndTime, newIsActive) => {
      console.log(`[ReadyCountdown] Timer change: endTime=${newEndTime}, isActive=${newIsActive}`);
      setEndTime(newEndTime);
      setIsActive(newIsActive);
    });
    
    // Handle ready status changes
    const checkAndUpdateCountdown = () => {
      // Start countdown if at least one player is ready but not all
      if (readyPlayersCount >= 1 && readyPlayersCount < totalPlayers && totalPlayers > 1 && !isActive) {
        console.log('[ReadyCountdown] Starting countdown - at least 1 player ready');
        const newEndTime = new Date();
        newEndTime.setMinutes(newEndTime.getMinutes() + 5); // 5 minute countdown
        
        setEndTime(newEndTime);
        setIsActive(true);
        
        // Broadcast this change to other clients
        arenaRoomService.updateReadyCountdown(roomId, newEndTime, true);
      } 
      // Stop countdown when all players are ready
      else if (readyPlayersCount === totalPlayers && totalPlayers > 1 && isActive) {
        console.log('[ReadyCountdown] All players ready, stopping countdown');
        setIsActive(false);
        
        // Broadcast all players ready and stop countdown
        arenaRoomService.broadcastAllPlayersReady(roomId);
        arenaRoomService.updateReadyCountdown(roomId, null, false);
      }
    };
    
    // Check initial countdown status
    checkAndUpdateCountdown();
    
    // Update countdown when ready player count changes
    const intervalId = setInterval(checkAndUpdateCountdown, 2000);
    
    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [roomId, readyPlayersCount, totalPlayers, isActive]);

  // Timer effect to update countdown
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
        
        // Notify that the countdown has ended
        arenaRoomService.updateReadyCountdown(roomId, null, false);
        setIsActive(false);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [endTime, isActive, roomId]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Don't render if no players are ready
  if (readyPlayersCount === 0 && !isActive) {
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

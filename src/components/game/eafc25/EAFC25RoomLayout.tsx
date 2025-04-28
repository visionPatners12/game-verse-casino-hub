
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GameChat from "@/components/GameChat";
import { RoomData } from "@/components/game/types";
import RoomHeader from "@/components/game/RoomHeader";
import LoadingState from "@/components/game/LoadingState";
import PlayersList from "@/components/game/PlayersList";
import { useFullScreenHandle } from "react-full-screen";
import { useIsMobile } from "@/hooks/use-mobile";
import { EAFC25MatchTimer } from "./EAFC25MatchTimer";
import { EAFC25PlayerInfo } from "./EAFC25PlayerInfo";
import { EAFC25MatchDetails } from "./EAFC25MatchDetails";
import { GameControls } from "./room-layout/GameControls";
import { MatchStatus } from "./room-layout/MatchStatus";
import { MatchInstructions } from "./room-layout/MatchInstructions";
import { useEffect, useState } from "react";

interface EAFC25RoomLayoutProps {
  loading?: boolean;
  roomData: RoomData | null;
  currentUserId: string | null;
  gameName: string;
  isReady: boolean;
  gameStatus: 'waiting' | 'starting' | 'playing' | 'ended';
  onToggleReady: () => void;
  onStartGame: () => void;
  onForfeit: () => void;
  matchEnded: boolean;
  setMatchEnded: (ended: boolean) => void;
  matchStartTime: Date | null;
  matchDuration: number;
  scoreSubmitted: boolean;
  proofSubmitted: boolean;
}

export function EAFC25RoomLayout({
  loading = false,
  roomData,
  currentUserId,
  gameName,
  isReady,
  gameStatus,
  onToggleReady,
  onStartGame,
  onForfeit,
  matchEnded,
  setMatchEnded,
  matchStartTime,
  matchDuration,
  scoreSubmitted,
  proofSubmitted
}: EAFC25RoomLayoutProps) {
  const fullscreenHandle = useFullScreenHandle();
  const isMobile = useIsMobile();
  const [matchPhase, setMatchPhase] = useState<'pre-match' | 'in-progress' | 'score-submission' | 'dispute'>('pre-match');
  
  const allPlayersReady = roomData?.game_players?.every(player => player.is_ready || !player.is_connected);
  const enoughPlayers = roomData?.game_players?.filter(player => player.is_connected).length >= 2;
  const canStartGame = allPlayersReady && enoughPlayers && gameStatus === 'waiting';
  
  const players = roomData?.game_players || [];
  const currentPlayer = players.find(player => player.user_id === currentUserId);
  const opponentPlayer = players.find(player => player.user_id !== currentUserId);

  useEffect(() => {
    if (gameStatus === 'waiting') {
      setMatchPhase('pre-match');
    } else if (gameStatus === 'playing' && !matchEnded) {
      setMatchPhase('in-progress');
    } else if (matchEnded) {
      setMatchPhase('score-submission');
    }
  }, [gameStatus, matchEnded]);

  // Handlers that need to return Promises to match the expected types
  const handleScoreSubmit = async (myScore: number, opponentScore: number): Promise<boolean> => {
    try {
      // Forward the call to any actual submission logic you have
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error in score submission:", error);
      return Promise.resolve(false);
    }
  };

  const handleProofSubmit = async (file: File): Promise<boolean> => {
    try {
      // Forward the call to any actual submission logic you have
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error in proof submission:", error);
      return Promise.resolve(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col gap-4 sm:gap-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 sm:gap-8">
          <div className="w-full lg:w-2/3">
            <Card className="overflow-hidden">
              <CardHeader className="pb-3 px-3 sm:px-6">
                {roomData && (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>
                      <RoomHeader 
                        gameName={gameName} 
                        roomId={roomData.room_id}
                        fullscreenHandle={fullscreenHandle}
                      />
                    </CardTitle>
                    
                    <GameControls 
                      gameStatus={gameStatus}
                      isReady={isReady}
                      canStartGame={canStartGame}
                      onToggleReady={onToggleReady}
                      onStartGame={onStartGame}
                      onForfeit={onForfeit}
                    />
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="p-3 sm:p-6">
                {roomData && (
                  <div className="space-y-6">
                    {gameStatus === 'playing' && (
                      <EAFC25MatchTimer 
                        startTime={matchStartTime}
                        durationMinutes={matchDuration}
                        onTimeEnd={() => setMatchEnded(true)}
                      />
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentPlayer && (
                        <EAFC25PlayerInfo 
                          player={currentPlayer}
                          isCurrentUser={true}
                          platform={roomData?.platform || "ps5"}
                        />
                      )}
                      
                      {opponentPlayer && (
                        <EAFC25PlayerInfo 
                          player={opponentPlayer}
                          isCurrentUser={false}
                          platform={roomData?.platform || "ps5"}
                        />
                      )}
                    </div>
                    
                    <EAFC25MatchDetails roomData={roomData} />
                    
                    <PlayersList 
                      players={players}
                      maxPlayers={roomData.max_players}
                      currentUserId={currentUserId}
                    />
                    
                    <MatchStatus 
                      matchEnded={matchEnded}
                      scoreSubmitted={scoreSubmitted}
                      proofSubmitted={proofSubmitted}
                      onScoreSubmit={handleScoreSubmit}
                      onProofSubmit={handleProofSubmit}
                    />
                    
                    {gameStatus === 'waiting' && <MatchInstructions />}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full lg:w-1/3 lg:sticky lg:top-4">
            <GameChat />
          </div>
        </div>
      </div>
    </div>
  );
}

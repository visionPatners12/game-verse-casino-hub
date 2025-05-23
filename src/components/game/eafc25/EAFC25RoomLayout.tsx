
import { RoomData } from "@/components/game/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GameChat from "@/components/GameChat";
import { EAFC25MatchTimer } from "./EAFC25MatchTimer";
import { EAFC25PlayerInfo } from "./EAFC25PlayerInfo";
import { EAFC25MatchDetails } from "./EAFC25MatchDetails";
import { GameControls } from "./room-layout/GameControls";
import { MatchStatus } from "./room-layout/MatchStatus";
import { MatchInstructions } from "./room-layout/MatchInstructions";
import { useIsMobile } from "@/hooks/use-mobile";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EAFC25ReadyCountdown } from "./EAFC25ReadyCountdown";

interface EAFC25RoomLayoutProps {
  loading?: boolean;
  roomData: RoomData | null;
  currentUserId: string | null;
  gameStatus: 'waiting' | 'starting' | 'playing' | 'ended';
  isReady: boolean;
  onToggleReady: () => void;
  onStartGame: () => void;
  onForfeit: () => void;
  matchStartTime: Date | null;
  matchDuration: number;
  matchEnded: boolean;
  setMatchEnded: (ended: boolean) => void;
  scoreSubmitted: boolean;
  proofSubmitted: boolean;
  readyCountdownActive: boolean;
  readyCountdownEndTime: Date | null;
  onScoreSubmit: (myScore: number, opponentScore: number) => Promise<boolean>;
  onProofSubmit: (file: File) => Promise<boolean>;
  showMatchInstructions: boolean;
  showGetReady?: boolean;
  allPlayersReady?: boolean;
}

export function EAFC25RoomLayout({
  loading = false,
  roomData,
  currentUserId,
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
  proofSubmitted,
  readyCountdownActive,
  readyCountdownEndTime,
  onScoreSubmit,
  onProofSubmit,
  showMatchInstructions,
  showGetReady = true,
  allPlayersReady = false
}: EAFC25RoomLayoutProps) {
  const isMobile = useIsMobile();
  
  const players = roomData?.game_players || [];
  const currentPlayer = players.find(player => player.user_id === currentUserId);
  const opponentPlayer = players.find(player => player.user_id !== currentUserId);
  const connectedPlayers = players.filter(player => player.is_connected).length;
  const enoughPlayers = connectedPlayers >= 2;
  const currentPlayerName = currentPlayer?.display_name || currentPlayer?.users?.username || '';
  // Auto-start is handled in usePlayerReadyStatus now, only show start button during debug
  const canStartGame = false; // No longer needed as we auto-start

  const copyRoomCode = () => {
    if (roomData?.room_id) {
      navigator.clipboard.writeText(roomData.room_id);
      toast.success("Code de salle copié!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const readyPlayersCount = roomData?.game_players?.filter(p => p.is_ready).length || 0;
  const totalPlayers = roomData?.game_players?.length || 0;

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col gap-4 sm:gap-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 sm:gap-8">
          <div className="w-full lg:w-2/3">
            <Card className="overflow-hidden">
              <CardHeader className="pb-3 px-3 sm:px-6">
                {roomData && (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col">
                      <CardTitle className="text-xl">
                        EA FC 25 Match Room
                      </CardTitle>
                      <div className="flex items-center mt-1 text-sm">
                        <span className="text-muted-foreground mr-2">Code:</span>
                        <code className="bg-muted px-2 py-0.5 rounded font-mono">{roomData.room_id}</code>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-1 h-6 w-6 p-0" 
                          onClick={copyRoomCode}
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copier le code</span>
                        </Button>
                      </div>
                    </div>
                    
                    <GameControls 
                      gameStatus={gameStatus}
                      isReady={isReady}
                      canStartGame={canStartGame}
                      onToggleReady={onToggleReady}
                      onStartGame={onStartGame}
                      onForfeit={onForfeit}
                      showGetReady={showGetReady}
                      allPlayersReady={allPlayersReady}
                      currentPlayerName={currentPlayerName}
                    />
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="p-3 sm:p-6">
                {roomData && (
                  <div className="space-y-6">
                    {roomData && (
                      <EAFC25ReadyCountdown 
                        roomId={roomData.id}
                        readyPlayersCount={readyPlayersCount}
                        totalPlayers={totalPlayers}
                      />
                    )}
                    
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
                    
                    <MatchStatus 
                      matchEnded={matchEnded}
                      scoreSubmitted={scoreSubmitted}
                      proofSubmitted={proofSubmitted}
                      onScoreSubmit={onScoreSubmit}
                      onProofSubmit={onProofSubmit}
                    />
                    
                    {gameStatus === 'waiting' && showMatchInstructions && <MatchInstructions />}
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


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GameChat from "@/components/GameChat";
import { RoomData } from "@/components/game/types";
import { PlayCircle, PauseCircle, DoorOpen, AlertCircle, CheckCircle } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, 
  AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, 
  AlertDialogCancel } from "@/components/ui/alert-dialog";
import { EAFC25MatchTimer } from "./EAFC25MatchTimer";
import { EAFC25PlayerInfo } from "./EAFC25PlayerInfo";
import { EAFC25MatchDetails } from "./EAFC25MatchDetails";
import { EAFC25ScoreSubmission } from "./EAFC25ScoreSubmission";
import { EAFC25ProofUpload } from "./EAFC25ProofUpload";
import { useIsMobile } from "@/hooks/use-mobile";

interface RenewedEAFC25RoomProps {
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
  onScoreSubmit: (myScore: number, opponentScore: number) => Promise<boolean>;
  onProofSubmit: (file: File) => Promise<boolean>;
}

export function RenewedEAFC25Room({
  roomData,
  currentUserId,
  gameStatus,
  isReady,
  onToggleReady,
  onStartGame,
  onForfeit,
  matchStartTime,
  matchDuration,
  matchEnded,
  setMatchEnded,
  scoreSubmitted,
  proofSubmitted,
  onScoreSubmit,
  onProofSubmit
}: RenewedEAFC25RoomProps) {
  const isMobile = useIsMobile();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  
  const allPlayersReady = roomData?.game_players?.every(player => player.is_ready || !player.is_connected);
  const enoughPlayers = roomData?.game_players?.filter(player => player.is_connected).length === 2;
  const canStartGame = allPlayersReady && enoughPlayers && gameStatus === 'waiting';
  const isPlaying = gameStatus === 'playing' || gameStatus === 'starting';
  
  const players = roomData?.game_players || [];
  const currentPlayer = players.find(player => player.user_id === currentUserId);
  const opponentPlayer = players.find(player => player.user_id !== currentUserId);

  if (!roomData) {
    return <div className="container mx-auto p-4">Loading room data...</div>;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-3 px-3 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <span>EAFC 25 Match</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Room #{roomData.room_id}
                </span>
              </CardTitle>
              
              <div className="flex flex-wrap items-center gap-2">
                {gameStatus === 'waiting' && (
                  <Button 
                    onClick={onToggleReady}
                    variant={isReady ? "default" : "outline"}
                    className="flex items-center gap-2 text-sm"
                    size={isMobile ? "sm" : "default"}
                  >
                    {isReady ? (
                      <>
                        <PauseCircle className="h-4 w-4" />
                        Ready
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4" />
                        Get Ready
                      </>
                    )}
                  </Button>
                )}
                
                {isReady && canStartGame && (
                  <Button 
                    onClick={onStartGame}
                    size={isMobile ? "sm" : "default"}
                  >
                    Start Match
                  </Button>
                )}

                <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive"
                      className="flex items-center gap-2 text-sm"
                      size={isMobile ? "sm" : "default"}
                    >
                      <DoorOpen className="h-4 w-4" />
                      {!isMobile && "Leave Match"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Forfeit</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to leave the match? This will be considered a <b>forfeit</b> (<span className="text-destructive">automatic loss</span>) and will be visible to other players.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground"
                        onClick={() => {
                          setShowLeaveDialog(false);
                          onForfeit();
                        }}
                      >
                        Yes, I forfeit the match
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Left Column - Game Info */}
              <div className="w-full lg:w-2/3 space-y-4">
                {isPlaying && (
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
                
                {matchEnded && (
                  <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Match Completed</h3>
                        <p className="text-sm text-muted-foreground">
                          Please submit your final score and upload match proof
                        </p>
                      </div>
                      {scoreSubmitted && proofSubmitted ? (
                        <div className="flex items-center text-green-500">
                          <CheckCircle className="mr-1 h-5 w-5" />
                          <span>Submitted</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-500">
                          <AlertCircle className="mr-1 h-5 w-5" />
                          <span>Action Required</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <EAFC25ScoreSubmission 
                        onSubmit={onScoreSubmit}
                        submitted={scoreSubmitted}
                      />
                      
                      <EAFC25ProofUpload 
                        onSubmit={onProofSubmit}
                        submitted={proofSubmitted}
                      />
                    </div>
                  </div>
                )}
                
                {gameStatus === 'waiting' && (
                  <div className="border rounded-lg p-4 bg-muted/10">
                    <h3 className="text-lg font-medium mb-2">Match Instructions</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                        <span>Both players must click the "Get Ready" button to prepare for the match.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                        <span>Once ready, one player can start the match by clicking "Start Match".</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                        <span>Find your opponent on EA FC 25 using their EA ID/platform username and play your match.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                        <span>When the match ends, take a screenshot of the final score and submit it along with the score.</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Right Column - Chat */}
              <div className="w-full lg:w-1/3">
                <Card className="h-full">
                  <CardContent className="p-0 h-full">
                    <GameChat />
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

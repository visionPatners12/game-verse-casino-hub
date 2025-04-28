
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GameChat from "@/components/GameChat";
import { RoomData } from "@/components/game/types";
import RoomHeader from "@/components/game/RoomHeader";
import LoadingState from "@/components/game/LoadingState";
import PlayersList from "@/components/game/PlayersList";
import { PlayCircle, PauseCircle, DoorOpen, Clock, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useFullScreenHandle } from "react-full-screen";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, 
  AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, 
  AlertDialogCancel } from "@/components/ui/alert-dialog";
import { EAFC25MatchTimer } from "./EAFC25MatchTimer";
import { EAFC25PlayerInfo } from "./EAFC25PlayerInfo";
import { EAFC25MatchDetails } from "./EAFC25MatchDetails";
import { EAFC25ScoreSubmission } from "./EAFC25ScoreSubmission";
import { EAFC25ProofUpload } from "./EAFC25ProofUpload";

interface EAFC25RoomLayoutProps {
  loading: boolean;
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
  matchDuration: number; // in minutes
}

export function EAFC25RoomLayout({
  loading,
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
  matchDuration
}: EAFC25RoomLayoutProps) {
  const fullscreenHandle = useFullScreenHandle();
  const isMobile = useIsMobile();
  
  const totalPot = roomData?.pot || 0;
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [matchPhase, setMatchPhase] = useState<'pre-match' | 'in-progress' | 'score-submission' | 'dispute'>('pre-match');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState(false);
  
  const allPlayersReady = roomData?.game_players?.every(player => player.is_ready || !player.is_connected);
  const enoughPlayers = roomData?.game_players?.filter(player => player.is_connected).length >= 2;
  const canStartGame = allPlayersReady && enoughPlayers && gameStatus === 'waiting';
  const isPlaying = gameStatus === 'playing' || gameStatus === 'starting';

  useEffect(() => {
    if (gameStatus === 'waiting') {
      setMatchPhase('pre-match');
    } else if (gameStatus === 'playing' && !matchEnded) {
      setMatchPhase('in-progress');
    } else if (matchEnded) {
      setMatchPhase('score-submission');
    }
  }, [gameStatus, matchEnded]);

  const players = roomData?.game_players || [];
  const currentPlayer = players.find(player => player.user_id === currentUserId);
  const opponentPlayer = players.find(player => player.user_id !== currentUserId);

  // Handlers that need to return Promises to match the expected types
  const handleScoreSubmit = async (myScore: number, opponentScore: number): Promise<boolean> => {
    try {
      // Forward the call to any actual submission logic you have
      // Return a resolved promise with true for success
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error in score submission:", error);
      return Promise.resolve(false);
    }
  };

  const handleProofSubmit = async (file: File): Promise<boolean> => {
    try {
      // Forward the call to any actual submission logic you have
      // Return a resolved promise with true for success
      return Promise.resolve(true);
    } catch (error) {
      console.error("Error in proof submission:", error);
      return Promise.resolve(false);
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col gap-4 sm:gap-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 sm:gap-8">
          <div className="w-full lg:w-2/3">
            <Card className="overflow-hidden">
              <CardHeader className="pb-3 px-3 sm:px-6">
                {!loading && roomData && (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>
                      <RoomHeader 
                        gameName={gameName} 
                        roomId={roomData.room_id}
                        fullscreenHandle={fullscreenHandle}
                      />
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
                            <AlertDialogTitle>Confirmer l'abandon</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir quitter la partie ? Cela sera considéré comme un <b>abandon</b> (<span className="text-destructive">défaite automatique</span>) et sera visible par les autres joueurs.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground"
                              onClick={() => {
                                setShowLeaveDialog(false);
                                onForfeit();
                              }}
                            >
                              Oui, je quitte et j'abandonne
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="p-3 sm:p-6">
                {loading ? (
                  <LoadingState />
                ) : (
                  roomData && (
                    <div className="space-y-6">
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
                      
                      <PlayersList 
                        players={players}
                        maxPlayers={roomData.max_players}
                        currentUserId={currentUserId}
                      />
                      
                      {matchPhase === 'score-submission' && (
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
                              onSubmit={handleScoreSubmit}
                              submitted={scoreSubmitted}
                            />
                            
                            <EAFC25ProofUpload 
                              onSubmit={handleProofSubmit}
                              submitted={proofSubmitted}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
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

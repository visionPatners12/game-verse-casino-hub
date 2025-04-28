
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GameChat from "@/components/GameChat";
import { RoomData } from "@/components/game/types";
import RoomHeader from "@/components/game/RoomHeader";
import LoadingState from "@/components/game/LoadingState";
import RoomInfo from "@/components/game/RoomInfo";
import PlayersList from "@/components/game/PlayersList";
import GameCanvas from "@/components/game/GameCanvas";
import { PlayCircle, PauseCircle, DoorOpen } from "lucide-react";
import { useRef, useEffect } from "react";
import { useFullScreenHandle } from "react-full-screen";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface GameRoomLayoutProps {
  loading: boolean;
  roomData: RoomData | null;
  currentUserId: string | null;
  gameName: string;
  isReady: boolean;
  gameStatus: 'waiting' | 'starting' | 'playing' | 'ended';
  onToggleReady: () => void;
  onStartGame: () => void;
  onForfeit: () => void;
}

export function GameRoomLayout({
  loading,
  roomData,
  currentUserId,
  gameName,
  isReady,
  gameStatus,
  onToggleReady,
  onStartGame,
  onForfeit
}: GameRoomLayoutProps) {
  const gameCanvasRef = useRef<HTMLDivElement | null>(null);
  const fullscreenHandle = useFullScreenHandle();
  const isMobile = useIsMobile();
  
  const totalPot = roomData?.pot || 0;
  
  const allPlayersReady = roomData?.game_players?.every(player => player.is_ready || !player.is_connected);
  const enoughPlayers = roomData?.game_players?.filter(player => player.is_connected).length >= 2;
  const canStartGame = allPlayersReady && enoughPlayers && gameStatus === 'waiting';
  const isPlaying = gameStatus === 'playing' || gameStatus === 'starting';

  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  useEffect(() => {
    if (gameStatus === 'playing' && roomData?.status === 'Active') {
      console.log("Game is now active, ensuring canvas is properly initialized");
    }
  }, [gameStatus, roomData?.status]);

  return (
    <div>
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-8">
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
                            Start Game
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
                              {!isMobile && "Leave Room"}
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
                                  if (onForfeit) {
                                    onForfeit();
                                  }
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
                      <>
                        <RoomInfo 
                          entryFee={roomData.entry_fee} 
                          totalPot={totalPot}
                          roomId={roomData.room_id}
                        />
                        
                        <PlayersList 
                          players={roomData.game_players}
                          maxPlayers={roomData.max_players}
                          currentUserId={currentUserId}
                        />

                        <div className="mt-4 sm:mt-6" ref={gameCanvasRef}>
                          <div className="w-full rounded-lg overflow-hidden border border-border">
                            <GameCanvas 
                              roomData={roomData}
                              currentUserId={currentUserId}
                              gameStatus={gameStatus}
                            />
                          </div>
                        </div>
                      </>
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
      </main>
    </div>
  );
}

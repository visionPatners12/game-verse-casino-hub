
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

export const GameRoomLayout = ({ 
  loading, 
  roomData, 
  currentUserId,
  gameName,
  isReady,
  gameStatus,
  onToggleReady,
  onStartGame,
  onForfeit
}: GameRoomLayoutProps) => {
  const totalPot = roomData ? roomData.entry_fee * roomData.current_players * (1 - roomData.commission_rate/100) : 0;
  
  const allPlayersReady = roomData?.game_players?.every(player => player.is_ready || !player.is_connected);
  const enoughPlayers = roomData?.game_players?.filter(player => player.is_connected).length >= 2;
  const canStartGame = allPlayersReady && enoughPlayers && gameStatus === 'waiting';
  const isPlaying = gameStatus === 'playing' || gameStatus === 'starting';

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Game Canvas Section */}
        {isPlaying && (
          <div className="w-full">
            <GameCanvas 
              roomData={roomData}
              currentUserId={currentUserId}
            />
          </div>
        )}

        {/* Room Info and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="w-full lg:w-2/3">
            <Card>
              <CardHeader className="pb-3">
                {!loading && roomData && (
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      <RoomHeader 
                        gameName={gameName} 
                        roomId={roomData.room_id}
                      />
                    </CardTitle>
                    
                    <div className="flex items-center gap-2">
                      {gameStatus === 'waiting' && (
                        <Button 
                          onClick={onToggleReady}
                          variant={isReady ? "default" : "outline"}
                          className="flex items-center gap-2"
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
                        <Button onClick={onStartGame}>
                          Start Game
                        </Button>
                      )}

                      <Button 
                        onClick={onForfeit} 
                        variant="destructive"
                        className="flex items-center gap-2"
                      >
                        <DoorOpen className="h-4 w-4" />
                        Leave Room
                      </Button>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
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
                    </>
                  )
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full lg:w-1/3">
            <GameChat />
          </div>
        </div>
      </div>
    </main>
  );
};

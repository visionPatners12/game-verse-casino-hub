
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GameChat from "@/components/GameChat";
import { RoomData } from "@/components/game/types";
import RoomHeader from "@/components/game/RoomHeader";
import LoadingState from "@/components/game/LoadingState";
import RoomInfo from "@/components/game/RoomInfo";
import PlayersList from "@/components/game/PlayersList";
import GameCanvas from "@/components/game/GameCanvas";
import { gameCodeToType } from "@/lib/gameTypes";

interface GameRoomLayoutProps {
  loading: boolean;
  roomData: RoomData | null;
  currentUserId: string | null;
  gameName: string;
}

export const GameRoomLayout = ({ 
  loading, 
  roomData, 
  currentUserId,
  gameName 
}: GameRoomLayoutProps) => {
  const totalPot = roomData ? roomData.entry_fee * roomData.current_players * (1 - roomData.commission_rate/100) : 0;

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="w-full lg:w-2/3">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              {!loading && roomData && (
                <CardTitle>
                  <RoomHeader 
                    gameName={gameName} 
                    roomId={roomData.room_id}
                  />
                </CardTitle>
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
                    
                    <GameCanvas 
                      roomData={roomData}
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
    </main>
  );
};

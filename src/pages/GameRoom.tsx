
import Navigation from "@/components/Navigation";
import { useGameRoom } from "@/hooks/useGameRoom";
import { GameRoomLayout } from "@/components/game/GameRoomLayout";
import { gameCodeToType, isValidGameType } from "@/lib/gameTypes";

const GameRoom = () => {
  const { loading, roomData, currentUserId, gameType } = useGameRoom();
  
  // Safely get the game name from the type
  const gameName = gameType && isValidGameType(gameType) 
    ? gameCodeToType[gameType] 
    : (gameType ? gameType.charAt(0).toUpperCase() + gameType.slice(1) : "Unknown Game");

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <GameRoomLayout
        loading={loading}
        roomData={roomData}
        currentUserId={currentUserId}
        gameName={gameName}
      />
      <footer className="bg-card border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GameVerse Casino. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default GameRoom;

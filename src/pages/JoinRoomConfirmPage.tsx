
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { RoomInfo } from "@/components/game/join-dialog/RoomInfo";
import { useJoinRoom } from "@/hooks/room/useJoinRoom";
import { useJoinRoomData } from "@/hooks/room/useJoinRoomData";
import { RoomConfiguration } from "@/components/game/join-dialog/RoomConfiguration";

export default function JoinRoomConfirmPage() {
  const { gameType, roomId } = useParams();
  const { joinRoom, isLoading: isJoining } = useJoinRoom();
  const { isLoading, data } = useJoinRoomData(roomId);

  const handleJoinConfirm = async () => {
    if (roomId) {
      await joinRoom(roomId);
    }
  };

  console.log("JoinRoomConfirmPage rendering with data:", data);
  console.log("Game type:", gameType);

  if (isLoading || !data) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Chargement...</p>
        </div>
      </Layout>
    );
  }

  const { roomData, hostData, gameSettings } = data;
  const isFutArena = roomData.game_type?.toLowerCase() === "futarena" || roomData.game_type?.toLowerCase() === "eafc25";

  console.log("Room is FutArena:", isFutArena);
  console.log("Host data:", hostData);
  console.log("Game settings:", gameSettings);

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-gradient-to-b from-background to-background/95 border-casino-accent/20">
          <CardHeader className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <CardTitle className="text-2xl text-casino-accent">👋 Règles des matchs</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Veuillez lire et accepter les règles avant de participer
                </p>
              </div>
              <RoomInfo
                currentPlayers={roomData.current_players}
                maxPlayers={roomData.max_players}
                entryFee={roomData.entry_fee}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <RoomConfiguration 
              gameSettings={gameSettings}
              hostData={hostData}
              isFutArena={isFutArena}
            />
            <div className="pt-4">
              <Button 
                onClick={handleJoinConfirm} 
                className="w-full bg-casino-accent hover:bg-casino-accent/90"
                disabled={isJoining}
              >
                J'ai lu les règles et je rejoins la partie
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

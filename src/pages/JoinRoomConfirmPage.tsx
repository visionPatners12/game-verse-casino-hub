
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useJoinRoom } from "@/hooks/room/useJoinRoom";
import { useJoinRoomConfirmData } from "@/hooks/room/useJoinRoomConfirmData";
import { JoinRoomLoading } from "@/components/game/join-dialog/JoinRoomLoading";
import { RoomInfo } from "@/components/game/join-dialog/RoomInfo";
import { RoomSettings } from "@/components/game/join-dialog/RoomSettings";
import { PlatformRules } from "@/components/game/join-dialog/PlatformRules";
import { DisclaimerSection } from "@/components/game/join-dialog/DisclaimerSection";

export default function JoinRoomConfirmPage() {
  const { roomId } = useParams();
  const { joinRoom, isLoading } = useJoinRoom();
  const { roomData, isRoomLoading } = useJoinRoomConfirmData(roomId);

  const handleJoinConfirm = async () => {
    if (roomId) {
      await joinRoom(roomId);
    }
  };

  if (isRoomLoading) {
    return <JoinRoomLoading />;
  }

  if (!roomData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Aucune information de salle disponible.</p>
        </div>
      </Layout>
    );
  }

  const isFutArena = roomData?.game_type?.toLowerCase() === "futarena" || roomData?.game_type?.toLowerCase() === "eafc25";

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
                currentPlayers={roomData?.current_players}
                maxPlayers={roomData?.max_players}
                entryFee={roomData?.entry_fee}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Separator className="bg-casino-accent/20" />

            {isFutArena && (
              <>
                <RoomSettings
                  halfLengthMinutes={roomData.half_length_minutes}
                  legacyDefendingAllowed={roomData.legacy_defending_allowed}
                  customFormationsAllowed={roomData.custom_formations_allowed}
                  platform={roomData.platform}
                  mode={roomData.mode}
                  teamType={roomData.team_type}
                />
                <Separator className="bg-casino-accent/20" />
              </>
            )}

            <PlatformRules />

            <Separator className="bg-casino-accent/20" />

            <DisclaimerSection />

            <div className="pt-4">
              <Button 
                onClick={handleJoinConfirm} 
                className="w-full bg-casino-accent hover:bg-casino-accent/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "J'ai lu les règles et je rejoins la partie"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

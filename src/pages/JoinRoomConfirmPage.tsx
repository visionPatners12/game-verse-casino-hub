
import { Layout } from "@/components/Layout";
import { useParams } from "react-router-dom";
import { useJoinRoom } from "@/hooks/room/useJoinRoom";
import { useJoinRoomConfirmData } from "@/hooks/room/useJoinRoomConfirmData";
import { JoinRoomLoading } from "@/components/game/join-dialog/JoinRoomLoading";
import { JoinRoomCard } from "@/components/game/join-dialog/JoinRoomCard";
import { GamerTagPromptDialog } from "@/components/game/GamerTagPromptDialog";
import { useGamerTagCheck } from "@/hooks/room/useGamerTagCheck";
import { useState } from "react";
import { GamePlatform } from "@/types/futarena";

export default function JoinRoomConfirmPage() {
  const { roomId } = useParams();
  const { joinRoom, isLoading } = useJoinRoom();
  const { roomData, hostData, isRoomLoading } = useJoinRoomConfirmData(roomId);
  const { checkRequiredGamerTag, saveGamerTag, isChecking } = useGamerTagCheck();
  const [showGamerTagPrompt, setShowGamerTagPrompt] = useState(false);

  const handleJoinConfirm = async () => {
    if (!roomData) return;

    const isFutArena = roomData.game_type?.toLowerCase() === "futarena" || roomData.game_type?.toLowerCase() === "eafc25";
    const platform = roomData.platform as GamePlatform;
    
    if (isFutArena && platform) {
      const hasGamerTag = await checkRequiredGamerTag(platform);
      if (!hasGamerTag) {
        setShowGamerTagPrompt(true);
        return;
      }
    }

    if (roomId) {
      await joinRoom(roomId);
    }
  };

  const handleSaveGamerTag = async (gamerTag: string) => {
    if (!roomData?.platform) return;
    
    const success = await saveGamerTag(roomData.platform as GamePlatform, gamerTag);
    if (success) {
      setShowGamerTagPrompt(false);
      if (roomId) {
        await joinRoom(roomId);
      }
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

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <JoinRoomCard 
          roomData={roomData}
          hostData={hostData}
          isLoading={isLoading}
          onJoinConfirm={handleJoinConfirm}
        />
        {roomData.platform && (
          <GamerTagPromptDialog
            open={showGamerTagPrompt}
            onOpenChange={setShowGamerTagPrompt}
            platform={roomData.platform as GamePlatform}
            onSave={handleSaveGamerTag}
            isLoading={isLoading || isChecking}
          />
        )}
      </div>
    </Layout>
  );
}

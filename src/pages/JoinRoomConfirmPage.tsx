
import { Layout } from "@/components/Layout";
import { useParams } from "react-router-dom";
import { useJoinRoom } from "@/hooks/room/useJoinRoom";
import { useJoinRoomConfirmData } from "@/hooks/room/useJoinRoomConfirmData";
import { JoinRoomLoading } from "@/components/game/join-dialog/JoinRoomLoading";
import { JoinRoomCard } from "@/components/game/join-dialog/JoinRoomCard";
import { GamerTagPromptDialog } from "@/components/game/GamerTagPromptDialog";
import { useState, useEffect } from "react";
import { GamePlatform } from "@/types/futarena";

export default function JoinRoomConfirmPage() {
  const { roomId } = useParams();
  const { joinRoom, isLoading: isJoiningRoom } = useJoinRoom();
  const { roomData, hostData, isRoomLoading } = useJoinRoomConfirmData(roomId);
  const { checkRequiredGamerTag, saveGamerTag, isChecking, isSaving } = useGamerTagCheck();
  const [showGamerTagPrompt, setShowGamerTagPrompt] = useState(false);
  const [showRoomCard, setShowRoomCard] = useState(false);

  // Check for required gamer tag when room data loads
  useEffect(() => {
    const checkGamerTag = async () => {
      if (roomData?.platform) {
        const platform = roomData.platform as GamePlatform;
        const isArenaGame = roomData.game_type?.toLowerCase() === "eafc25";
        
        if (isArenaGame) {
          const hasGamerTag = await checkRequiredGamerTag(platform);
          
          if (!hasGamerTag) {
            setShowGamerTagPrompt(true);
            setShowRoomCard(false);
          } else {
            setShowRoomCard(true);
          }
        } else {
          setShowRoomCard(true);
        }
      }
    };
    
    if (roomData && !isRoomLoading) {
      checkGamerTag();
    }
  }, [roomData, isRoomLoading, checkRequiredGamerTag]);

  const handleJoinConfirm = async () => {
    if (!roomData) return;

    if (roomId) {
      await joinRoom(roomId);
    }
  };

  const handleSaveGamerTag = async (gamerTag: string) => {
    if (!roomData?.platform) return;
    
    try {
      const success = await saveGamerTag(roomData.platform as GamePlatform, gamerTag);
      if (success) {
        setShowGamerTagPrompt(false);
        setShowRoomCard(true);
      }
    } catch (error) {
      console.error("Error saving gamer tag:", error);
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
        {showRoomCard && (
          <JoinRoomCard 
            roomData={roomData}
            hostData={hostData}
            isLoading={isJoiningRoom}
            onJoinConfirm={handleJoinConfirm}
          />
        )}
        {roomData.platform && (
          <GamerTagPromptDialog
            open={showGamerTagPrompt}
            onOpenChange={setShowGamerTagPrompt}
            platform={roomData.platform as GamePlatform}
            onSave={handleSaveGamerTag}
            isLoading={isJoiningRoom || isChecking || isSaving}
          />
        )}
      </div>
    </Layout>
  );
}

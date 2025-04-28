
import { Layout } from "@/components/Layout";
import { useParams } from "react-router-dom";
import { useJoinRoom } from "@/hooks/room/useJoinRoom";
import { useJoinRoomConfirmData } from "@/hooks/room/useJoinRoomConfirmData";
import { JoinRoomLoading } from "@/components/game/join-dialog/JoinRoomLoading";
import { JoinRoomCard } from "@/components/game/join-dialog/JoinRoomCard";

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

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <JoinRoomCard 
          roomData={roomData}
          isLoading={isLoading}
          onJoinConfirm={handleJoinConfirm}
        />
      </div>
    </Layout>
  );
}

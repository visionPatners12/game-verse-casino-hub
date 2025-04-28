
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EAFC25GameRoom from "@/components/game/eafc25/EAFC25GameRoom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function EAFC25Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !session) {
      toast.error("You must be logged in to access this page");
      navigate("/auth");
    }
  }, [isLoading, session, navigate]);

  useEffect(() => {
    if (!roomId) {
      navigate("/games");
    }
  }, [roomId, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting to login...</div>;
  }

  return <EAFC25GameRoom />;
}

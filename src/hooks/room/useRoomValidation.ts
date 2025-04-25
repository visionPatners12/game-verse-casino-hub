
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isValidGameType } from "@/lib/gameTypes";

export const useRoomValidation = (gameType: string | undefined) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (gameType && !isValidGameType(gameType)) {
      console.error("Invalid game type detected:", gameType);
      toast.error("The requested game does not exist.");
      navigate("/games");
    }
  }, [gameType, navigate]);
};

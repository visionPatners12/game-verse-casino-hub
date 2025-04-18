
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { isValidGameType } from "@/lib/gameTypes";

export const useRoomValidation = (gameType: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (gameType && !isValidGameType(gameType)) {
      console.error("Invalid game type detected:", gameType);
      toast({
        title: "Invalid Game Type",
        description: "The requested game does not exist.",
        variant: "destructive"
      });
      navigate("/games");
    }
  }, [gameType, navigate, toast]);
};

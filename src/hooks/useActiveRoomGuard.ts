
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { roomService } from '@/services/room';
import { useToast } from '@/hooks/use-toast';

export const useActiveRoomGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkActiveRoom = () => {
      const { roomId, gameType } = roomService.getStoredRoomConnection();
      
      // Si on est déjà dans la room, on ne fait rien
      if (location.pathname.includes(`/room/${roomId}`)) {
        return;
      }
      
      // Si on a une room active
      if (roomId && gameType) {
        toast({
          title: "Partie en cours",
          description: "Vous ne pouvez pas quitter la partie tant qu'elle n'est pas terminée.",
          variant: "destructive",
        });
        
        // Rediriger vers la room
        navigate(`/games/${gameType}/room/${roomId}`);
      }
    };

    checkActiveRoom();
  }, [navigate, location.pathname, toast]);
};


import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useActiveRoomGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const checkActiveRoom = async () => {
      const { data: userData, error } = await supabase
        .from('users')
        .select('active_room_id')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error checking active room:', error);
        return;
      }

      if (userData?.active_room_id) {
        // Si l'utilisateur a une room active
        const { data: roomData } = await supabase
          .from('game_sessions')
          .select('game_type')
          .eq('id', userData.active_room_id)
          .single();
          
        if (roomData) {
          const gameType = roomData.game_type.toLowerCase();
          // Rediriger seulement si pas déjà sur la page de room
          if (!location.pathname.includes(`/games/${gameType}/room/${userData.active_room_id}`)) {
            toast({
              title: "Active Room Detected",
              description: "Redirecting to your active game room...",
            });
            navigate(`/games/${gameType}/room/${userData.active_room_id}`);
          }
        }
      }
    };

    // Vérifier au chargement initial
    checkActiveRoom();
  }, [navigate, location.pathname, user, toast]);
};

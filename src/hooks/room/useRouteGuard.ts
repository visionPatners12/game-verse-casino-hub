
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useRouteGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

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

      const activeRoomId = userData?.active_room_id;

      if (activeRoomId) {
        // Si l'utilisateur est dans une room
        const { data: roomData } = await supabase
          .from('game_sessions')
          .select('game_type')
          .eq('id', activeRoomId)
          .single();

        const gameType = roomData?.game_type?.toLowerCase();

        // Si l'utilisateur n'est pas déjà sur la page de la room
        if (!location.pathname.includes(`/games/${gameType}/room/${activeRoomId}`)) {
          if (location.pathname !== '/games' && !location.pathname.startsWith('/games/')) {
            toast.error("You must leave the current room first");
            navigate(`/games/${gameType}/room/${activeRoomId}`);
          }
        }
      }
    };

    // Vérifier au chargement initial et lors des changements de route
    checkActiveRoom();
  }, [navigate, location.pathname, user]);
};

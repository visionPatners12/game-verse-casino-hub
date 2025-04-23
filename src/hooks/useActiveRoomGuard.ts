
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useActiveRoomGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const checkActiveRoom = async () => {
      // Early check if not logged in
      if (!user?.id) return;

      // Always fetch from server to get up-to-date active room state
      const { data, error } = await supabase
        .from('users')
        .select('active_room_id')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.warn("Failed to get active_room_id:", error);
        return;
      }

      const activeRoomId = data?.active_room_id;

      // If user has no active room, allow navigation everywhere
      if (!activeRoomId) return;

      // If user is already in the active room route, allow it
      if (location.pathname.includes(`/room/${activeRoomId}`)) {
        return;
      }

      // If user is not on their active room, block and redirect
      toast({
        title: "Partie en cours",
        description: "Vous ne pouvez pas quitter la partie tant qu'elle n'est pas terminée ou abandonnée.",
        variant: "destructive",
      });

      // Find which game type this room corresponds to
      // NOTE: You might need to adjust this query if you move to a separate profiles table!
      const { data: session } = await supabase
        .from('game_sessions')
        .select('game_type')
        .eq('id', activeRoomId)
        .maybeSingle();

      const gameType = session?.game_type?.toLowerCase() || 'unknown';

      // Redirect to the correct room route
      navigate(`/games/${gameType}/room/${activeRoomId}`);
    };

    checkActiveRoom();
  }, [navigate, location.pathname, toast, user]);
};

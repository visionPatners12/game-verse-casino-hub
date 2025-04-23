
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

      console.log("Checking for active room for user", user.id);

      // Always fetch from server to get up-to-date active room state
      const { data, error } = await supabase
        .from('users')
        .select('active_room_id')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Failed to get active_room_id:", error);
        return;
      }

      const activeRoomId = data?.active_room_id;
      console.log("Active room ID found:", activeRoomId);

      // If user has no active room, allow navigation everywhere
      if (!activeRoomId) return;

      // If user is already in the active room route, allow it
      if (location.pathname.includes(`/room/${activeRoomId}`)) {
        console.log("User is already in their active room, navigation allowed");
        return;
      }
      
      // Allow navigation to the games page if the user is trying to leave
      if (location.pathname === '/games' || location.pathname.startsWith('/games/')) {
        console.log("Navigation to games page allowed to leave room");
        // We won't clear the active room when going to games page - let the Leave Room button handle this
        // Otherwise users could bypass the leave room confirmation by just navigating away
        return;
      }
      
      // If user is on the forfeit page, allow the navigation
      if (location.pathname.includes('/forfeit')) {
        console.log("Forfeit page, navigation allowed");
        return;
      }

      // If user is not on their active room, block and redirect
      toast({
        title: "Active Game",
        description: "You must leave the current game using the 'Leave' button before navigating elsewhere.",
        variant: "destructive",
      });

      // Find which game type this room corresponds to
      const { data: session } = await supabase
        .from('game_sessions')
        .select('game_type')
        .eq('id', activeRoomId)
        .maybeSingle();

      const gameType = session?.game_type?.toLowerCase() || 'unknown';
      console.log("Redirecting to active room:", gameType, activeRoomId);

      // Redirect to the correct room route
      navigate(`/games/${gameType}/room/${activeRoomId}`);
    };

    checkActiveRoom();
  }, [navigate, location.pathname, toast, user]);
};

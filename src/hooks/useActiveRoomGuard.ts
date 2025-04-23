
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
    const checkActiveRooms = async () => {
      if (!user?.id) return;

      // Permet la navigation libre sans contraintes liées à active_room_id
      if (location.pathname === '/games' || location.pathname.startsWith('/games/')) {
        return;
      }
    };

    checkActiveRooms();
  }, [navigate, location.pathname, toast, user]);
};

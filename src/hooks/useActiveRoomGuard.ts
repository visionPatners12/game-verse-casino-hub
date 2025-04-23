
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useActiveRoomGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Permet la navigation libre sans contraintes
    if (location.pathname === '/games' || location.pathname.startsWith('/games/')) {
      return;
    }
  }, [navigate, location.pathname, user]);
};

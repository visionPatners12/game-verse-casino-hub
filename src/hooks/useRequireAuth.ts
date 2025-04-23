
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Hook to ensure that a user is authenticated.
 * If not, redirects to the authentication page.
 * 
 * @returns An object containing the auth state.
 */
export function useRequireAuth() {
  const { session, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      console.log("Utilisateur non authentifié, redirection vers /auth");
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate("/auth");
    }
  }, [isLoading, session, navigate]);

  return {
    isAuthenticated: !!session,
    isLoading,
    user,
    session
  };
}

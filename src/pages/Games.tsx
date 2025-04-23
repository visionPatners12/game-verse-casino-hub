
import React from 'react';
import { GamesList } from '@/components/games/GamesList';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Games = () => {
  const { user } = useAuth();

  const handleGameSelection = async (gameType: string) => {
    if (!user?.id) {
      toast.error("Vous devez être connecté");
      return;
    }

    try {
      // Vérifier si l'utilisateur a une room active
      const { data, error } = await supabase
        .from('users')
        .select('active_room_id')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Erreur lors de la vérification de la room active:", error);
        toast.error("Une erreur est survenue");
        return;
      }

      if (data?.active_room_id) {
        toast.warning(
          "Vous ne pouvez pas quitter la partie en cours", 
          {
            description: "Terminez d'abord votre partie actuelle",
            duration: 4000
          }
        );
        return;
      }

      // Si pas de room active, continuer normalement
      window.location.href = `/games/${gameType}/public`;
    } catch (err) {
      console.error("Erreur inattendue:", err);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <GamesList onGameSelect={handleGameSelection} />
  );
};

export default Games;

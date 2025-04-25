
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useRequireAuth } from "./useRequireAuth";

interface DuoBet {
  id: string;
  creator_id: string;
  opponent_id: string | null;
  amount: number;
  creator_prediction: 'TeamA' | 'TeamB' | 'Draw';
  opponent_prediction: 'TeamA' | 'TeamB' | 'Draw' | null;
  match_description: string;
  team_a: string;
  team_b: string;
  status: 'Pending' | 'Active' | 'Completed' | 'Cancelled';
  result: 'TeamA' | 'TeamB' | 'Draw' | null;
  created_at: string;
  expires_at: string;
  completed_at: string | null;
  commission_rate: number;
  bet_code: string;
}

interface CreateBetInput {
  amount: number;
  creator_prediction: 'TeamA' | 'TeamB' | 'Draw';
  match_description: string;
  team_a: string;
  team_b: string;
  expires_at: string;
  bet_code: string;
}

export function useDuoBets() {
  const queryClient = useQueryClient();
  useRequireAuth();

  const { data: bets, isLoading } = useQuery({
    queryKey: ['duo-bets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('duo_bets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Impossible de charger les paris");
        throw error;
      }

      return data as DuoBet[];
    },
  });

  const createBet = useMutation({
    mutationFn: async (input: CreateBetInput) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Utilisateur non connecté");
          throw new Error("Utilisateur non connecté");
        }

        const { data, error } = await supabase
          .from('duo_bets')
          .insert([{
            creator_id: user.id,
            ...input
          }])
          .select()
          .single();

        if (error) {
          console.error('Error creating bet:', error);
          toast.error("Erreur lors de la création du pari");
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Create bet error:', error);
        toast.error("Erreur lors de la création du pari");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['duo-bets'] });
    }
  });

  return {
    bets,
    isLoading,
    createBet
  };
}

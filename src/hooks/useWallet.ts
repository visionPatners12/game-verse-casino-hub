
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export type Transaction = {
  id: string;
  amount: number;
  type: 'Deposit' | 'Withdrawal' | 'Stake' | 'Winnings' | 'Bonus' | 'StorePurchase' | 'ReferralReward';
  status: 'Pending' | 'Success' | 'Failed' | 'Rejected';
  created_at: string;
  wallet_id: string;
  payment_method?: string;
  description?: string;
  source_balance: 'real' | 'bonus';
};

export type Wallet = {
  id: string;
  real_balance: number;
  bonus_balance: number;
  currency: string;
  user_id: string;
};

// On ajoute une option enableTransactions (par défaut: true)
export const useWallet = (options?: { enableTransactions?: boolean }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is authenticated
  const { data: session } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
  });

  const { data: wallet, isLoading: isLoadingWallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      // First check if user is authenticated
      if (!session) {
        console.log("No active session, cannot fetch wallet");
        return null;
      }

      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error("Error fetching wallet:", error);
        toast({
          title: "Error loading wallet",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Wallet;
    },
    enabled: !!session, // Only run this query if we have a session
  });

  // Ajout: l'option enableTransactions décide si on charge les transactions
  const enableTransactions = options?.enableTransactions !== undefined ? options.enableTransactions : true;

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', wallet?.id],
    queryFn: async () => {
      // First check if user is authenticated
      if (!session) {
        console.log("No active session, cannot fetch transactions");
        return [];
      }

      // Si le wallet n'existe pas encore, return empty array
      if (!wallet?.id) { return []; }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        toast({
          title: "Error loading transactions",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Transaction[];
    },
    enabled: !!session && !!wallet?.id && enableTransactions, // <= Ici on utilise uniquement si activé !
  });

  return {
    wallet,
    transactions,
    isLoading: isLoadingWallet || (enableTransactions && isLoadingTransactions),
  };
};

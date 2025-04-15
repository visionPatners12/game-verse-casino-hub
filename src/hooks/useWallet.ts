
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export const useWallet = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wallet, isLoading: isLoadingWallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .single();

      if (error) {
        toast({
          title: "Error loading wallet",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Wallet;
    },
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error loading transactions",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Transaction[];
    },
  });

  return {
    wallet,
    transactions,
    isLoading: isLoadingWallet || isLoadingTransactions,
  };
};

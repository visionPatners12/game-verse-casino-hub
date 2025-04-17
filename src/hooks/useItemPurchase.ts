
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useItemPurchase = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const purchaseMutation = useMutation({
    mutationFn: async ({ itemId }: { itemId: string }) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if user already owns this item
      const { data: existingItem } = await supabase
        .from('user_items')
        .select('id')
        .eq('item_id', itemId)
        .eq('user_id', user.id)
        .single();

      if (existingItem) {
        throw new Error('Vous possédez déjà cet item');
      }

      // Get item price
      const { data: item } = await supabase
        .from('store_items')
        .select('price, name')
        .eq('id', itemId)
        .single();

      if (!item) {
        throw new Error('Item introuvable');
      }

      // Get user wallet
      const { data: wallet } = await supabase
        .from('wallets')
        .select('real_balance, id')
        .eq('user_id', user.id)
        .single();

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      if (wallet.real_balance < item.price) {
        throw new Error('Solde insuffisant');
      }

      // Begin transaction - Insert purchase first
      const { error: purchaseError } = await supabase
        .from('user_items')
        .insert({
          item_id: itemId,
          user_id: user.id,
        });

      if (purchaseError) throw purchaseError;

      // Update wallet balance
      const newBalance = wallet.real_balance - item.price;
      
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ real_balance: newBalance })
        .eq('id', wallet.id);

      if (walletError) {
        console.error('Error updating wallet:', walletError);
        throw new Error('Erreur lors de la mise à jour du solde');
      }

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          amount: -item.price,
          type: 'StorePurchase',
          wallet_id: wallet.id,
          source_balance: 'real',
          status: 'Success',
          description: `Achat: ${item.name || 'Item de la boutique'}`,
        });

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
      }

      return { itemId, price: item.price };
    },
    onSuccess: (data) => {
      toast({
        title: "Achat réussi",
        description: "L'item a été ajouté à votre inventaire",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['user-items'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur lors de l'achat",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { 
    purchaseItem: purchaseMutation.mutate, 
    isPurchasing: purchaseMutation.isPending 
  };
};

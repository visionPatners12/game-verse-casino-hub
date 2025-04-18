
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

      // Get item price and name
      const { data: item, error: itemError } = await supabase
        .from('store_items')
        .select('price, name')
        .eq('id', itemId)
        .single();

      if (itemError || !item) {
        console.error('Item fetch error:', itemError);
        throw new Error('Item introuvable');
      }

      // Get wallet balance to check before purchase
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('real_balance')
        .eq('user_id', user.id)
        .single();
        
      if (walletError || !wallet) {
        console.error('Wallet fetch error:', walletError);
        throw new Error('Erreur lors de la récupération du solde');
      }
      
      // Check balance client-side before attempting purchase
      if (wallet.real_balance < item.price) {
        console.log('Balance check failed:', { 
          balance: wallet.real_balance, 
          price: item.price 
        });
        throw new Error('Solde insuffisant pour acheter cet item');
      }

      // Call the purchase_item function
      const { data, error } = await supabase
        .rpc('purchase_item', { 
          p_item_id: itemId,
          p_user_id: user.id,
          p_price: item.price,
          p_item_name: item.name
        });

      if (error) {
        console.error('Purchase error:', error);
        if (error.message.includes('insufficient_balance')) {
          throw new Error('Solde insuffisant pour acheter cet item');
        }
        throw new Error("Erreur lors de l'achat");
      }

      return { 
        itemId, 
        price: item.price,
        newBalance: data[0].new_balance 
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Achat réussi",
        description: `L'item a été ajouté à votre inventaire. Nouveau solde: $${data.newBalance}`,
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

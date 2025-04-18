
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

export const useItemPurchase = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  // Add a processing ref to prevent duplicate purchases
  const isProcessingRef = useRef(false);

  const purchaseMutation = useMutation({
    mutationFn: async ({ itemId }: { itemId: string }) => {
      // Prevent duplicate calls
      if (isProcessingRef.current) {
        console.log('Purchase already in progress, aborting duplicate call');
        throw new Error('Une transaction est déjà en cours, veuillez patienter');
      }

      try {
        // Set processing flag to true
        isProcessingRef.current = true;
        console.log('Starting purchase process, setting isProcessing flag');

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        console.log('Attempting purchase by user:', user.id);

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

        console.log('Item to purchase:', { itemId, name: item.name, price: item.price });

        // Get wallet balance to check before purchase
        const { data: wallet, error: walletError } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (walletError || !wallet) {
          console.error('Wallet fetch error:', walletError);
          throw new Error('Erreur lors de la récupération du solde');
        }
        
        console.log('Wallet details:', { 
          walletId: wallet.id,
          realBalance: wallet.real_balance, 
          bonusBalance: wallet.bonus_balance,
          itemPrice: item.price
        });
        
        // Check balance client-side before attempting purchase
        if (wallet.real_balance < item.price) {
          console.error('Balance check failed:', { 
            balance: wallet.real_balance, 
            price: item.price,
            difference: item.price - wallet.real_balance
          });
          throw new Error(`Solde insuffisant pour acheter cet item. Vous avez $${wallet.real_balance.toFixed(2)}, l'article coûte $${item.price.toFixed(2)}`);
        }

        console.log('Balance check passed, proceeding with purchase');

        // IMPORTANT: Nous utilisons UNIQUEMENT la fonction RPC pour faire l'achat
        // La fonction gère déjà la mise à jour du solde, l'insertion de l'item et l'ajout de la transaction
        const { data, error } = await supabase
          .rpc('purchase_item', { 
            p_item_id: itemId,
            p_user_id: user.id,
            p_price: item.price,
            p_item_name: item.name
          });

        if (error) {
          console.error('Purchase error from RPC:', error);
          console.error('Error details:', error.message, error.code, error.details, error.hint);
          
          if (error.message.includes('insufficient_balance')) {
            throw new Error(`Solde insuffisant pour acheter cet item. Vérifiez votre solde.`);
          }
          throw new Error(`Erreur lors de l'achat: ${error.message}`);
        }

        console.log('Purchase successful, server response:', data);

        return { 
          itemId, 
          price: item.price,
          newBalance: data[0].new_balance 
        };
      } finally {
        // Always reset the processing flag, even if there's an error
        setTimeout(() => {
          isProcessingRef.current = false;
          console.log('Resetting isProcessing flag after purchase completion');
        }, 1000); // Add a small delay to prevent rapid clicking
      }
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

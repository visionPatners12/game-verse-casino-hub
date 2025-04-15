
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useItemPurchase = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const purchaseMutation = useMutation({
    mutationFn: async ({ itemId }: { itemId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Vérifier si l'utilisateur a déjà acheté cet item
      const { data: existingItem } = await supabase
        .from('user_items')
        .select('id')
        .eq('item_id', itemId)
        .eq('user_id', user.id)
        .single();

      if (existingItem) {
        throw new Error('Vous possédez déjà cet item');
      }

      // Vérifier le prix de l'item et le solde du portefeuille
      const { data: item } = await supabase
        .from('store_items')
        .select('price')
        .eq('id', itemId)
        .single();

      if (!item) {
        throw new Error('Item introuvable');
      }

      const { data: wallet } = await supabase
        .from('wallets')
        .select('real_balance, id')
        .eq('user_id', user.id)
        .single();

      if (!wallet || wallet.real_balance < item.price) {
        throw new Error('Solde insuffisant');
      }

      // Mettre à jour le solde du portefeuille
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ real_balance: wallet.real_balance - item.price })
        .eq('id', wallet.id);

      if (walletError) throw walletError;

      // Insertion de l'achat
      const { error: purchaseError } = await supabase
        .from('user_items')
        .insert({
          item_id: itemId,
          user_id: user.id,
        });

      if (purchaseError) throw purchaseError;

      // Insérer une transaction pour garder trace de l'achat
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          amount: -item.price,
          type: 'StorePurchase',
          wallet_id: wallet.id,
          source_balance: 'real',
          status: 'Success',
          description: `Achat d'un item dans la boutique`,
        });

      if (transactionError) throw transactionError;
    },
    onSuccess: () => {
      toast({
        title: "Achat réussi",
        description: "L'item a été ajouté à votre inventaire",
      });
      // Invalider les requêtes pour actualiser les données
      queryClient.invalidateQueries({ queryKey: ['user-items'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de l'achat",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { purchaseItem: purchaseMutation.mutate, isPurchasing: purchaseMutation.isPending };
};


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
        .select('real_balance')
        .eq('user_id', user.id)
        .single();

      if (!wallet || wallet.real_balance < item.price) {
        throw new Error('Solde insuffisant');
      }

      // Insertion de l'achat - cela déclenchera le trigger dans la base de données
      // pour mettre à jour le solde du portefeuille
      const { error } = await supabase
        .from('user_items')
        .insert({
          item_id: itemId,
          user_id: user.id,
        });

      if (error) throw error;
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

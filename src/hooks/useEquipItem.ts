
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useEquipItem = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const equipAvatarMutation = useMutation({
    mutationFn: async ({ itemId, imageUrl }: { itemId: string, imageUrl: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Vérifier si l'utilisateur possède bien cet item
      const { data: userItem } = await supabase
        .from('user_items')
        .select('id')
        .eq('item_id', itemId)
        .eq('user_id', user.id)
        .single();

      if (!userItem) {
        throw new Error('Vous ne possédez pas cet item');
      }

      // Mettre à jour le profil de l'utilisateur avec l'URL de l'avatar
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: imageUrl })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Mettre à jour l'utilisateur pour stocker l'ID de l'item équipé
      const { error: userError } = await supabase
        .from('users')
        .update({ equipped_avatar_id: itemId })
        .eq('id', user.id);

      if (userError) throw userError;
    },
    onSuccess: () => {
      toast({
        title: "Avatar équipé",
        description: "Votre avatar a été mis à jour avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['user-items'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { equipAvatar: equipAvatarMutation.mutate, isEquipping: equipAvatarMutation.isPending };
};

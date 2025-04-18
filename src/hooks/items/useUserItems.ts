
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserItem } from "@/types/items";

export const useUserItems = () => {
  const { data: userItems, isLoading } = useQuery({
    queryKey: ['user-items'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch the user's equipped avatar ID
      const { data: userData } = await supabase
        .from('users')
        .select('equipped_avatar_id')
        .eq('id', user.id)
        .single();

      const equippedAvatarId = userData?.equipped_avatar_id;

      const { data, error } = await supabase
        .from('user_items')
        .select(`
          id,
          purchased_at,
          item_id,
          item:store_items(
            id,
            name,
            description,
            item_type,
            price,
            avatars (
              image_url,
              rarity
            ),
            chat_words (
              special_effect
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      const formattedItems = data.map(item => ({
        ...item,
        equipped: item.item_id === equippedAvatarId,
        item: {
          ...item.item,
          id: item.item_id,
          avatars: item.item.avatars?.[0] || null
        }
      })) as UserItem[];
      
      return formattedItems;
    },
  });

  return { userItems, isLoading };
};

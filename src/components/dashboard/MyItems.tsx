
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2 } from "lucide-react";

type UserItem = {
  id: string;
  purchased_at: string;
  item: {
    name: string;
    description: string;
    item_type: string;
  };
};

export function MyItems() {
  const { data: userItems, isLoading } = useQuery({
    queryKey: ['user-items'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_items')
        .select(`
          id,
          purchased_at,
          item:store_items(
            name,
            description,
            item_type
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data as UserItem[];
    },
  });

  if (isLoading) {
    return <div>Chargement de vos items...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package2 className="h-5 w-5" />
          Mes Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!userItems?.length ? (
          <p className="text-muted-foreground">Vous n'avez pas encore d'items.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{item.item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.item.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Type: {item.item.item_type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Acheté le: {new Date(item.purchased_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

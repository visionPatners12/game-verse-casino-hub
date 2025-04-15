
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type UserItem = {
  id: string;
  purchased_at: string;
  item: {
    name: string;
    description: string;
    item_type: string;
  };
};

const MyItems = () => {
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

  const equipItem = (itemId: string) => {
    // Cette fonction serait implémentée pour gérer l'équipement des items
    console.log('Équipement de l\'item:', itemId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mes Items</h1>
        
        {isLoading ? (
          <div className="text-center py-8">Chargement de vos items...</div>
        ) : !userItems?.length ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Package2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Vous n'avez pas encore d'items</h2>
              <p className="text-muted-foreground">Visitez notre boutique pour acheter des items exclusifs!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{item.item.name}</CardTitle>
                    <Badge variant="outline">{item.item.item_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.item.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      Acheté le: {new Date(item.purchased_at).toLocaleDateString()}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => equipItem(item.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Équiper
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <footer className="bg-card border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GameVerse Casino. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MyItems;

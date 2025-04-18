
import { Package2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const EmptyInventory = () => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <Package2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Vous n'avez pas encore d'items</h2>
        <p className="text-muted-foreground">
          Visitez notre boutique pour acheter des items exclusifs!
        </p>
      </CardContent>
    </Card>
  );
};

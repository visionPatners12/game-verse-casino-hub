
import { StoreItem } from "@/types/store";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, ShoppingCart } from "lucide-react";

interface AvatarItemProps {
  item: StoreItem;
  isOwned: boolean;
  onPurchase: (itemId: string, price: number) => void;
  isPurchasing: boolean;
  canAfford: boolean;
}

export const AvatarItem = ({ item, isOwned, onPurchase, isPurchasing, canAfford }: AvatarItemProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{item.name}</CardTitle>
          <Badge variant="outline">
            {item.avatars?.rarity || 'common'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4 flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-2">
          <AvatarImage src={item.avatars?.image_url} />
          <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="mt-2 text-center">
          <div className="font-semibold text-lg">${item.price}</div>
          {item.description && (
            <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {isOwned ? (
          <Button
            className="w-full"
            variant="outline"
          >
            <Check className="h-4 w-4 mr-2" /> Possédé
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => onPurchase(item.id, item.price)}
            disabled={isPurchasing || !canAfford}
          >
            <ShoppingCart className="h-4 w-4 mr-2" /> Acheter
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};


import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserItem } from "@/types/items";

interface ChatWordsListProps {
  items: UserItem[];
}

export const ChatWordsList = ({ items }: ChatWordsListProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p>Vous n'avez pas encore de ChatWords. Visitez la boutique pour en acheter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{item.item.name}</CardTitle>
            <Badge>ChatWord</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{item.item.description}</p>
            {item.item.chat_words?.special_effect && (
              <p className="text-sm">
                <span className="font-medium">Effet spécial:</span>{" "}
                {item.item.chat_words.special_effect}
              </p>
            )}
            <div className="mt-4 text-xs text-muted-foreground">
              Acheté le: {format(new Date(item.purchased_at), 'dd/MM/yyyy')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TicketPlus } from "lucide-react";

export const SupportTickets = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Tickets</CardTitle>
        <CardDescription>
          Gérez vos demandes de support et créez de nouveaux tickets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Aucun ticket de support actif
            </p>
            <Button>
              <TicketPlus className="mr-2 h-4 w-4" />
              Nouveau Ticket
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
};

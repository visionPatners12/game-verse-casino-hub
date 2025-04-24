
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { CreateTicketDialog } from "./CreateTicketDialog";
import { useTickets } from "@/hooks/useTickets";
import { Loader2 } from "lucide-react";

export const SupportTickets = () => {
  const { tickets, isLoading } = useTickets();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Support Tickets
            <CreateTicketDialog />
          </CardTitle>
          <CardDescription>
            Gérez vos demandes de support
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Support Tickets
          <CreateTicketDialog />
        </CardTitle>
        <CardDescription>
          Gérez vos demandes de support
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tickets?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Vous n'avez pas encore de tickets de support.
            <br />
            Cliquez sur "Nouveau Ticket" pour en créer un.
          </div>
        ) : (
          <div className="space-y-4">
            {tickets?.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{ticket.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm">
                      Status: <span className="font-medium">{ticket.status}</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

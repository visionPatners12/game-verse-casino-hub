
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TicketMessages } from "./TicketMessages";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-500';
      case 'InProgress': return 'bg-yellow-500';
      case 'Resolved': return 'bg-green-500';
      case 'Closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

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
              <Dialog key={ticket.id}>
                <DialogTrigger asChild>
                  <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold mb-1">{ticket.subject}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {ticket.category}
                        </p>
                        <time className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(ticket.created_at), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </time>
                      </div>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{ticket.subject}</DialogTitle>
                  </DialogHeader>
                  <TicketMessages ticketId={ticket.id} />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

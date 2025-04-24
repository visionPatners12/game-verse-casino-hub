import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  subject: string;
  category: 'Technical' | 'Billing' | 'Behavior' | 'Other';
  status: 'Open' | 'InProgress' | 'Resolved' | 'Closed';
  created_at: string;
  updated_at: string;
  user_id?: string;
}

interface Message {
  id: string;
  ticket_id: string;
  sender_id: string | null;
  content: string;
  created_at: string;
}

export function useTickets() {
  const queryClient = useQueryClient();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Impossible de charger les tickets");
        throw error;
      }

      return data as Ticket[];
    },
  });

  const createTicket = useMutation({
    mutationFn: async ({ category, subject, content }: { category: Ticket['category']; subject: string; content: string }) => {
      try {
        console.log('Creating ticket with:', { category, subject, content });
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Utilisateur non connecté");
          throw new Error("Utilisateur non connecté");
        }
        
        const { data: ticketData, error: ticketError } = await supabase
          .from('support_tickets')
          .insert([{ 
            category,
            subject,
            user_id: user.id,
            status: 'Open'
          }])
          .select()
          .single();

        if (ticketError) {
          console.error('Ticket creation error:', ticketError);
          toast.error("Erreur lors de la création du ticket");
          throw ticketError;
        }

        const { error: messageError } = await supabase
          .from('support_messages')
          .insert([{ 
            ticket_id: ticketData.id,
            content,
            sender_id: user.id
          }]);

        if (messageError) {
          console.error('Message creation error:', messageError);
          toast.error("Erreur lors de la création du message");
          throw messageError;
        }

        return ticketData;
      } catch (error) {
        console.error('Create ticket error:', error);
        toast.error("Erreur lors de la création du ticket");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      toast.success("Ticket créé avec succès");
    },
    onError: (error) => {
      console.error('Error in createTicket mutation:', error);
      toast.error("Erreur lors de la création du ticket");
    }
  });

  const updateTicketStatus = useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: string; status: Ticket['status'] }) => {
      try {
        console.log('Updating ticket status:', { ticketId, status });
        const { error } = await supabase
          .from('support_tickets')
          .update({ status })
          .eq('id', ticketId);

        if (error) {
          console.error('Update ticket error:', error);
          toast.error("Erreur lors de la mise à jour du ticket");
          throw error;
        }
      } catch (error) {
        console.error('Update ticket error:', error);
        toast.error("Erreur lors de la mise à jour du ticket");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      toast.success("Ticket mis à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du ticket");
    }
  });

  return {
    tickets,
    isLoading,
    createTicket,
    updateTicketStatus
  };
}

export function useTicketMessages(ticketId: string) {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['ticket-messages', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) {
        toast.error("Impossible de charger les messages");
        throw error;
      }

      return data as Message[];
    },
    enabled: !!ticketId
  });

  const addMessage = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Utilisateur non connecté");
          throw new Error("Utilisateur non connecté");
        }

        const { error } = await supabase
          .from('support_messages')
          .insert([{
            ticket_id: ticketId,
            content,
            sender_id: user.id
          }]);

        if (error) {
          console.error('Message creation error:', error);
          toast.error("Erreur lors de l'envoi du message");
          throw error;
        }
      } catch (error) {
        console.error('Add message error:', error);
        toast.error("Erreur lors de l'envoi du message");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-messages', ticketId] });
    },
    onError: () => {
      toast.error("Erreur lors de l'envoi du message");
    }
  });

  return {
    messages,
    isLoading,
    addMessage
  };
}


import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  category: 'Technical' | 'Billing' | 'Behavior' | 'Other';
  status: 'Open' | 'InProgress' | 'Resolved' | 'Closed';
  created_at: string;
  updated_at: string;
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
    mutationFn: async ({ category, content }: { category: Ticket['category']; content: string }) => {
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_tickets')
        .insert([{ category }])
        .select()
        .single();

      if (ticketError) throw ticketError;

      const { error: messageError } = await supabase
        .from('support_messages')
        .insert([{ 
          ticket_id: ticketData.id,
          content
        }]);

      if (messageError) throw messageError;

      return ticketData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      toast.success("Ticket créé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création du ticket");
    }
  });

  return {
    tickets,
    isLoading,
    createTicket
  };
}

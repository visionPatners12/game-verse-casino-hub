
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";

export function useSportMonksData(selectedDate: Date = new Date()) {
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  return useQuery({
    queryKey: ['sportmonks-matches', formattedDate],
    queryFn: async () => {
      try {
        console.log("Fetching SportMonks data for date:", formattedDate);
        
        const { data, error } = await supabase.functions.invoke('get-sportmonks-matches', {
          body: { date: formattedDate, singleDay: true }
        });

        if (error) {
          console.error("Error fetching SportMonks data:", error);
          toast.error("Erreur lors du chargement des matchs");
          throw error;
        }
        
        return data;
      } catch (err) {
        console.error("Exception in useSportMonksData:", err);
        toast.error("Impossible de charger les matchs du jour");
        throw err;
      }
    },
    retry: 2,
    refetchOnWindowFocus: false
  });
}

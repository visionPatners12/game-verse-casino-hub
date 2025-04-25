
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { LiveMatches } from "@/components/duobets/LiveMatches";
import { BetsList } from "@/components/duobets/BetsList";
import { useEffect, useState } from "react";
import { useSportMonksData } from "@/hooks/useSportMonksData";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function DuoBets() {
  const { error: matchesError } = useSportMonksData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (matchesError) {
      console.error("Error loading matches:", matchesError);
      toast.error("Impossible de charger les matchs du jour");
    }
  }, [matchesError]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const syncSportMonksData = async () => {
    try {
      setSyncing(true);
      toast.info("Synchronisation des données SportMonks en cours...");
      
      const { error } = await supabase.functions.invoke('sync-sportmonks-data');
      
      if (error) throw error;
      
      toast.success("Données SportMonks synchronisées avec succès!");
    } catch (err) {
      console.error("Erreur lors de la synchronisation:", err);
      toast.error("Erreur de synchronisation des données SportMonks");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Layout>
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Matchs en Direct</CardTitle>
              <CardDescription>
                Sélectionnez un match pour créer un pari duo
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={syncSportMonksData}
              disabled={syncing}
            >
              {syncing ? "Synchronisation..." : "Synchroniser les données"}
            </Button>
          </CardHeader>
          <CardContent>
            <LiveMatches 
              selectedDate={selectedDate} 
              onDateChange={handleDateChange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes Paris Duo</CardTitle>
            <CardDescription>
              Vos paris en cours et leur statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BetsList selectedDate={selectedDate} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

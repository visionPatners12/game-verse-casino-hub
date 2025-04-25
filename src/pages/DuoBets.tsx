
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { LiveMatches } from "@/components/duobets/LiveMatches";
import { BetsList } from "@/components/duobets/BetsList";
import { useEffect, useState } from "react";
import { useSportMonksData } from "@/hooks/useSportMonksData";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";

export default function DuoBets() {
  const { error: matchesError } = useSportMonksData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [syncing, setSyncing] = useState(false);
  const [settling, setSettling] = useState(false);

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

  const checkBetSettlements = async () => {
    try {
      setSettling(true);
      toast.info("Vérification des résultats des paris en cours...");
      
      const { data, error } = await supabase.functions.invoke('settle-duo-bets');
      
      if (error) throw error;
      
      if (data?.settled_bets?.length > 0) {
        toast.success(`${data.settled_bets.length} paris ont été réglés!`);
      } else {
        toast.info("Aucun pari à régler pour le moment");
      }
    } catch (err) {
      console.error("Erreur lors du règlement des paris:", err);
      toast.error("Erreur lors de la vérification des résultats");
    } finally {
      setSettling(false);
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
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={syncSportMonksData}
                disabled={syncing}
              >
                {syncing ? "Synchronisation..." : "Synchroniser les données"}
              </Button>
              <Button
                variant="outline"
                onClick={checkBetSettlements}
                disabled={settling}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${settling ? 'animate-spin' : ''}`} />
                Vérifier les Résultats
              </Button>
            </div>
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

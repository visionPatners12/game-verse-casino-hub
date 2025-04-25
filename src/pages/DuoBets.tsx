
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { LiveMatches } from "@/components/duobets/LiveMatches";
import { BetsList } from "@/components/duobets/BetsList";
import { useEffect, useState } from "react";
import { useSportMonksData } from "@/hooks/useSportMonksData";
import { toast } from "sonner";
import { DateFilter } from "@/components/duobets/components/DateFilter";

export default function DuoBets() {
  const { error: matchesError } = useSportMonksData();
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (matchesError) {
      console.error("Error loading matches:", matchesError);
      toast.error("Impossible de charger les matchs du jour");
    }
  }, [matchesError]);

  return (
    <Layout>
      <div className="grid gap-6">
        <DateFilter 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Matchs en Direct</CardTitle>
            <CardDescription>
              Sélectionnez un match pour créer un pari duo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LiveMatches />
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


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { LiveMatches } from "@/components/duobets/LiveMatches";
import { BetsList } from "@/components/duobets/BetsList";
import { useEffect, useState } from "react";
import { useSportMonksData } from "@/hooks/useSportMonksData";
import { toast } from "sonner";

export default function DuoBets() {
  const { error: matchesError } = useSportMonksData();
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (matchesError) {
      console.error("Error loading matches:", matchesError);
      toast.error("Impossible de charger les matchs du jour");
    }
  }, [matchesError]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <Layout>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Matchs en Direct</CardTitle>
            <CardDescription>
              Sélectionnez un match pour créer un pari duo
            </CardDescription>
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


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { LiveMatches } from "@/components/duobets/LiveMatches";
import { BetsList } from "@/components/duobets/BetsList";
import { useEffect } from "react";
import { useSportMonksData } from "@/hooks/useSportMonksData";
import { toast } from "sonner";

export default function DuoBets() {
  const { error: matchesError } = useSportMonksData();

  useEffect(() => {
    if (matchesError) {
      console.error("Error loading matches:", matchesError);
      toast.error("Impossible de charger les matchs du jour");
    }
  }, [matchesError]);

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
            <BetsList />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

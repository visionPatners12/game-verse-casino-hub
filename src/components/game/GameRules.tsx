
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GameCode } from "@/lib/gameTypes";
import { FileText, Clock, Users, Gamepad } from "lucide-react";

interface GameRulesProps {
  gameType: string;
  matchSettings?: {
    halfLengthMinutes?: number;
    legacyDefending?: boolean;
    customFormations?: boolean;
    platform?: string;
    mode?: string;
    teamType?: string;
  };
}

export const GameRules = ({ gameType, matchSettings }: GameRulesProps) => {
  if (gameType !== "futarena" && gameType !== "eafc25") {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          EA FC 25 - Règles du jeu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-16rem)] rounded-md pr-4">
          <div className="space-y-4">
            {matchSettings && (
              <>
                <section>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Configuration du match
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Durée mi-temps : {matchSettings.halfLengthMinutes} minutes</li>
                    <li>• Legacy Defending : {matchSettings.legacyDefending ? "Activé" : "Désactivé"}</li>
                    <li>• Formations personnalisées : {matchSettings.customFormations ? "Autorisées" : "Non autorisées"}</li>
                  </ul>
                </section>

                <Separator />

                <section>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Gamepad className="h-4 w-4" />
                    Mode de jeu
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Plateforme : {matchSettings.platform}</li>
                    <li>• Mode : {matchSettings.mode}</li>
                    <li>• Type d'équipes : {matchSettings.teamType}</li>
                  </ul>
                </section>

                <Separator />
              </>
            )}

            <section>
              <h3 className="font-semibold mb-2">⚔️ Règles de jeu</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Online Squads uniquement</li>
                <li>• L'utilisation de Custom Squads ou de joueurs modifiés entraînera la perte automatique du match</li>
                <li className="text-red-500">Interdits: Club Only, National Only, 85 Rated</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

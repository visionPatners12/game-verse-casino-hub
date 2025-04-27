
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { GameCode } from "@/lib/gameTypes";

interface GameRulesProps {
  gameType: string;
}

export const GameRules = ({ gameType }: GameRulesProps) => {
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

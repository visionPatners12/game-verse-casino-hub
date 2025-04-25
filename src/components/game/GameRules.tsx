
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GameCode } from "@/lib/gameTypes";
import { FileText } from "lucide-react";

interface GameRulesProps {
  gameType: string;
}

export const GameRules = ({ gameType }: GameRulesProps) => {
  if (gameType !== "futarena") {
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
              <h3 className="font-semibold mb-2">🎮 Mode de jeu</h3>
              <p className="text-sm text-muted-foreground">
                Online Squads uniquement. L'utilisation de Custom Squads ou de joueurs modifiés 
                entraînera la perte automatique du match.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="font-semibold mb-2">⚔️ Configuration du match</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Durée mi-temps : 5 minutes</li>
                <li>• Legacy Defending : Désactivé</li>
                <li>• Formations personnalisées : Non autorisées (sauf accord)</li>
                <li>• Type d'équipes : Any Teams</li>
                <li className="text-red-500">Interdits: Club Only, National Only, 85 Rated</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="font-semibold mb-2">🌍 Plateforme</h3>
              <p className="text-sm text-muted-foreground">
                Next-Gen Cross-play (PS5 / Xbox Series X|S) uniquement
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="font-semibold mb-2">⚠️ Validation des scores</h3>
              <p className="text-sm text-muted-foreground">
                La confirmation manuelle du score est requise. En cas de litige, 
                des captures d'écran ou vidéos des paramètres et du score seront nécessaires.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="font-semibold mb-2 text-yellow-500">⚠️ Message important</h3>
              <div className="text-sm text-muted-foreground space-y-2 bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                <p className="font-medium">Avant de commencer le match, vérifiez :</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Mode Online Squads activé</li>
                  <li>Legacy Defending désactivé</li>
                  <li>Aucune Custom Squad/joueurs modifiés</li>
                  <li>Formations personnalisées non utilisées</li>
                  <li>Durée : 5 minutes par mi-temps</li>
                  <li>Type d'équipe : Any Teams</li>
                </ul>
                <p className="mt-2 italic">
                  En cas de non-conformité, ne commencez pas le match et prenez 
                  immédiatement une capture d'écran.
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WelcomeMessageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WelcomeMessage = ({ open, onOpenChange }: WelcomeMessageProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>👋 Bienvenue dans la room EA FC 25 !</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <div className="space-y-4 p-2">
            <div className="text-yellow-500 font-semibold">
              ⚠️ Merci de bien vouloir vérifier les paramètres de votre adversaire avant de commencer
            </div>

            <div className="space-y-2">
              <div className="font-semibold">✅ Checklist à confirmer AVANT le coup d'envoi :</div>
              <ul className="space-y-2 text-muted-foreground">
                <li>🎮 Mode de jeu : le match est bien en Online Squads</li>
                <li>🚫 Legacy Defending est désactivé</li>
                <li>🛑 Aucune Custom Squad ou joueurs modifiés ne sont utilisés</li>
                <li>📐 Formations personnalisées interdites (sauf accord clair entre joueurs)</li>
                <li>⌛ Durée d'une mi-temps : 5 minutes</li>
                <li>🧑‍🤝‍🧑 Type d'équipe sélectionné = Any Teams</li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-red-500">⚠️ Types d'équipes interdits :</div>
              <ul className="text-red-400 pl-4">
                <li>• 85 Rated</li>
                <li>• Club Only</li>
                <li>• National Only</li>
              </ul>
            </div>

            <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20 mt-4">
              <div className="font-medium">🎥 Recommandations importantes :</div>
              <ul className="space-y-2 mt-2 text-sm">
                <li>• Filmez les écrans de paramètres et le score en cas de litige</li>
                <li>• Si une non-conformité est constatée, n'acceptez pas le match</li>
                <li>• Prenez une preuve vidéo ou capture immédiatement en cas de problème</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};


import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

export const RulesDialog = ({ open, onOpenChange, onAccept }: RulesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>👋 Règles de la room EA FC 25</DialogTitle>
          <DialogDescription>
            Veuillez lire et accepter les règles avant de créer une room
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh]">
          <div className="space-y-4 p-2">
            <div className="text-yellow-500 font-semibold">
              ⚠️ Vérifiez bien les paramètres de jeu suivants
            </div>

            <div className="space-y-2">
              <div className="font-semibold">✅ Paramètres obligatoires :</div>
              <ul className="space-y-2 text-muted-foreground">
                <li>🎮 Mode de jeu : Online Squads uniquement</li>
                <li>🚫 Legacy Defending : Désactivé</li>
                <li>🛑 Custom Squad/joueurs modifiés : Interdits</li>
                <li>📐 Formations personnalisées : Non autorisées (sauf accord)</li>
                <li>⌛ Durée mi-temps : 5 minutes</li>
                <li>🧑‍🤝‍🧑 Type d'équipe : Any Teams</li>
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

        <DialogFooter>
          <Button onClick={onAccept}>J'accepte les règles</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

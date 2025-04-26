
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
          <DialogTitle>👋 Règles des matchs</DialogTitle>
          <DialogDescription>
            Veuillez lire et accepter les règles avant de créer une room
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh]">
          <div className="space-y-4 p-4">
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                Si vous recevez une invitation sur votre console qui ne correspond pas aux règles énoncées sur cette page de match, 
                NE JOUEZ PAS le match. Si vous jouez le match, perdez et soumettez une contestation, les administrateurs de Katchicka 
                n'approuveront pas votre contestation. Chez Katchicka, nous privilégions le fair-play, avant de prendre toute décision, 
                nous examinerons et pencherons vers une décision équitable qui nous appartient strictement.
              </p>

              <p>
                Nous recommandons vivement d'enregistrer tous les résultats de match, déconnexions, règles enfreintes, etc.
              </p>

              <div className="space-y-2">
                <p>
                  Si un joueur enfreint une règle lorsqu'il perd le match ou que le match est à égalité et que son adversaire 
                  quitte immédiatement le match, le joueur qui a enfreint la règle perdra le match.
                </p>
                
                <p>
                  Si un joueur enfreint une règle lorsqu'il mène et que son adversaire quitte immédiatement le match, 
                  le match sera annulé et les deux joueurs seront remboursés de leurs frais d'inscription.
                </p>
              </div>

              <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                <p className="font-semibold mb-2">⚠️ Identifiants de jeu:</p>
                <p>
                  Ce match n'est valable que s'il est joué entre les identifiants listés ci-dessus. 
                  Si vous acceptez de jouer tout le match et perdez, puis contestez - votre contestation 
                  ne sera pas prise en considération.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-medium">
                  Score Auto-Confirmé Après 10 Minutes:
                </p>
                <p>
                  Une fois qu'un score est rapporté, l'autre joueur dispose de 10 minutes pour confirmer 
                  ou contester avant que le premier score rapporté ne soit automatiquement confirmé.
                </p>
              </div>

              <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <p className="font-semibold text-red-500 mb-2">⚠️ Avertissement:</p>
                <p>
                  La soumission de résultats faux ou falsifiés entraînera des pénalités financières immédiates.
                </p>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>1ère infraction = 5€</li>
                  <li>2ème infraction = 25€</li>
                  <li>3ème infraction = Suppression de 100% du solde + Bannissement</li>
                </ul>
              </div>

              <p>
                Tout match nécessitant plusieurs parties doit être prêt à jouer dans les 15 minutes 
                suivant la dernière partie. Le non-respect de cette règle entraînera un forfait.
              </p>

              <p className="text-xs text-muted-foreground mt-4">
                Katchicka n'est ni approuvé par, ni directement affilié à, ni maintenu ou sponsorisé 
                par Apple Inc, Electronic Arts, Activision Blizzard, Take-Two Interactive, Microsoft, 
                Xbox, Sony, Playstation ou Epic Games. Tous les contenus, titres de jeux, noms 
                commerciaux et/ou habillages commerciaux, marques déposées, illustrations et images 
                associées sont des marques déposées et/ou des documents protégés par le droit d'auteur 
                de leurs propriétaires respectifs.
              </p>
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



import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GameCode } from "@/lib/gameTypes";
import { FileText } from "lucide-react";

interface GameRulesProps {
  gameType: GameCode;
}

export const GameRules = ({ gameType }: GameRulesProps) => {
  if (gameType !== "futarena" && !gameType.includes("2k") && !gameType.includes("madden")) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Game Rules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] rounded-md pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold mb-2">Disconnections</h3>
              <p className="text-sm text-muted-foreground">
                In the event of a disconnection, players must finish the remaining time of the match, 
                keeping the score the same as it was in the game that got disconnected. When the final minute 
                is reached, the match ends when the ball is out of play.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="font-semibold mb-2">Online Squads Only</h3>
              <p className="text-sm text-muted-foreground">
                Matches must be played with 'Online Squads' only. Using Custom Squads or edited players 
                will result in automatic match forfeit.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="font-semibold mb-2">Custom Formations</h3>
              <p className="text-sm text-muted-foreground">
                Custom Formations are not allowed unless agreed upon by all players. Disputes require video evidence.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="font-semibold mb-2">Drawing/Tying a Match</h3>
              <p className="text-sm text-muted-foreground">
                If the match ends in a draw, a new game must be played under Golden Goal rules. First to score wins. 
                If no goal is scored, players can choose to cancel or continue.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="font-semibold mb-2">Legacy Defending</h3>
              <p className="text-sm text-muted-foreground">
                Legacy Defending is not allowed. Disputes require video evidence for consideration.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="font-semibold mb-2">Lag/Settings/Teams</h3>
              <p className="text-sm text-muted-foreground">
                Complaints about lag, pre-game settings, or banned teams must be made within the first minute 
                of gameplay. Using a LAN cable is recommended for better connection.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h3 className="font-semibold mb-2">Score Confirmation</h3>
              <p className="text-sm text-muted-foreground">
                Once a score is reported, the other player has 10 minutes to confirm or counter before the 
                first score is automatically confirmed.
              </p>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};


import { Clock, GamepadIcon } from "lucide-react";

interface GameSettingsProps {
  halfLengthMinutes?: number;
  legacyDefendingAllowed?: boolean;
  customFormationsAllowed?: boolean;
  platform?: string;
  mode?: string;
  teamType?: string;
}

export function GameSettings({
  halfLengthMinutes,
  legacyDefendingAllowed,
  customFormationsAllowed,
  platform,
  mode,
  teamType
}: GameSettingsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" /> Paramètres de jeu
          </h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>Durée mi-temps: {halfLengthMinutes} minutes</li>
            <li>Legacy Defending: {legacyDefendingAllowed ? "Activé" : "Désactivé"}</li>
            <li>Formations personnalisées: {customFormationsAllowed ? "Autorisées" : "Non autorisées"}</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <GamepadIcon className="h-4 w-4" /> Configuration
          </h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>Plateforme: {platform || "PS5"}</li>
            <li>Mode de jeu: {mode || "Online Friendlies"}</li>
            <li>Type d'équipes: {teamType || "Any Teams"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

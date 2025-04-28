
import { Clock, GamepadIcon } from "lucide-react";
import { GamePlatform, GameMode, TeamType } from "@/types/futarena";

interface GameSettingsProps {
  halfLengthMinutes?: number;
  legacyDefendingAllowed?: boolean;
  customFormationsAllowed?: boolean;
  platform?: GamePlatform | string;
  mode?: GameMode | string;
  teamType?: TeamType | string;
  gamerTag?: string;
}

// Helper function to format platform display
const formatPlatform = (platform?: string): string => {
  switch (platform) {
    case 'ps5': return 'PlayStation 5';
    case 'xbox_series': return 'Xbox Series X/S';
    case 'cross_play': return 'Cross-play';
    default: return platform || 'Non spécifié';
  }
};

// Helper function to format mode display
const formatMode = (mode?: string): string => {
  switch (mode) {
    case 'online_friendlies': return 'Matchs amicaux en ligne';
    case 'fut': return 'FUT (Ultimate Team)';
    default: return mode || 'Non spécifié';
  }
};

// Helper function to format team type display
const formatTeamType = (teamType?: string): string => {
  switch (teamType) {
    case 'any_teams': return 'Toutes équipes';
    case '85_rated': return 'Équipes 85 OVR';
    case 'country': return 'Équipes nationales';
    case 'fut_team': return 'Équipe FUT';
    default: return teamType || 'Non spécifié';
  }
};

// Helper function to determine gamer tag type label based on platform
const getGamerTagTypeLabel = (platform?: string): string => {
  switch (platform) {
    case 'ps5': return 'PSN Username';
    case 'xbox_series': return 'Xbox Gamertag';
    case 'cross_play': 
    default: return 'EA ID';
  }
};

export function GameSettings({
  halfLengthMinutes,
  legacyDefendingAllowed,
  customFormationsAllowed,
  platform,
  mode,
  teamType,
  gamerTag,
}: GameSettingsProps) {
  const gamerTagType = getGamerTagTypeLabel(platform as string);
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" /> Paramètres de jeu
          </h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>Durée mi-temps: {halfLengthMinutes || 0} minutes</li>
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
            <li>Plateforme: {formatPlatform(platform)}</li>
            <li>Mode de jeu: {formatMode(mode)}</li>
            <li>Type d'équipes: {formatTeamType(teamType)}</li>
            {gamerTag && <li>{gamerTagType}: <span className="font-mono">{gamerTag}</span></li>}
          </ul>
        </div>
      </div>
    </div>
  );
}


import { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GamePlatform, GameMode, TeamType } from "@/types/futarena";

interface FutArenaGameSettingsProps {
  onSettingsChange: (settings: {
    platform: GamePlatform;
    mode: GameMode;
    team_type: TeamType;
    legacy_defending_allowed: boolean;
    custom_formations_allowed: boolean;
  }) => void;
}

export const FutArenaGameSettings = ({ onSettingsChange }: FutArenaGameSettingsProps) => {
  const [settings, setSettings] = useState({
    platform: 'ps5' as GamePlatform,
    mode: 'online_friendlies' as GameMode,
    team_type: 'any_teams' as TeamType,
    legacy_defending_allowed: false,
    custom_formations_allowed: false
  });

  const updateSettings = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Plateforme</Label>
        <Select
          value={settings.platform}
          onValueChange={(value: GamePlatform) => updateSettings('platform', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une plateforme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ps5">PS5</SelectItem>
            <SelectItem value="xbox_series">Xbox Series X</SelectItem>
            <SelectItem value="cross_play">Cross-play</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Mode de jeu</Label>
        <Select
          value={settings.mode}
          onValueChange={(value: GameMode) => updateSettings('mode', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="online_friendlies">Online Friendlies</SelectItem>
            <SelectItem value="fut">FUT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Type d'équipes</Label>
        <Select
          value={settings.team_type}
          onValueChange={(value: TeamType) => updateSettings('team_type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any_teams">Any Teams</SelectItem>
            <SelectItem value="85_rated">85 Rated</SelectItem>
            <SelectItem value="country">Country</SelectItem>
            <SelectItem value="fut_team">FUT Team</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <Label>Legacy Defending</Label>
        <Switch
          checked={settings.legacy_defending_allowed}
          onCheckedChange={(checked) => updateSettings('legacy_defending_allowed', checked)}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <Label>Formations personnalisées</Label>
        <Switch
          checked={settings.custom_formations_allowed}
          onCheckedChange={(checked) => updateSettings('custom_formations_allowed', checked)}
        />
      </div>
    </div>
  );
};

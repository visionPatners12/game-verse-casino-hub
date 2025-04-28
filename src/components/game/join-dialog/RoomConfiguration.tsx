
import { GamePlatform, GameMode, TeamType } from "@/types/futarena";
import { GameSettings } from "@/components/game/join-dialog/GameSettings";
import { Separator } from "@/components/ui/separator";
import { PlatformRules } from "@/components/game/join-dialog/PlatformRules";
import { DisclaimerSection } from "@/components/game/join-dialog/DisclaimerSection";
import { HostInfoCard } from "@/components/games/HostInfoCard";

interface RoomConfigurationProps {
  gameSettings: {
    halfLengthMinutes: number;
    legacyDefendingAllowed: boolean;
    customFormationsAllowed: boolean;
    platform: GamePlatform;
    mode: GameMode;
    teamType: TeamType;
    gamerTag?: string;
  } | null;
  hostData: {
    username: string;
    avatar_url: string | null;
    gamer_tag: string;
    gamer_tag_type: string;
  } | null;
  isFutArena: boolean;
}

export function RoomConfiguration({ gameSettings, hostData, isFutArena }: RoomConfigurationProps) {
  console.log("RoomConfiguration rendering with:", { gameSettings, hostData, isFutArena });
  
  return (
    <div className="space-y-6">
      {isFutArena && hostData && (
        <section>
          <h3 className="font-semibold text-lg mb-4 text-casino-accent">Informations du créateur</h3>
          <HostInfoCard 
            hostUsername={hostData.username}
            hostAvatar={hostData.avatar_url}
            gamerTag={hostData.gamer_tag}
            gamerTagType={hostData.gamer_tag_type}
          />
          <p className="text-sm text-muted-foreground mt-2 italic">
            Pour commencer le match, envoyez une invitation à l'ID {hostData.gamer_tag_type} du créateur
          </p>
        </section>
      )}

      <Separator className="bg-casino-accent/20" />

      <section>
        <h3 className="text-lg font-semibold mb-4 text-casino-accent">Configuration du match</h3>
        {gameSettings ? (
          <GameSettings
            halfLengthMinutes={gameSettings.halfLengthMinutes}
            legacyDefendingAllowed={gameSettings.legacyDefendingAllowed}
            customFormationsAllowed={gameSettings.customFormationsAllowed}
            platform={gameSettings.platform}
            mode={gameSettings.mode}
            teamType={gameSettings.teamType}
            gamerTag={gameSettings.gamerTag}
          />
        ) : (
          <p className="text-muted-foreground">Aucune configuration disponible</p>
        )}
      </section>

      <Separator className="bg-casino-accent/20" />

      <PlatformRules />

      <Separator className="bg-casino-accent/20" />

      <DisclaimerSection />
    </div>
  );
}

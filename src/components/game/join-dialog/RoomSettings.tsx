
import { GameSettings } from "@/components/game/join-dialog/GameSettings";

interface RoomSettingsProps {
  halfLengthMinutes?: number;
  legacyDefendingAllowed?: boolean;
  customFormationsAllowed?: boolean;
  platform?: string;
  mode?: string;
  teamType?: string;
}

export const RoomSettings = ({
  halfLengthMinutes,
  legacyDefendingAllowed,
  customFormationsAllowed,
  platform,
  mode,
  teamType
}: RoomSettingsProps) => {
  return (
    <section>
      <h3 className="text-lg font-semibold mb-4 text-casino-accent">Configuration du match</h3>
      <GameSettings
        halfLengthMinutes={halfLengthMinutes}
        legacyDefendingAllowed={legacyDefendingAllowed}
        customFormationsAllowed={customFormationsAllowed}
        platform={platform}
        mode={mode}
        teamType={teamType}
      />
    </section>
  );
};

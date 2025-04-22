
import { PresenceData } from "@/components/game/types";

export class RoomPresenceManager {
  private lastPresenceStates: Record<string, PresenceData> = {};

  updatePresenceState(roomId: string, channel: any, presenceData: PresenceData) {
    this.lastPresenceStates[roomId] = presenceData;
    return channel?.track(presenceData);
  }

  getLastPresenceState(roomId: string) {
    return this.lastPresenceStates[roomId];
  }

  clearPresenceState(roomId: string) {
    delete this.lastPresenceStates[roomId];
  }
}

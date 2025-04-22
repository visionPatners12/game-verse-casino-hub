
import { PresenceData } from "@/components/game/types";

export class RoomPresenceManager {
  private lastPresenceStates: Record<string, PresenceData> = {};
  private subscribedRooms: Set<string> = new Set();

  updatePresenceState(roomId: string, channel: any, presenceData: PresenceData) {
    this.lastPresenceStates[roomId] = presenceData;
    
    if (!channel) {
      console.warn(`Cannot track presence: no channel for room ${roomId}`);
      return Promise.resolve(null);
    }
    
    return new Promise((resolve, reject) => {
      try {
        // Check if the room is subscribed before tracking presence
        if (!this.subscribedRooms.has(roomId)) {
          console.warn(`Cannot track presence: room ${roomId} not subscribed yet`);
          resolve(null);
          return;
        }
        
        const result = channel.track(presenceData);
        resolve(result);
      } catch (error) {
        console.error(`Error tracking presence in room ${roomId}:`, error);
        reject(error);
      }
    });
  }

  markRoomSubscribed(roomId: string) {
    this.subscribedRooms.add(roomId);
  }

  isRoomSubscribed(roomId: string): boolean {
    return this.subscribedRooms.has(roomId);
  }

  getLastPresenceState(roomId: string) {
    return this.lastPresenceStates[roomId];
  }

  clearPresenceState(roomId: string) {
    console.log(`Clearing presence state for room ${roomId}`);
    delete this.lastPresenceStates[roomId];
    this.subscribedRooms.delete(roomId);
  }
}

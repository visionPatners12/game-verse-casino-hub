
import { PresenceData } from "@/components/game/types";

export class RoomPresenceManager {
  private lastPresenceStates: Record<string, PresenceData> = {};
  private subscribedRooms: Set<string> = new Set();
  private pendingPresenceUpdates: Record<string, PresenceData> = {};

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
          console.warn(`Cannot track presence: room ${roomId} not subscribed yet, storing for later`);
          // Store the presence update to be applied when the room is subscribed
          this.pendingPresenceUpdates[roomId] = presenceData;
          resolve(null);
          return;
        }
        
        // Try to track the presence
        console.log(`Tracking presence for user ${presenceData.user_id} in room ${roomId}`);
        const result = channel.track(presenceData);
        resolve(result);
      } catch (error) {
        console.error(`Error tracking presence in room ${roomId}:`, error);
        reject(error);
      }
    });
  }

  markRoomSubscribed(roomId: string) {
    console.log(`Room ${roomId} marked as subscribed for presence tracking`);
    this.subscribedRooms.add(roomId);
    
    // Check if there are any pending presence updates for this room
    if (this.pendingPresenceUpdates[roomId]) {
      console.log(`Applying pending presence update for room ${roomId}`);
      // We don't actually apply it here - this would need to be handled by the caller
    }
  }

  isRoomSubscribed(roomId: string): boolean {
    return this.subscribedRooms.has(roomId);
  }

  getLastPresenceState(roomId: string) {
    return this.lastPresenceStates[roomId];
  }

  getPendingPresenceUpdate(roomId: string) {
    return this.pendingPresenceUpdates[roomId];
  }

  clearPendingPresenceUpdate(roomId: string) {
    delete this.pendingPresenceUpdates[roomId];
  }

  clearPresenceState(roomId: string) {
    console.log(`Clearing presence state for room ${roomId}`);
    delete this.lastPresenceStates[roomId];
    delete this.pendingPresenceUpdates[roomId];
    this.subscribedRooms.delete(roomId);
  }
}

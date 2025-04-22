
import { RoomChannelsManager } from "./channels/RoomChannelsManager";
import { RoomPresenceManager } from "./presence/RoomPresenceManager";
import { WebSocketBase } from "./WebSocketBase";
import { PresenceData } from "@/components/game/types";

export class RoomWebSocketService extends WebSocketBase {
  private channelsManager: RoomChannelsManager;
  private presenceManager: RoomPresenceManager;

  constructor() {
    super();
    this.channelsManager = new RoomChannelsManager();
    this.presenceManager = new RoomPresenceManager();
  }

  connectToRoom(roomId: string, userId: string | null, gameType?: string) {
    if (!roomId || !userId) {
      console.warn("Cannot connect to room - missing roomId or userId");
      return null;
    }
    
    const roomChannel = this.channelsManager.setupChannel(roomId, userId);
    return roomChannel;
  }

  getChannel(roomId: string) {
    return this.channelsManager.getChannel(roomId);
  }

  cleanupChannel(roomId: string) {
    this.channelsManager.cleanupChannel(roomId);
    this.presenceManager.clearPresenceState(roomId);
  }

  updatePresenceState(roomId: string, presenceData: PresenceData) {
    const channel = this.channelsManager.getChannel(roomId);
    return this.presenceManager.updatePresenceState(roomId, channel, presenceData);
  }

  getLastPresenceState(roomId: string) {
    return this.presenceManager.getLastPresenceState(roomId);
  }
}

export const roomService = new RoomWebSocketService();

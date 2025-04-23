import { RoomChannelsManager } from "./channels/RoomChannelsManager";
import { RoomPresenceManager } from "./presence/RoomPresenceManager";
import { WebSocketBase } from "./WebSocketBase";
import { PresenceData } from "@/components/game/types";
import { GameStateService } from "../game/GameStateService";
import { RoomPresenceService } from "../presence/RoomPresenceService";
import { RoomConnectionStorage } from "../RoomConnectionStorage";
import { RoomWebSocketConnection } from "./RoomWebSocketConnection";

export class RoomWebSocketService extends WebSocketBase {
  private channelsManager: RoomChannelsManager;
  private presenceManager: RoomPresenceManager;
  private gameStateService: GameStateService;
  private presenceService: RoomPresenceService;
  private connectionStorage: RoomConnectionStorage;
  private roomConnection: RoomWebSocketConnection;

  constructor() {
    super();
    this.channelsManager = new RoomChannelsManager();
    this.presenceManager = new RoomPresenceManager();
    this.gameStateService = new GameStateService();
    this.presenceService = new RoomPresenceService();
    this.connectionStorage = new RoomConnectionStorage();
    this.roomConnection = new RoomWebSocketConnection();
  }

  connectToRoom(roomId: string, userId: string | null, gameType?: string) {
    if (!roomId || !userId) {
      console.warn("Cannot connect to room - missing roomId or userId");
      return null;
    }
    
    const roomChannel = this.roomConnection.setupChannel(roomId, userId, gameType);
    
    // Mark player as connected in the database, but don't depend on the channel being ready
    if (roomId && userId) {
      this.presenceService.markPlayerConnected(roomId, userId);
    }
    
    return roomChannel;
  }

  async disconnectFromRoom(roomId: string, userId: string | null) {
    if (!roomId || !userId) {
      console.warn("Cannot disconnect from room - missing roomId or userId");
      return;
    }
    
    console.log(`Disconnecting from room ${roomId} for user ${userId}`);
    
    // Clear active room storage first - importante étape de nettoyage
    this.connectionStorage.clear();
    
    try {
      // Mark player as disconnected in the database
      await this.presenceService.markPlayerDisconnected(roomId, userId);
      console.log(`Player ${userId} marked as disconnected in database for room ${roomId}`);
      
      // Clean up channel and presence data
      await this.cleanupChannel(roomId);
      
      // Mise à jour supplémentaire pour s'assurer que active_room_id est null
      try {
        const { error } = await supabase
          .from('users')
          .update({ active_room_id: null })
          .eq('id', userId);
        
        if (error) {
          console.error(`Error updating active_room_id for user ${userId}:`, error);
        } else {
          console.log(`Successfully cleared active_room_id for user ${userId}`);
        }
      } catch (e) {
        console.error(`Error in additional active_room_id update:`, e);
      }
      
      console.log(`Successfully disconnected from room ${roomId}`);
    } catch (error) {
      console.error(`Error during disconnection from room ${roomId}:`, error);
      // Still consider disconnection successful even if there's an error
      // since we've already cleared the storage
    }
  }

  getChannel(roomId: string) {
    return this.roomConnection.getChannel(roomId);
  }

  async cleanupChannel(roomId: string) {
    console.log(`Cleaning up channel for room ${roomId}`);
    try {
      await this.roomConnection.cleanupChannel(roomId);
      this.presenceManager.clearPresenceState(roomId);
      console.log(`Channel cleanup completed for room ${roomId}`);
    } catch (error) {
      console.error(`Error cleaning up channel for room ${roomId}:`, error);
      // Continue with the disconnect flow even if channel cleanup fails
    }
  }

  updatePresenceState(roomId: string, presenceData: PresenceData) {
    return this.roomConnection.updatePresenceState(roomId, presenceData);
  }

  getLastPresenceState(roomId: string) {
    return this.roomConnection.getLastPresenceState(roomId);
  }

  // Room connection storage methods
  saveActiveRoomToStorage(roomId: string, userId: string, gameType?: string) {
    this.connectionStorage.save(roomId, userId, gameType);
  }

  getStoredRoomConnection() {
    return this.connectionStorage.getStored();
  }

  // Game state methods
  async startGame(roomId: string) {
    const channel = this.getChannel(roomId);
    return this.gameStateService.startGame(roomId, channel);
  }

  async endGame(roomId: string, results: any) {
    const channel = this.getChannel(roomId);
    return this.gameStateService.endGame(roomId, results, channel);
  }

  broadcastMove(roomId: string, moveData: any) {
    const channel = this.getChannel(roomId);
    this.gameStateService.broadcastMove(roomId, moveData, channel);
  }

  // Player presence methods
  async markPlayerReady(roomId: string, userId: string, isReady: boolean = true) {
    const channel = this.getChannel(roomId);
    return this.presenceService.markPlayerReady(roomId, userId, isReady, channel);
  }
}

export const roomService = new RoomWebSocketService();

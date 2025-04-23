import { RoomChannelsManager } from "./channels/RoomChannelsManager";
import { RoomPresenceManager } from "./presence/RoomPresenceManager";
import { WebSocketBase } from "./WebSocketBase";
import { PresenceData } from "@/components/game/types";
import { GameStateService } from "../game/GameStateService";
import { RoomPresenceService } from "../presence/RoomPresenceService";
import { RoomConnectionStorage } from "../RoomConnectionStorage";
import { RoomWebSocketConnection } from "./RoomWebSocketConnection";
import { supabase } from "@/integrations/supabase/client";

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
    
    // Mark player as connected in the database with comprehensive error handling
    if (roomId && userId) {
      this.connectWithRetry(roomId, userId);
    }
    
    return roomChannel;
  }

  private async connectWithRetry(roomId: string, userId: string, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.presenceService.markPlayerConnected(roomId, userId);
        console.log(`Successfully connected player ${userId} to room ${roomId} on attempt ${attempt}`);
        return;
      } catch (error) {
        console.error(`Connection attempt ${attempt} failed:`, error);
        if (attempt === retries) {
          console.error("Max retries reached, connection failed");
          throw error;
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  private async updateActiveRoomId(roomId: string, userId: string) {
    try {
      console.log(`Setting active_room_id=${roomId} for user ${userId}`);
      const { error } = await supabase
        .from('users')
        .update({ active_room_id: roomId })
        .eq('id', userId);
        
      if (error) {
        console.error(`Error updating active_room_id: ${error.message}`);
      } else {
        console.log(`Successfully set active_room_id=${roomId} for user ${userId}`);
      }
    } catch (error) {
      console.error("Failed to update active_room_id:", error);
    }
  }

  async disconnectFromRoom(roomId: string, userId: string | null) {
    if (!roomId || !userId) {
      console.warn("Cannot disconnect from room - missing roomId or userId");
      return;
    }
    
    console.log(`Disconnecting from room ${roomId} for user ${userId}`);
    
    // Clear active room storage first
    this.connectionStorage.save("", "", "");
    this.connectionStorage.clear();
    
    try {
      // Mark player as disconnected with retries
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const { error } = await supabase
            .from('game_players')
            .update({ is_connected: false })
            .eq('session_id', roomId)
            .eq('user_id', userId);
            
          if (!error) {
            console.log(`Successfully marked player ${userId} as disconnected from room ${roomId}`);
            break;
          }
          
          if (attempt === 3) {
            console.error(`Failed to mark player as disconnected after 3 attempts:`, error);
          }
        } catch (error) {
          console.error(`Attempt ${attempt} to mark player as disconnected failed:`, error);
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }
      
      // Update user's active_room_id with retries
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const { error } = await supabase
            .from('users')
            .update({ active_room_id: null })
            .eq('id', userId);
            
          if (!error) {
            console.log(`Successfully cleared active_room_id for user ${userId}`);
            break;
          }
          
          if (attempt === 3) {
            console.error(`Failed to clear active_room_id after 3 attempts:`, error);
          }
        } catch (error) {
          console.error(`Attempt ${attempt} to clear active_room_id failed:`, error);
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }
      
      // Clean up channel and presence data
      await this.cleanupChannel(roomId);
      
      console.log(`Successfully disconnected from room ${roomId}`);
    } catch (error) {
      console.error(`Error during disconnection from room ${roomId}:`, error);
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

  saveActiveRoomToStorage(roomId: string, userId: string, gameType?: string) {
    this.connectionStorage.save(roomId, userId, gameType);
  }

  getStoredRoomConnection() {
    return this.connectionStorage.getStored();
  }

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

  async markPlayerReady(roomId: string, userId: string, isReady: boolean = true) {
    const channel = this.getChannel(roomId);
    return this.presenceService.markPlayerReady(roomId, userId, isReady, channel);
  }
}

export const roomService = new RoomWebSocketService();

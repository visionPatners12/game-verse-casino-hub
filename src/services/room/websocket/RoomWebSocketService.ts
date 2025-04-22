
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

  disconnectFromRoom(roomId: string, userId: string | null) {
    if (!roomId || !userId) {
      console.warn("Cannot disconnect from room - missing roomId or userId");
      return;
    }
    
    console.log(`Disconnecting from room ${roomId} for user ${userId}`);
    
    // Clear active room storage first
    this.connectionStorage.save("", "", "");
    
    // Mark player as disconnected in the database
    this.presenceService.markPlayerDisconnected(roomId, userId);
    
    // Clean up channel and presence data
    this.cleanupChannel(roomId);
    
    console.log(`Successfully disconnected from room ${roomId}`);
  }

  getChannel(roomId: string) {
    return this.roomConnection.getChannel(roomId);
  }

  cleanupChannel(roomId: string) {
    console.log(`Cleaning up channel for room ${roomId}`);
    this.roomConnection.cleanupChannel(roomId);
    this.presenceManager.clearPresenceState(roomId);
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

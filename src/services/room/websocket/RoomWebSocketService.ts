
import { RoomChannelsManager } from "./channels/RoomChannelsManager";
import { RoomPresenceManager } from "./presence/RoomPresenceManager";
import { WebSocketBase } from "./WebSocketBase";
import { PresenceData } from "@/components/game/types";
import { GameStateService } from "../game/GameStateService";
import { RoomPresenceService } from "../presence/RoomPresenceService";
import { RoomConnectionStorage } from "../RoomConnectionStorage";

export class RoomWebSocketService extends WebSocketBase {
  private channelsManager: RoomChannelsManager;
  private presenceManager: RoomPresenceManager;
  private gameStateService: GameStateService;
  private presenceService: RoomPresenceService;
  private connectionStorage: RoomConnectionStorage;

  constructor() {
    super();
    this.channelsManager = new RoomChannelsManager();
    this.presenceManager = new RoomPresenceManager();
    this.gameStateService = new GameStateService();
    this.presenceService = new RoomPresenceService();
    this.connectionStorage = new RoomConnectionStorage();
  }

  connectToRoom(roomId: string, userId: string | null, gameType?: string) {
    if (!roomId || !userId) {
      console.warn("Cannot connect to room - missing roomId or userId");
      return null;
    }
    
    const roomChannel = this.channelsManager.setupChannel(roomId, userId);
    
    // Mark player as connected in the database
    if (roomChannel) {
      this.presenceService.markPlayerConnected(roomId, userId);
    }
    
    return roomChannel;
  }

  disconnectFromRoom(roomId: string, userId: string | null) {
    if (!roomId || !userId) {
      console.warn("Cannot disconnect from room - missing roomId or userId");
      return;
    }
    
    // Mark player as disconnected in the database
    this.presenceService.markPlayerDisconnected(roomId, userId);
    
    // Clean up channel and presence data
    this.cleanupChannel(roomId);
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


import { RoomWebSocketConnection } from "./RoomWebSocketConnection";
import { RoomPresenceService } from "../presence/RoomPresenceService";
import { GameStateService } from "../game/GameStateService";
import { RoomHeartbeatManager } from "../RoomHeartbeatManager";
import { RoomConnectionStorage } from "../RoomConnectionStorage";
import { RoomReconnectionManager } from "../RoomReconnectionManager";

export class RoomWebSocketService {
  private connection: RoomWebSocketConnection;
  private presenceService: RoomPresenceService;
  private gameStateService: GameStateService;
  private heartbeatManager: RoomHeartbeatManager;
  private connectionStorage: RoomConnectionStorage;
  private reconnectionManager: RoomReconnectionManager;
  private maxReconnectAttempts = 15;
  private isReconnecting = false;
  private visibilityChangeHandler: () => void;
  private connectionCheckInterval: number | null = null;

  constructor() {
    this.connection = new RoomWebSocketConnection();
    this.presenceService = new RoomPresenceService();
    this.gameStateService = new GameStateService();
    this.heartbeatManager = new RoomHeartbeatManager();
    this.connectionStorage = new RoomConnectionStorage();
    this.reconnectionManager = new RoomReconnectionManager(this, this.maxReconnectAttempts);
    
    this.visibilityChangeHandler = this.handleVisibilityChange.bind(this);
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    
    this.setupConnectionChecker();
  }

  private setupConnectionChecker() {
    if (this.connectionCheckInterval) {
      window.clearInterval(this.connectionCheckInterval);
    }
    
    this.connectionCheckInterval = window.setInterval(() => {
      console.log("Running periodic connection check");
      this.checkAndReconnectIfNeeded();
    }, 30000);
  }

  private async verifySupabaseSession() {
    try {
      const { data } = await supabase.auth.getSession();
      console.log("Auth session check:", data.session ? "Valid session" : "No session");
      if (!data.session) {
        console.warn("No valid Supabase session, this could affect WebSocket connections");
      }
    } catch (error) {
      console.error("Error checking Supabase session:", error);
    }
  }

  private async checkAndReconnectIfNeeded() {
    const { roomId, userId, gameType } = this.connectionStorage.getStored();
    
    if (roomId && userId) {
      console.log(`Connection check: roomId=${roomId}, active channel exists=${Boolean(this.connection.getChannel(roomId))}`);
      
      if (!this.connection.getChannel(roomId)) {
        console.log(`No active channel for room ${roomId}, reconnecting...`);
        this.isReconnecting = true;
        this.connectToRoom(roomId, userId, gameType);
      } else if (!this.heartbeatManager.isHeartbeatHealthy(roomId)) {
        console.log(`Heartbeat unhealthy for room ${roomId}, reconnecting...`);
        this.isReconnecting = true;
        this.connection.cleanupChannel(roomId);
        this.connectToRoom(roomId, userId, gameType);
      } else {
        console.log(`Channel for room ${roomId} exists and is healthy, checking session state...`);
        this.verifySupabaseSession();
      }
    }
  }

  private handleVisibilityChange() {
    console.log(`Visibility changed to: ${document.visibilityState}`);
    if (document.visibilityState === 'visible') {
      this.checkAndReconnectIfNeeded();
    }
  }

  saveActiveRoomToStorage(roomId: string, userId: string, gameType?: string) {
    this.connectionStorage.save(roomId, userId, gameType);
  }

  connectToRoom(roomId: string, userId: string | null, gameType?: string) {
    if (!roomId || !userId) {
      console.warn("Cannot connect to room - missing roomId or userId");
      return null;
    }
    
    this.isReconnecting = true;
    this.connection.cleanupChannel(roomId);
    
    const roomChannel = this.connection.setupChannel(roomId, userId, gameType);
    if (!roomChannel) return null;

    roomChannel.subscribe(async (status) => {
      console.log(`Subscription status for room ${roomId}:`, status);
      
      if (status === 'SUBSCRIBED') {
        this.heartbeatManager.setupHeartbeat(roomId, roomChannel);
        console.log(`Heartbeat setup for room ${roomId}`);
        this.reconnectionManager.reset(roomId);

        let presenceData = this.connection.getLastPresenceState(roomId) || {
          user_id: userId,
          online_at: new Date().toISOString(),
          is_ready: false
        };
        
        await this.connection.updatePresenceState(roomId, presenceData);
        console.log('Subscribed to room channel', status);
        
        let storedGameType = gameType;
        if (!storedGameType) {
          try {
            const { data: sessionData } = await supabase
              .from('game_sessions')
              .select('game_type')
              .eq('id', roomId)
              .single();
            
            storedGameType = sessionData?.game_type || sessionStorage.getItem('activeGameType') || undefined;
            console.log(`Retrieved game type from database: ${storedGameType}`);
          } catch (error) {
            console.error('Error fetching game type from database:', error);
          }
        }
        
        this.saveActiveRoomToStorage(roomId, userId, storedGameType);
        await this.presenceService.markPlayerConnected(roomId, userId);
        this.isReconnecting = false;
        
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        console.log('Connection closed/error, attempting reconnect...');
        if (document.visibilityState === 'visible') {
          this.reconnectionManager.handleDisconnect(roomId, userId);
        }
      } else {
        console.error('Failed to subscribe to room channel:', status);
      }
    });

    return roomChannel;
  }

  getStoredRoomConnection() {
    return this.connectionStorage.getStored();
  }

  disconnectFromRoom(roomId: string, userId: string | null) {
    if (!roomId || !userId) {
      console.warn("Cannot disconnect - missing roomId or userId");
      return;
    }
    
    console.log(`Disconnecting from room ${roomId}`);
    
    const isIntentionalDisconnect = document.visibilityState === 'visible' && !this.isReconnecting;
    
    if (isIntentionalDisconnect) {
      this.reconnectionManager.clearReconnectTimer(roomId);
    }
    
    this.heartbeatManager.clearHeartbeat(roomId);
    this.connection.cleanupChannel(roomId);

    if (isIntentionalDisconnect) {
      console.log('Intentional disconnect, clearing storage');
      this.connectionStorage.clear();
      this.presenceService.markPlayerDisconnected(roomId, userId);
    } else {
      console.log('Non-intentional disconnect (refresh/navigation), keeping storage data');
    }
  }

  async markPlayerReady(roomId: string, userId: string, isReady: boolean = true) {
    const channel = this.connection.getChannel(roomId);
    if (channel) {
      await this.presenceService.markPlayerReady(roomId, userId, isReady, channel);
    }
  }

  async startGame(roomId: string) {
    const channel = this.connection.getChannel(roomId);
    return await this.gameStateService.startGame(roomId, channel);
  }

  broadcastMove(roomId: string, moveData: any) {
    const channel = this.connection.getChannel(roomId);
    this.gameStateService.broadcastMove(roomId, moveData, channel);
  }

  async endGame(roomId: string, results: any) {
    const channel = this.connection.getChannel(roomId);
    return await this.gameStateService.endGame(roomId, results, channel);
  }
}

export const roomService = new RoomWebSocketService();

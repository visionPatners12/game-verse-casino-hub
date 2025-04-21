
import { supabase } from "@/integrations/supabase/client";
import { WebSocketBase } from "./webSocket/WebSocketBase";
import { RoomPresenceService } from "./presence/RoomPresenceService";
import { GameStateService } from "./game/GameStateService";
import { PresenceData } from "@/components/game/types";
import { RoomHeartbeatManager } from "./RoomHeartbeatManager";
import { RoomConnectionStorage } from "./RoomConnectionStorage";
import { RoomReconnectionManager } from "./RoomReconnectionManager";

export class RoomWebSocketService extends WebSocketBase {
  private presenceService: RoomPresenceService;
  private gameStateService: GameStateService;
  private heartbeatManager: RoomHeartbeatManager;
  private connectionStorage: RoomConnectionStorage;
  private reconnectionManager: RoomReconnectionManager;
  private lastPresenceStates: Record<string, PresenceData> = {};
  private maxReconnectAttempts = 15;
  private isReconnecting = false;
  private visibilityChangeHandler: () => void;
  private connectionCheckInterval: number | null = null;

  constructor() {
    super();
    this.presenceService = new RoomPresenceService();
    this.gameStateService = new GameStateService();
    this.heartbeatManager = new RoomHeartbeatManager();
    this.connectionStorage = new RoomConnectionStorage();
    this.reconnectionManager = new RoomReconnectionManager(this, this.maxReconnectAttempts);
    
    this.visibilityChangeHandler = this.handleVisibilityChange.bind(this);
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    
    // Setup periodic connection checker
    this.setupConnectionChecker();
  }

  private setupConnectionChecker() {
    // Clear any existing interval
    if (this.connectionCheckInterval) {
      window.clearInterval(this.connectionCheckInterval);
    }
    
    // Check connection every 30 seconds
    this.connectionCheckInterval = window.setInterval(() => {
      console.log("Running periodic connection check");
      this.checkAndReconnectIfNeeded();
    }, 30000);
  }

  private checkAndReconnectIfNeeded() {
    const { roomId, userId, gameType } = this.connectionStorage.getStored();
    
    if (roomId && userId) {
      console.log(`Connection check: roomId=${roomId}, active channel exists=${Boolean(this.channels[roomId])}`);
      
      if (!this.channels[roomId]) {
        console.log(`No active channel for room ${roomId}, reconnecting...`);
        this.isReconnecting = true;
        this.connectToRoom(roomId, userId, gameType);
      } else {
        console.log(`Channel for room ${roomId} exists, checking session state...`);
        this.verifySupabaseSession();
      }
    }
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
    
    // Cleanup existing channel if present to avoid stale references
    if (this.channels[roomId]) {
      console.log(`Cleaning up existing channel for room ${roomId}`);
      this.channels[roomId].untrack();
      supabase.removeChannel(this.channels[roomId]);
      delete this.channels[roomId];
    }
    
    console.log(`Connecting to room ${roomId} as user ${userId} (Game type: ${gameType || 'unknown'})`);
    const roomChannel = supabase
      .channel(`room:${roomId}`)
      .on('presence', { event: 'sync' }, async () => {
        const state = roomChannel.presenceState();
        console.log('Room presence state synced:', state);
        this.triggerCallback('presenceSync', roomId, state);

        const presences = Object.values(state).flat() as unknown as PresenceData[];
        const allPlayersReady = presences.every(p => p.is_ready);
        const connectedCount = presences.length;
        try {
          const { data: roomData } = await supabase
            .from('game_sessions')
            .select('max_players, status')
            .eq('id', roomId)
            .single();

          if (roomData &&
            roomData.status === 'Waiting' &&
            allPlayersReady &&
            connectedCount === roomData.max_players) {
            console.log('All players ready and room full - starting game');
            await this.startGame(roomId);
          }
        } catch (error) {
          console.error('Error checking room data for auto-start:', error);
        }
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('Player joined:', key, newPresences);
        this.triggerCallback('playerJoined', roomId, { key, newPresences });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Player left:', key, leftPresences);
        this.triggerCallback('playerLeft', roomId, { key, leftPresences });
      })
      .on('broadcast', { event: 'game_start' }, (payload) => {
        console.log('Game started:', payload);
        this.triggerCallback('gameStart', roomId, payload);
      })
      .on('broadcast', { event: 'player_move' }, (payload) => {
        console.log('Player move:', payload);
        this.triggerCallback('playerMove', roomId, payload);
      })
      .on('broadcast', { event: 'game_over' }, (payload) => {
        console.log('Game over:', payload);
        this.triggerCallback('gameOver', roomId, payload);
      });

    roomChannel.subscribe(async (status) => {
      console.log(`Subscription status for room ${roomId}:`, status);
      
      if (status === 'SUBSCRIBED') {
        this.heartbeatManager.setupHeartbeat(roomId, roomChannel);
        console.log(`Heartbeat setup for room ${roomId}`);
        this.reconnectionManager.reset(roomId);

        let presenceData = this.lastPresenceStates[roomId] || {
          user_id: userId,
          online_at: new Date().toISOString(),
          is_ready: false
        };
        
        this.lastPresenceStates[roomId] = presenceData;
        await roomChannel.track(presenceData);
        console.log('Subscribed to room channel', status);
        
        // Fetch game type from database if not provided
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

    this.channels[roomId] = roomChannel;
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
    
    // Set reconnecting flag first to prevent premature clearing
    const isIntentionalDisconnect = document.visibilityState === 'visible' && !this.isReconnecting;
    
    this.reconnectionManager.clearReconnectTimer(roomId);
    this.heartbeatManager.clearHeartbeat(roomId);

    if (this.channels[roomId]) {
      this.channels[roomId].untrack();
      supabase.removeChannel(this.channels[roomId]);
      delete this.channels[roomId];
    }

    // Only clear storage and mark player as disconnected if this is an intentional disconnect
    if (isIntentionalDisconnect) {
      console.log('Intentional disconnect, clearing storage');
      this.connectionStorage.clear();
      this.presenceService.markPlayerDisconnected(roomId, userId);
    } else {
      console.log('Non-intentional disconnect (refresh/navigation), keeping storage data');
    }
    
    delete this.lastPresenceStates[roomId];
  }

  async markPlayerReady(roomId: string, userId: string, isReady: boolean = true) {
    if (this.lastPresenceStates[roomId]) {
      this.lastPresenceStates[roomId].is_ready = isReady;
    }
    await this.presenceService.markPlayerReady(roomId, userId, isReady, this.channels[roomId]);
  }

  async startGame(roomId: string) {
    return await this.gameStateService.startGame(roomId, this.channels[roomId]);
  }

  broadcastMove(roomId: string, moveData: any) {
    this.gameStateService.broadcastMove(roomId, moveData, this.channels[roomId]);
  }

  async endGame(roomId: string, results: any) {
    return await this.gameStateService.endGame(roomId, results, this.channels[roomId]);
  }
}

export const roomService = new RoomWebSocketService();

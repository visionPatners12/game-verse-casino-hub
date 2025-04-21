
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

  constructor() {
    super();
    this.presenceService = new RoomPresenceService();
    this.gameStateService = new GameStateService();
    this.heartbeatManager = new RoomHeartbeatManager();
    this.connectionStorage = new RoomConnectionStorage();
    this.reconnectionManager = new RoomReconnectionManager(this, this.maxReconnectAttempts);
  }

  connectToRoom(roomId: string, userId: string | null) {
    if (!roomId || !userId) return null;
    if (this.channels[roomId]) {
      console.log("Already connected to room", roomId);
      return this.channels[roomId];
    }
    console.log(`Connecting to room ${roomId} as user ${userId}`);
    const roomChannel = supabase
      .channel(`room:${roomId}`)
      .on('presence', { event: 'sync' }, async () => {
        const state = roomChannel.presenceState();
        console.log('Room presence state synced:', state);
        this.triggerCallback('presenceSync', roomId, state);

        const presences = Object.values(state).flat() as unknown as PresenceData[];
        const allPlayersReady = presences.every(p => p.is_ready);
        const connectedCount = presences.length;
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
      if (status === 'SUBSCRIBED') {
        this.heartbeatManager.setupHeartbeat(roomId, roomChannel);
        this.reconnectionManager.reset(roomId);

        let presenceData = this.lastPresenceStates[roomId] || {
          user_id: userId,
          online_at: new Date().toISOString(),
          is_ready: false
        };
        this.lastPresenceStates[roomId] = presenceData;
        await roomChannel.track(presenceData);
        console.log('Subscribed to room channel', status);
        await this.presenceService.markPlayerConnected(roomId, userId);
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        console.log('Connection closed/error, attempting reconnect...');
        this.reconnectionManager.handleDisconnect(roomId, userId);
      } else {
        console.error('Failed to subscribe to room channel:', status);
      }
    });

    this.channels[roomId] = roomChannel;
    this.connectionStorage.save(roomId, userId);
    return roomChannel;
  }

  saveActiveRoomToStorage(roomId: string, userId: string) {
    this.connectionStorage.save(roomId, userId);
  }

  private clearActiveRoomFromStorage() {
    this.connectionStorage.clear();
  }

  getStoredRoomConnection() {
    return this.connectionStorage.getStored();
  }

  disconnectFromRoom(roomId: string, userId: string | null) {
    if (!roomId || !userId || !this.channels[roomId]) return;
    console.log(`Disconnecting from room ${roomId}`);
    this.heartbeatManager.clearHeartbeat(roomId);

    if (this.channels[roomId]) {
      this.channels[roomId].untrack();
      supabase.removeChannel(this.channels[roomId]);
      delete this.channels[roomId];
    }

    if (document.visibilityState === 'visible') {
      this.clearActiveRoomFromStorage();
    }
    this.presenceService.markPlayerDisconnected(roomId, userId);
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

// Export a singleton instance
export const roomService = new RoomWebSocketService();

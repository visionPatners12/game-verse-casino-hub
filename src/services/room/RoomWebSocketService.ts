
import { supabase } from "@/integrations/supabase/client";
import { WebSocketBase } from "./webSocket/WebSocketBase";
import { RoomPresenceService } from "./presence/RoomPresenceService";
import { GameStateService } from "./game/GameStateService";
import { PresenceData } from "@/components/game/types";

export class RoomWebSocketService extends WebSocketBase {
  private presenceService: RoomPresenceService;
  private gameStateService: GameStateService;
  private reconnectAttempts: Record<string, number> = {};
  private maxReconnectAttempts = 10; // Increased from 5 to 10
  private heartbeatIntervals: Record<string, number> = {};
  private lastPresenceStates: Record<string, PresenceData> = {}; // Store last presence state for reconnection

  constructor() {
    super();
    this.presenceService = new RoomPresenceService();
    this.gameStateService = new GameStateService();
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
        
        // Check if all players are ready and connected
        // Type assertion to convert the presence state to the expected format
        const presences = Object.values(state).flat() as unknown as PresenceData[];
        const allPlayersReady = presences.every(p => p.is_ready);
        const connectedCount = presences.length;
        
        // Get room data to check max players
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
        this.setupHeartbeat(roomId);
        this.reconnectAttempts[roomId] = 0;
        
        // Get the last presence state or create a new one
        let presenceData = this.lastPresenceStates[roomId] || {
          user_id: userId,
          online_at: new Date().toISOString(),
          is_ready: false
        };
        
        // Store current presence data for future reconnects
        this.lastPresenceStates[roomId] = presenceData;
        
        await roomChannel.track(presenceData);
        console.log('Subscribed to room channel', status);
        
        await this.presenceService.markPlayerConnected(roomId, userId);
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        console.log('Connection closed/error, attempting reconnect...');
        this.handleDisconnect(roomId, userId);
      } else {
        console.error('Failed to subscribe to room channel:', status);
      }
    });
    
    this.channels[roomId] = roomChannel;
    
    // Set a session storage item to indicate this room should be reconnected to on page reload
    this.saveActiveRoomToStorage(roomId, userId);
    
    return roomChannel;
  }

  // Save active room info to session storage for reconnection after page reload
  private saveActiveRoomToStorage(roomId: string, userId: string) {
    try {
      sessionStorage.setItem('activeRoomId', roomId);
      sessionStorage.setItem('activeUserId', userId);
    } catch (error) {
      console.error('Failed to save room data to session storage:', error);
    }
  }
  
  // Clear active room info from session storage
  private clearActiveRoomFromStorage() {
    try {
      sessionStorage.removeItem('activeRoomId');
      sessionStorage.removeItem('activeUserId');
    } catch (error) {
      console.error('Failed to clear room data from session storage:', error);
    }
  }
  
  // Check if there's an active room to reconnect to
  getStoredRoomConnection() {
    try {
      const roomId = sessionStorage.getItem('activeRoomId');
      const userId = sessionStorage.getItem('activeUserId');
      return { roomId, userId };
    } catch (error) {
      console.error('Failed to get room data from session storage:', error);
      return { roomId: null, userId: null };
    }
  }

  private setupHeartbeat(roomId: string) {
    // Clear any existing heartbeat
    if (this.heartbeatIntervals[roomId]) {
      clearInterval(this.heartbeatIntervals[roomId]);
    }

    // Set up new heartbeat
    this.heartbeatIntervals[roomId] = window.setInterval(() => {
      if (this.channels[roomId]) {
        this.channels[roomId].send({
          type: 'broadcast',
          event: 'heartbeat',
          payload: { timestamp: new Date().toISOString() }
        });
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private async handleDisconnect(roomId: string, userId: string) {
    if (this.reconnectAttempts[roomId] < this.maxReconnectAttempts) {
      this.reconnectAttempts[roomId]++;
      console.log(`Reconnect attempt ${this.reconnectAttempts[roomId]} for room ${roomId}`);
      
      const backoffTime = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts[roomId]), 30000);
      console.log(`Reconnecting in ${backoffTime/1000} seconds...`);
      
      setTimeout(() => {
        // Don't mark player as disconnected during reconnection attempts
        this.connectToRoom(roomId, userId);
      }, backoffTime);
    } else {
      console.log('Max reconnection attempts reached');
      this.disconnectFromRoom(roomId, userId);
    }
  }

  disconnectFromRoom(roomId: string, userId: string | null) {
    if (!roomId || !userId || !this.channels[roomId]) return;
    
    console.log(`Disconnecting from room ${roomId}`);
    
    // Clear heartbeat interval
    if (this.heartbeatIntervals[roomId]) {
      clearInterval(this.heartbeatIntervals[roomId]);
      delete this.heartbeatIntervals[roomId];
    }
    
    if (this.channels[roomId]) {
      this.channels[roomId].untrack();
      supabase.removeChannel(this.channels[roomId]);
      delete this.channels[roomId];
    }
    
    // Clear from session storage
    this.clearActiveRoomFromStorage();
    
    // Only mark player as disconnected when explicitly calling disconnect
    this.presenceService.markPlayerDisconnected(roomId, userId);
    
    // Clear stored presence state
    delete this.lastPresenceStates[roomId];
  }

  async markPlayerReady(roomId: string, userId: string, isReady: boolean = true) {
    // Update the stored presence state with ready status
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


import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "sonner";

export interface PlayerReadyStatus {
  userId: string;
  isReady: boolean;
  timestamp: string;
}

export class ArenaRoomWebSocketService {
  private channels: Record<string, RealtimeChannel> = {};
  private readyStatusListeners: Record<string, ((status: PlayerReadyStatus[]) => void)[] | undefined> = {};
  private timerListeners: Record<string, ((endTime: Date | null, isActive: boolean) => void)[] | undefined> = {};
  
  /**
   * Connect to a specific room channel
   */
  connectToRoom(roomId: string): RealtimeChannel {
    console.log(`[ArenaRoom] Connecting to room: ${roomId}`);
    
    // Return existing channel if already connected
    if (this.channels[roomId]) {
      console.log(`[ArenaRoom] Reusing existing channel for room: ${roomId}`);
      return this.channels[roomId];
    }
    
    // Create a new channel specifically for EAFC25 room events
    const channel = supabase.channel(`eafc25-room:${roomId}`)
      .on('broadcast', { event: 'player_ready' }, (payload) => {
        console.log('[ArenaRoom] Player ready event received:', payload);
        this.notifyReadyStatusListeners(roomId, payload.payload);
      })
      .on('broadcast', { event: 'ready_countdown_update' }, (payload) => {
        console.log('[ArenaRoom] Ready countdown update event received:', payload);
        const { endTime, isActive } = payload.payload;
        this.notifyTimerListeners(roomId, endTime ? new Date(endTime) : null, isActive);
      })
      .on('broadcast', { event: 'all_players_ready' }, () => {
        console.log('[ArenaRoom] All players ready event received');
        toast.success("All players are ready! Match can start now.");
      });
      
    console.log(`[ArenaRoom] Subscribing to channel for room ${roomId}`);
    
    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`[ArenaRoom] Successfully subscribed to room ${roomId}`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`[ArenaRoom] Error subscribing to room ${roomId}`);
        toast.error("Could not connect to match room. Please refresh the page.");
      } else {
        console.log(`[ArenaRoom] Channel status: ${status}`);
      }
    });
    
    this.channels[roomId] = channel;
    return channel;
  }
  
  /**
   * Disconnect from a specific room channel
   */
  disconnectFromRoom(roomId: string): void {
    if (this.channels[roomId]) {
      console.log(`[ArenaRoom] Disconnecting from room: ${roomId}`);
      
      try {
        supabase.removeChannel(this.channels[roomId]);
        delete this.channels[roomId];
        delete this.readyStatusListeners[roomId];
        delete this.timerListeners[roomId];
        console.log(`[ArenaRoom] Successfully disconnected from room: ${roomId}`);
      } catch (error) {
        console.error(`[ArenaRoom] Error disconnecting from room: ${roomId}`, error);
      }
    }
  }
  
  /**
   * Update player ready status in the database and broadcast to all clients
   */
  async updatePlayerReadyStatus(roomId: string, userId: string, isReady: boolean): Promise<boolean> {
    console.log(`[ArenaRoom] Updating player ready status: userId=${userId}, isReady=${isReady}`);
    
    try {
      // 1. Update the database
      const { error } = await supabase
        .from('game_players')
        .update({ is_ready: isReady })
        .eq('session_id', roomId)
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      // 2. Broadcast the change to all clients
      const channel = this.channels[roomId];
      if (channel) {
        const readyStatus: PlayerReadyStatus = {
          userId,
          isReady,
          timestamp: new Date().toISOString()
        };
        
        channel.send({
          type: 'broadcast',
          event: 'player_ready',
          payload: readyStatus
        });
        
        console.log(`[ArenaRoom] Successfully broadcast player ready status: ${JSON.stringify(readyStatus)}`);
      } else {
        console.warn(`[ArenaRoom] Could not broadcast player ready status: no channel for roomId=${roomId}`);
      }
      
      return true;
    } catch (error) {
      console.error('[ArenaRoom] Error updating player ready status:', error);
      toast.error("Could not update ready status. Please try again.");
      return false;
    }
  }
  
  /**
   * Start or update the ready countdown
   */
  updateReadyCountdown(roomId: string, endTime: Date | null, isActive: boolean): void {
    console.log(`[ArenaRoom] Updating ready countdown: endTime=${endTime}, isActive=${isActive}`);
    
    const channel = this.channels[roomId];
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'ready_countdown_update',
        payload: {
          endTime: endTime?.toISOString(),
          isActive
        }
      });
      
      console.log(`[ArenaRoom] Successfully broadcast countdown update: endTime=${endTime}, isActive=${isActive}`);
    } else {
      console.warn(`[ArenaRoom] Could not broadcast countdown update: no channel for roomId=${roomId}`);
    }
  }
  
  /**
   * Broadcast that all players are ready
   */
  broadcastAllPlayersReady(roomId: string): void {
    console.log(`[ArenaRoom] Broadcasting all players ready for room ${roomId}`);
    
    const channel = this.channels[roomId];
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'all_players_ready',
        payload: { timestamp: new Date().toISOString() }
      });
      
      console.log(`[ArenaRoom] Successfully broadcast all players ready`);
    } else {
      console.warn(`[ArenaRoom] Could not broadcast all players ready: no channel for roomId=${roomId}`);
    }
  }
  
  /**
   * Register a listener for ready status updates
   */
  onReadyStatusChange(roomId: string, listener: (status: PlayerReadyStatus[]) => void): () => void {
    if (!this.readyStatusListeners[roomId]) {
      this.readyStatusListeners[roomId] = [];
    }
    
    this.readyStatusListeners[roomId]?.push(listener);
    
    return () => {
      if (this.readyStatusListeners[roomId]) {
        this.readyStatusListeners[roomId] = this.readyStatusListeners[roomId]?.filter(l => l !== listener);
      }
    };
  }
  
  /**
   * Register a listener for timer updates
   */
  onTimerChange(roomId: string, listener: (endTime: Date | null, isActive: boolean) => void): () => void {
    if (!this.timerListeners[roomId]) {
      this.timerListeners[roomId] = [];
    }
    
    this.timerListeners[roomId]?.push(listener);
    
    return () => {
      if (this.timerListeners[roomId]) {
        this.timerListeners[roomId] = this.timerListeners[roomId]?.filter(l => l !== listener);
      }
    };
  }
  
  /**
   * Notify all registered ready status listeners
   */
  private notifyReadyStatusListeners(roomId: string, status: PlayerReadyStatus): void {
    const listeners = this.readyStatusListeners[roomId];
    if (listeners) {
      // We pass as array because eventually we will track all player statuses
      listeners.forEach(listener => listener([status]));
    }
  }
  
  /**
   * Notify all registered timer listeners
   */
  private notifyTimerListeners(roomId: string, endTime: Date | null, isActive: boolean): void {
    const listeners = this.timerListeners[roomId];
    if (listeners) {
      listeners.forEach(listener => listener(endTime, isActive));
    }
  }
}

// Create a singleton instance
export const arenaRoomService = new ArenaRoomWebSocketService();


import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RoomData, PresenceData, DatabaseSessionStatus, SessionStatus } from "@/components/game/types";

// Types for WebSocket events
export interface RoomEvent {
  type: string;
  roomId: string;
  userId: string;
  payload?: any;
}

export interface PlayerData {
  id: string;
  userId: string;
  displayName: string;
  isConnected: boolean;
  isReady: boolean;
  score: number;
}

class RoomWebSocketService {
  private channels: Record<string, any> = {};
  private callbacks: Record<string, Function[]> = {};
  
  // Initialize a connection to a specific room
  connectToRoom(roomId: string, userId: string | null) {
    if (!roomId || !userId) return null;
    
    if (this.channels[roomId]) {
      console.log("Already connected to room", roomId);
      return this.channels[roomId];
    }
    
    console.log(`Connecting to room ${roomId} as user ${userId}`);
    
    // Create a channel for room events
    const roomChannel = supabase
      .channel(`room:${roomId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = roomChannel.presenceState();
        console.log('Room presence state synced:', state);
        this.triggerCallback('presenceSync', roomId, state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('Player joined:', key, newPresences);
        this.triggerCallback('playerJoined', roomId, { key, newPresences });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Player left:', key, leftPresences);
        this.triggerCallback('playerLeft', roomId, { key, leftPresences });
      })
      .on(
        'broadcast',
        { event: 'game_start' },
        (payload) => {
          console.log('Game started:', payload);
          this.triggerCallback('gameStart', roomId, payload);
        }
      )
      .on(
        'broadcast',
        { event: 'player_move' },
        (payload) => {
          console.log('Player move:', payload);
          this.triggerCallback('playerMove', roomId, payload);
        }
      )
      .on(
        'broadcast',
        { event: 'game_over' },
        (payload) => {
          console.log('Game over:', payload);
          this.triggerCallback('gameOver', roomId, payload);
        }
      );
      
    // Subscribe to channel and track user presence
    roomChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Mark user as connected in the presence system
        const presenceData: PresenceData = {
          user_id: userId,
          online_at: new Date().toISOString(),
          is_ready: false
        };
        
        await roomChannel.track(presenceData);
        console.log('Subscribed to room channel', status);
        
        // Update database to reflect connection
        await this.markPlayerConnected(roomId, userId);
      } else {
        console.error('Failed to subscribe to room channel:', status);
      }
    });
    
    // Store the channel reference
    this.channels[roomId] = roomChannel;
    return roomChannel;
  }
  
  // Clean up when leaving a room
  disconnectFromRoom(roomId: string, userId: string | null) {
    if (!roomId || !userId || !this.channels[roomId]) return;
    
    console.log(`Disconnecting from room ${roomId}`);
    
    // Remove user presence
    if (this.channels[roomId]) {
      this.channels[roomId].untrack();
      supabase.removeChannel(this.channels[roomId]);
      delete this.channels[roomId];
    }
    
    // Update database to reflect disconnection
    this.markPlayerDisconnected(roomId, userId);
  }
  
  // Register callbacks for specific events
  onEvent(event: string, callback: Function) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }
  
  // Remove a callback
  offEvent(event: string, callback: Function) {
    if (!this.callbacks[event]) return;
    
    this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
  }
  
  // Trigger all callbacks for an event
  private triggerCallback(event: string, roomId: string, data: any) {
    if (!this.callbacks[event]) return;
    
    this.callbacks[event].forEach(callback => {
      try {
        callback(roomId, data);
      } catch (error) {
        console.error(`Error in ${event} callback:`, error);
      }
    });
  }
  
  // Mark a player as ready
  async markPlayerReady(roomId: string, userId: string, isReady: boolean = true) {
    if (!roomId || !userId) return;
    
    try {
      // Update presence data first (realtime)
      if (this.channels[roomId]) {
        const presenceData: PresenceData = {
          user_id: userId,
          online_at: new Date().toISOString(),
          is_ready: isReady
        };
        await this.channels[roomId].track(presenceData);
      }
      
      // Update database (persistent)
      const { error } = await supabase
        .from('game_players')
        .update({ is_ready: isReady })
        .eq('session_id', roomId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Broadcast event to all clients
      if (this.channels[roomId]) {
        this.channels[roomId].send({
          type: 'broadcast',
          event: 'player_ready',
          payload: { userId, isReady }
        });
      }
    } catch (error) {
      console.error('Error marking player ready:', error);
      toast.error('Could not update ready status. Please try again.');
    }
  }
  
  // Update connection status in database
  private async markPlayerConnected(roomId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('game_players')
        .update({ is_connected: true })
        .eq('session_id', roomId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // The database trigger will update the connected_players array automatically
    } catch (error) {
      console.error('Error marking player connected:', error);
    }
  }
  
  // Update disconnection status in database
  private async markPlayerDisconnected(roomId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('game_players')
        .update({ is_connected: false })
        .eq('session_id', roomId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // The database trigger will update the connected_players array automatically
    } catch (error) {
      console.error('Error marking player disconnected:', error);
    }
  }
  
  // Start a game when all players are ready
  async startGame(roomId: string) {
    if (!roomId || !this.channels[roomId]) return;
    
    try {
      // Update game status in database
      const { data, error } = await supabase
        .from('game_sessions')
        .update({ 
          status: 'Playing' as DatabaseSessionStatus,
          start_time: new Date().toISOString()
        })
        .eq('id', roomId)
        .select()
        .single();
        
      if (error) throw error;
      
      // Broadcast game start to all clients
      this.channels[roomId].send({
        type: 'broadcast',
        event: 'game_start',
        payload: data
      });
      
      return data;
    } catch (error) {
      console.error('Error starting game:', error);
      toast.error('Could not start the game. Please try again.');
      return null;
    }
  }
  
  // Broadcast a player move to all clients
  broadcastMove(roomId: string, moveData: any) {
    if (!roomId || !this.channels[roomId]) return;
    
    this.channels[roomId].send({
      type: 'broadcast',
      event: 'player_move',
      payload: moveData
    });
  }
  
  // End a game and record results
  async endGame(roomId: string, results: any) {
    if (!roomId || !this.channels[roomId]) return;
    
    try {
      // Update game status in database
      const { data, error } = await supabase
        .from('game_sessions')
        .update({
          status: 'Completed' as DatabaseSessionStatus,
          end_time: new Date().toISOString()
        })
        .eq('id', roomId)
        .select()
        .single();
        
      if (error) throw error;
      
      // Broadcast game over to all clients
      this.channels[roomId].send({
        type: 'broadcast',
        event: 'game_over',
        payload: { ...data, results }
      });
      
      return data;
    } catch (error) {
      console.error('Error ending game:', error);
      toast.error('Could not end the game properly. Please try again.');
      return null;
    }
  }
}

// Export a singleton instance
export const roomService = new RoomWebSocketService();

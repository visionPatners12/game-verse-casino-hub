
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { WebSocketBase } from "./WebSocketBase";
import { PresenceData } from "@/components/game/types";

export class RoomWebSocketConnection extends WebSocketBase {
  protected channels: Record<string, RealtimeChannel> = {};
  private lastPresenceStates: Record<string, PresenceData> = {};
  private subscribedChannels: Set<string> = new Set();
  // Add a new map to track channel subscription promises
  private channelSubscriptions: Map<string, Promise<RealtimeChannel>> = new Map();

  setupChannel(roomId: string, userId: string | null, gameType?: string) {
    if (!roomId || !userId) {
      console.warn("Cannot setup channel - missing roomId or userId");
      return null;
    }
    
    console.log(`Setting up channel for room ${roomId} as user ${userId} (Game type: ${gameType || 'unknown'})`);
    
    // Return existing channel if already set up
    if (this.channels[roomId]) {
      console.log(`Channel for room ${roomId} already exists, reusing it`);
      return this.channels[roomId];
    }
    
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
      })
      .on('broadcast', { event: 'heartbeat' }, (payload) => {
        if (Math.random() < 0.05) {
          console.log(`Received heartbeat from another client in room ${roomId}:`, payload);
        }
      })
      .on('broadcast', { event: 'player_joined' }, (payload) => {
        console.log('New player joined the room:', payload);
        this.triggerCallback('playerJoinedRoom', roomId, payload);
      });

    this.channels[roomId] = roomChannel;
    
    // Create and store a promise for the channel subscription
    const subscriptionPromise = new Promise<RealtimeChannel>((resolve) => {
      roomChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to room ${roomId}`);
          this.subscribedChannels.add(roomId);
          
          // Broadcast that this player has joined to all other clients
          roomChannel.send({
            type: 'broadcast',
            event: 'player_joined',
            payload: { userId }
          });
          
          resolve(roomChannel);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Failed to subscribe to room ${roomId}`);
          // Still resolve to prevent hanging promises
          resolve(roomChannel);
        } else {
          console.log(`Room ${roomId} subscription status: ${status}`);
        }
      });
    });
    
    this.channelSubscriptions.set(roomId, subscriptionPromise);
    
    return roomChannel;
  }

  getChannel(roomId: string) {
    return this.channels[roomId];
  }

  isSubscribed(roomId: string): boolean {
    return this.subscribedChannels.has(roomId);
  }

  // Get the subscription promise for a room channel
  getSubscriptionPromise(roomId: string): Promise<RealtimeChannel> | null {
    return this.channelSubscriptions.get(roomId) || null;
  }

  cleanupChannel(roomId: string) {
    if (this.channels[roomId]) {
      console.log(`Cleaning up WebSocket channel for room ${roomId}`);
      
      try {
        // First untrack any presence data
        this.channels[roomId].untrack();
      } catch (e) {
        console.warn(`Error untracking presence for room ${roomId}:`, e);
      }
      
      try {
        // Then remove the channel
        supabase.removeChannel(this.channels[roomId]);
      } catch (e) {
        console.warn(`Error removing channel for room ${roomId}:`, e);
      }
      
      // Clean up local references
      delete this.channels[roomId];
      delete this.lastPresenceStates[roomId];
      this.subscribedChannels.delete(roomId);
      this.channelSubscriptions.delete(roomId);
      
      console.log(`Channel for room ${roomId} cleaned up successfully`);
    }
  }

  async updatePresenceState(roomId: string, presenceData: PresenceData) {
    this.lastPresenceStates[roomId] = presenceData;
    const channel = this.channels[roomId];
    
    if (!channel) {
      console.error(`Cannot update presence: no channel exists for room ${roomId}`);
      return Promise.reject(new Error("No channel exists"));
    }
    
    // Wait for the channel to be fully subscribed before tracking presence
    // This fixes the "tried to push 'presence' before joining" error
    if (!this.subscribedChannels.has(roomId)) {
      console.log(`Waiting for subscription before tracking presence for room ${roomId}`);
      
      try {
        // Get the subscription promise or create a new one with a timeout
        const subscriptionPromise = this.channelSubscriptions.get(roomId) || 
          Promise.race([
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error("Subscription timeout")), 5000)
            ),
            new Promise<RealtimeChannel>(resolve => {
              const checkInterval = setInterval(() => {
                if (this.subscribedChannels.has(roomId)) {
                  clearInterval(checkInterval);
                  resolve(channel);
                }
              }, 100);
            })
          ]);
          
        // Wait for the subscription to complete
        await subscriptionPromise;
        
        console.log(`Channel now subscribed, tracking presence for room ${roomId}`);
        return channel.track(presenceData);
      } catch (error) {
        console.error(`Error waiting for subscription: ${error}`);
        return Promise.reject(error);
      }
    }
    
    try {
      console.log(`Tracking presence for room ${roomId}:`, presenceData);
      return channel.track(presenceData);
    } catch (error) {
      console.error(`Error tracking presence: ${error}`);
      return Promise.reject(error);
    }
  }

  getLastPresenceState(roomId: string) {
    return this.lastPresenceStates[roomId];
  }
}

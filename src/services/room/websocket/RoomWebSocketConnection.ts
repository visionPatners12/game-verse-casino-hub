
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { WebSocketBase } from "./WebSocketBase";
import { PresenceData } from "@/components/game/types";

export class RoomWebSocketConnection extends WebSocketBase {
  protected channels: Record<string, RealtimeChannel> = {};
  private lastPresenceStates: Record<string, PresenceData> = {};
  private subscribedChannels: Set<string> = new Set();

  setupChannel(roomId: string, userId: string | null, gameType?: string) {
    if (!roomId || !userId) {
      console.warn("Cannot setup channel - missing roomId or userId");
      return null;
    }
    
    console.log(`Setting up channel for room ${roomId} as user ${userId} (Game type: ${gameType || 'unknown'})`);
    
    // Return existing channel if already set up
    if (this.channels[roomId]) {
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
      });

    this.channels[roomId] = roomChannel;
    
    // Important: Subscribe to the channel and store the promise
    roomChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Successfully subscribed to room ${roomId}`);
        this.subscribedChannels.add(roomId);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`Failed to subscribe to room ${roomId}`);
      } else {
        console.log(`Room ${roomId} subscription status: ${status}`);
      }
    });
    
    return roomChannel;
  }

  getChannel(roomId: string) {
    return this.channels[roomId];
  }

  isSubscribed(roomId: string): boolean {
    return this.subscribedChannels.has(roomId);
  }

  cleanupChannel(roomId: string) {
    if (this.channels[roomId]) {
      this.channels[roomId].untrack();
      supabase.removeChannel(this.channels[roomId]);
      delete this.channels[roomId];
      delete this.lastPresenceStates[roomId];
      this.subscribedChannels.delete(roomId);
    }
  }

  updatePresenceState(roomId: string, presenceData: PresenceData) {
    this.lastPresenceStates[roomId] = presenceData;
    const channel = this.channels[roomId];
    
    if (!channel) {
      console.error(`Cannot update presence: no channel exists for room ${roomId}`);
      return Promise.reject(new Error("No channel exists"));
    }
    
    if (!this.subscribedChannels.has(roomId)) {
      console.warn(`Waiting for subscription before tracking presence for room ${roomId}`);
      // Return a promise that resolves when the channel is subscribed
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (this.subscribedChannels.has(roomId)) {
            clearInterval(checkInterval);
            resolve(channel.track(presenceData));
          }
        }, 100);
        
        // Set a timeout to avoid infinite waiting
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error("Subscription timeout"));
        }, 5000);
      });
    }
    
    return channel.track(presenceData);
  }

  getLastPresenceState(roomId: string) {
    return this.lastPresenceStates[roomId];
  }
}

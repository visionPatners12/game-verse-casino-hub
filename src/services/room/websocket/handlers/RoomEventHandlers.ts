
import { RealtimeChannel } from "@supabase/supabase-js";
import { WebSocketBase } from "../WebSocketBase";

export class RoomEventHandlers extends WebSocketBase {
  setupEventHandlers(roomChannel: RealtimeChannel, roomId: string) {
    roomChannel
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

    return roomChannel;
  }
}

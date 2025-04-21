
import { RoomWebSocketService } from "./RoomWebSocketService";

export class RoomReconnectionManager {
  private reconnectAttempts: Record<string, number> = {};
  private maxReconnectAttempts: number;

  constructor(private wsService: RoomWebSocketService, maxReconnectAttempts: number = 15) {
    this.maxReconnectAttempts = maxReconnectAttempts;
  }

  async handleDisconnect(roomId: string, userId: string) {
    if (!roomId || !userId) return;
    if (!this.reconnectAttempts[roomId]) this.reconnectAttempts[roomId] = 0;
    if (this.reconnectAttempts[roomId] < this.maxReconnectAttempts) {
      this.reconnectAttempts[roomId]++;
      console.log(`Reconnect attempt ${this.reconnectAttempts[roomId]} for room ${roomId}`);
      const backoffTime = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts[roomId]), 30000);
      console.log(`Reconnecting in ${backoffTime / 1000} seconds...`);
      setTimeout(() => {
        this.wsService.connectToRoom(roomId, userId);
      }, backoffTime);
    } else {
      console.log('Max reconnection attempts reached');
      this.wsService.disconnectFromRoom(roomId, userId);
    }
  }

  reset(roomId: string) {
    this.reconnectAttempts[roomId] = 0;
  }
}

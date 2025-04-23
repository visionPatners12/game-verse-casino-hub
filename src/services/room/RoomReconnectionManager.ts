
import { RoomWebSocketService } from "./websocket/RoomWebSocketService";

export class RoomReconnectionManager {
  private reconnectAttempts: Record<string, number> = {};
  private maxReconnectAttempts: number;
  private reconnectTimers: Record<string, number> = {};

  constructor(private wsService: RoomWebSocketService, maxReconnectAttempts: number = 15) {
    this.maxReconnectAttempts = maxReconnectAttempts;
  }

  async handleDisconnect(roomId: string, userId: string) {
    if (!roomId || !userId) {
      console.warn('Cannot handle disconnect - missing roomId or userId');
      return;
    }
    
    if (!this.reconnectAttempts[roomId]) this.reconnectAttempts[roomId] = 0;
    
    if (this.reconnectAttempts[roomId] < this.maxReconnectAttempts) {
      this.reconnectAttempts[roomId]++;
      
      // More aggressive exponential backoff for initial attempts, then more gradual
      const baseDelay = this.reconnectAttempts[roomId] <= 3 ? 300 : 1000;
      const maxDelay = 15000; // 15 seconds max
      const backoffTime = Math.min(baseDelay * Math.pow(1.5, this.reconnectAttempts[roomId] - 1), maxDelay);
      
      console.log(`Reconnect attempt ${this.reconnectAttempts[roomId]} for room ${roomId}, trying in ${backoffTime / 1000} seconds...`);
      
      // Clear any existing timer
      if (this.reconnectTimers[roomId]) {
        window.clearTimeout(this.reconnectTimers[roomId]);
      }
      
      // Get the game type from sessionStorage before reconnecting
      const gameType = sessionStorage.getItem('activeGameType');
      
      // Set new timer
      this.reconnectTimers[roomId] = window.setTimeout(() => {
        console.log(`Executing reconnect attempt ${this.reconnectAttempts[roomId]} for room ${roomId}`);
        this.wsService.connectToRoom(roomId, userId, gameType || undefined);
      }, backoffTime);
    } else {
      console.log(`Max reconnection attempts (${this.maxReconnectAttempts}) reached for room ${roomId}`);
      this.wsService.disconnectFromRoom(roomId, userId);
    }
  }

  reset(roomId: string) {
    console.log(`Resetting reconnection attempts for room ${roomId}`);
    this.reconnectAttempts[roomId] = 0;
    if (this.reconnectTimers[roomId]) {
      window.clearTimeout(this.reconnectTimers[roomId]);
      delete this.reconnectTimers[roomId];
    }
  }
  
  clearReconnectTimer(roomId: string) {
    if (this.reconnectTimers[roomId]) {
      window.clearTimeout(this.reconnectTimers[roomId]);
      delete this.reconnectTimers[roomId];
    }
  }
}


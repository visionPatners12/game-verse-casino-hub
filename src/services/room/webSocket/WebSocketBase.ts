
type WebSocketCallback = (roomId: string, data: any) => void;

export class WebSocketBase {
  protected channels: Record<string, any> = {};
  protected callbacks: Record<string, WebSocketCallback[]> = {};
  
  protected triggerCallback(event: string, roomId: string, data: any) {
    if (!this.callbacks[event]) return;
    
    this.callbacks[event].forEach(callback => {
      try {
        callback(roomId, data);
      } catch (error) {
        console.error(`Error in ${event} callback:`, error);
      }
    });
  }
  
  onEvent(event: string, callback: WebSocketCallback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }
  
  offEvent(event: string, callback: WebSocketCallback) {
    if (!this.callbacks[event]) return;
    this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
  }
}

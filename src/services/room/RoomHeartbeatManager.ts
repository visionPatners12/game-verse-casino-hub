
type Channel = {
  send: (msg: any) => void;
};

export class RoomHeartbeatManager {
  private heartbeatIntervals: Record<string, number> = {};
  private heartbeatCount: Record<string, number> = {};
  private lastHeartbeatTime: Record<string, number> = {};
  private heartbeatSuccess: Record<string, boolean> = {};
  private heartbeatFrequency: number = 15000; // Reduced to 15 seconds for more reliability

  setupHeartbeat(roomId: string, channel: Channel) {
    if (this.heartbeatIntervals[roomId]) {
      clearInterval(this.heartbeatIntervals[roomId]);
      this.heartbeatCount[roomId] = 0;
    }
    
    console.log(`Setting up heartbeat for room ${roomId} at ${new Date().toISOString()}`);
    this.heartbeatCount[roomId] = 0;
    this.lastHeartbeatTime[roomId] = Date.now();
    this.heartbeatSuccess[roomId] = true;
    
    this.heartbeatIntervals[roomId] = window.setInterval(() => {
      if (channel) {
        const timestamp = new Date().toISOString();
        const now = Date.now();
        this.heartbeatCount[roomId]++;
        
        // Log every 5th heartbeat to avoid console spam
        if (this.heartbeatCount[roomId] % 5 === 0) {
          console.log(`Sending heartbeat #${this.heartbeatCount[roomId]} for room ${roomId} at ${timestamp}`);
        }
        
        try {
          channel.send({
            type: 'broadcast',
            event: 'heartbeat',
            payload: { timestamp }
          });
          
          this.lastHeartbeatTime[roomId] = now;
          this.heartbeatSuccess[roomId] = true;
        } catch (error) {
          console.error(`Failed to send heartbeat for room ${roomId}:`, error);
          this.heartbeatSuccess[roomId] = false;
        }
      }
    }, this.heartbeatFrequency);
  }

  clearHeartbeat(roomId: string) {
    if (this.heartbeatIntervals[roomId]) {
      console.log(`Clearing heartbeat for room ${roomId}`);
      clearInterval(this.heartbeatIntervals[roomId]);
      delete this.heartbeatIntervals[roomId];
      delete this.heartbeatCount[roomId];
      delete this.lastHeartbeatTime[roomId];
      delete this.heartbeatSuccess[roomId];
    }
  }
  
  isHeartbeatHealthy(roomId: string): boolean {
    if (!this.lastHeartbeatTime[roomId]) return false;
    
    const timeSinceLastHeartbeat = Date.now() - this.lastHeartbeatTime[roomId];
    const isRecent = timeSinceLastHeartbeat < this.heartbeatFrequency * 2; // Within 2x heartbeat period
    
    return this.heartbeatSuccess[roomId] && isRecent;
  }
  
  getHeartbeatFrequency(): number {
    return this.heartbeatFrequency;
  }
}

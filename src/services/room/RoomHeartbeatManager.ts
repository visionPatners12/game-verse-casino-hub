
type Channel = {
  send: (msg: any) => void;
};

export class RoomHeartbeatManager {
  private heartbeatIntervals: Record<string, number> = {};
  private heartbeatCount: Record<string, number> = {};

  setupHeartbeat(roomId: string, channel: Channel) {
    if (this.heartbeatIntervals[roomId]) {
      clearInterval(this.heartbeatIntervals[roomId]);
      this.heartbeatCount[roomId] = 0;
    }
    
    console.log(`Setting up heartbeat for room ${roomId}`);
    this.heartbeatCount[roomId] = 0;
    
    this.heartbeatIntervals[roomId] = window.setInterval(() => {
      if (channel) {
        const timestamp = new Date().toISOString();
        this.heartbeatCount[roomId]++;
        
        // Log every 5th heartbeat to avoid console spam
        if (this.heartbeatCount[roomId] % 5 === 0) {
          console.log(`Sending heartbeat #${this.heartbeatCount[roomId]} for room ${roomId} at ${timestamp}`);
        }
        
        channel.send({
          type: 'broadcast',
          event: 'heartbeat',
          payload: { timestamp }
        });
      }
    }, 20000); // Every 20 seconds
  }

  clearHeartbeat(roomId: string) {
    if (this.heartbeatIntervals[roomId]) {
      console.log(`Clearing heartbeat for room ${roomId}`);
      clearInterval(this.heartbeatIntervals[roomId]);
      delete this.heartbeatIntervals[roomId];
      delete this.heartbeatCount[roomId];
    }
  }
}

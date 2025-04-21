
type Channel = {
  send: (msg: any) => void;
};

export class RoomHeartbeatManager {
  private heartbeatIntervals: Record<string, number> = {};

  setupHeartbeat(roomId: string, channel: Channel) {
    if (this.heartbeatIntervals[roomId]) {
      clearInterval(this.heartbeatIntervals[roomId]);
    }
    this.heartbeatIntervals[roomId] = window.setInterval(() => {
      if (channel) {
        channel.send({
          type: 'broadcast',
          event: 'heartbeat',
          payload: { timestamp: new Date().toISOString() }
        });
      }
    }, 30000);
  }

  clearHeartbeat(roomId: string) {
    if (this.heartbeatIntervals[roomId]) {
      clearInterval(this.heartbeatIntervals[roomId]);
      delete this.heartbeatIntervals[roomId];
    }
  }
}

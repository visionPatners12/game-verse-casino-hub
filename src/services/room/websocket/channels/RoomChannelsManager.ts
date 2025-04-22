
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { RoomEventHandlers } from "../handlers/RoomEventHandlers";

export class RoomChannelsManager {
  private channels: Record<string, RealtimeChannel> = {};
  private eventHandlers: RoomEventHandlers;

  constructor() {
    this.eventHandlers = new RoomEventHandlers();
  }

  setupChannel(roomId: string, userId: string | null) {
    if (!roomId || !userId) {
      console.warn("Cannot setup channel - missing roomId or userId");
      return null;
    }
    
    console.log(`Setting up channel for room ${roomId} as user ${userId}`);
    const roomChannel = supabase.channel(`room:${roomId}`);
    
    this.channels[roomId] = this.eventHandlers.setupEventHandlers(roomChannel, roomId);
    return this.channels[roomId];
  }

  getChannel(roomId: string) {
    return this.channels[roomId];
  }

  cleanupChannel(roomId: string) {
    if (this.channels[roomId]) {
      this.channels[roomId].untrack();
      supabase.removeChannel(this.channels[roomId]);
      delete this.channels[roomId];
    }
  }
}

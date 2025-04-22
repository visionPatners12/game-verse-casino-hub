
export { roomService } from './websocket/RoomWebSocketService';
export type { WebSocketBase } from './websocket/WebSocketBase';
export { RoomPresenceService } from './presence/RoomPresenceService';
export { GameStateService } from './game/GameStateService';
export { RoomHeartbeatManager } from './RoomHeartbeatManager';
export { RoomConnectionStorage } from './RoomConnectionStorage';
export { RoomReconnectionManager } from './RoomReconnectionManager';

// Helper functions to be used app-wide - these delegate to the RoomConnectionStorage class
export const getStoredRoomConnection = () => {
  if (typeof window !== 'undefined') {
    try {
      // Check if we have all the required data
      const roomId = sessionStorage.getItem('activeRoomId');
      const userId = sessionStorage.getItem('activeUserId');
      const gameType = sessionStorage.getItem('activeGameType');
      
      console.log(`getStoredRoomConnection called, found: roomId=${roomId}, userId=${userId}, gameType=${gameType}`);
      
      // Return values only if all required fields exist
      if (roomId && userId) {
        return { roomId, userId, gameType };
      } else {
        // If any required field is missing, clear all data
        if (roomId || userId || gameType) {
          console.log('Incomplete room data found, clearing storage');
          clearActiveRoomFromStorage();
        }
        return { roomId: null, userId: null, gameType: null };
      }
    } catch (e) {
      console.error("Failed to access session storage:", e);
      return { roomId: null, userId: null, gameType: null };
    }
  }
  return { roomId: null, userId: null, gameType: null };
};

export const saveActiveRoomToStorage = (roomId: string, userId: string, gameType?: string) => {
  try {
    // If any of the required values are empty, clear everything
    if (!roomId || !userId) {
      clearActiveRoomFromStorage();
      return;
    }
    
    console.log(`saveActiveRoomToStorage called with: roomId=${roomId}, userId=${userId}, gameType=${gameType}`);
    sessionStorage.setItem('activeRoomId', roomId);
    sessionStorage.setItem('activeUserId', userId);
    if (gameType) {
      sessionStorage.setItem('activeGameType', gameType);
    }
  } catch (error) {
    console.error('Failed to save room data to session storage:', error);
  }
};

export const clearActiveRoomFromStorage = () => {
  try {
    console.log('clearActiveRoomFromStorage called');
    sessionStorage.removeItem('activeRoomId');
    sessionStorage.removeItem('activeUserId');
    sessionStorage.removeItem('activeGameType');
  } catch (error) {
    console.error('Failed to clear room data from session storage:', error);
  }
};

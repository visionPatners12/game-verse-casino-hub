
export { roomService } from './RoomWebSocketService';
export type { WebSocketBase } from './webSocket/WebSocketBase';
export { RoomPresenceService } from './presence/RoomPresenceService';
export { GameStateService } from './game/GameStateService';
export { RoomHeartbeatManager } from './RoomHeartbeatManager';
export { RoomConnectionStorage } from './RoomConnectionStorage';
export { RoomReconnectionManager } from './RoomReconnectionManager';

// Helper functions to be used app-wide
export const getStoredRoomConnection = () => {
  if (typeof window !== 'undefined') {
    return {
      roomId: sessionStorage.getItem('activeRoomId'),
      userId: sessionStorage.getItem('activeUserId'),
      gameType: sessionStorage.getItem('activeGameType'),
    };
  }
  return { roomId: null, userId: null, gameType: null };
};

export const saveActiveRoomToStorage = (roomId: string, userId: string) => {
  try {
    sessionStorage.setItem('activeRoomId', roomId);
    sessionStorage.setItem('activeUserId', userId);
    
    // Also save game type to allow proper routing on reconnection
    const gameType = roomId.split('-')[0];
    if (gameType) {
      sessionStorage.setItem('activeGameType', gameType);
    }
  } catch (error) {
    console.error('Failed to save room data to session storage:', error);
  }
};

export const clearActiveRoomFromStorage = () => {
  try {
    sessionStorage.removeItem('activeRoomId');
    sessionStorage.removeItem('activeUserId');
    sessionStorage.removeItem('activeGameType');
  } catch (error) {
    console.error('Failed to clear room data from session storage:', error);
  }
};

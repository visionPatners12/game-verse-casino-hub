
export class RoomConnectionStorage {
  save(roomId: string, userId: string) {
    try {
      sessionStorage.setItem('activeRoomId', roomId);
      sessionStorage.setItem('activeUserId', userId);
      
      // Also save game type to allow proper routing on reconnection
      const gameType = roomId.split('-')[0];
      if (gameType) {
        sessionStorage.setItem('activeGameType', gameType);
      }
      
      console.log(`Saved room ${roomId} and user ${userId} to session storage for reconnection`);
    } catch (error) {
      console.error('Failed to save room data to session storage:', error);
    }
  }

  clear() {
    try {
      sessionStorage.removeItem('activeRoomId');
      sessionStorage.removeItem('activeUserId');
      sessionStorage.removeItem('activeGameType');
      console.log('Cleared room data from session storage');
    } catch (error) {
      console.error('Failed to clear room data from session storage:', error);
    }
  }

  getStored() {
    try {
      const roomId = sessionStorage.getItem('activeRoomId');
      const userId = sessionStorage.getItem('activeUserId');
      const gameType = sessionStorage.getItem('activeGameType');
      
      if (roomId && userId) {
        console.log(`Found stored room connection: ${roomId} for user ${userId}, game type: ${gameType}`);
      }
      return { roomId, userId, gameType };
    } catch (error) {
      console.error('Failed to get room data from session storage:', error);
      return { roomId: null, userId: null, gameType: null };
    }
  }
}

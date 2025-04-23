
export class RoomConnectionStorage {
  save(roomId: string, userId: string, gameType?: string) {
    try {
      // If any of the required values are empty, clear everything
      if (!roomId || !userId) {
        this.clear();
        return;
      }
      
      console.log(`Saving room connection data: roomId=${roomId}, userId=${userId}, gameType=${gameType}`);
      sessionStorage.setItem('activeRoomId', roomId);
      sessionStorage.setItem('activeUserId', userId);
      // Always store the gameType if provided
      if (gameType) {
        sessionStorage.setItem('activeGameType', gameType);
      }
      console.log(`Saved room ${roomId} and user ${userId} to session storage for reconnection. Game type: ${gameType}`);
    } catch (error) {
      console.error('Failed to save room data to session storage:', error);
    }
  }

  clear() {
    try {
      console.log('Clearing room connection data from storage');
      
      // Nettoyer à la fois sessionStorage et localStorage par sécurité
      // SessionStorage
      sessionStorage.removeItem('activeRoomId');
      sessionStorage.removeItem('activeUserId');
      sessionStorage.removeItem('activeGameType');
      
      // LocalStorage (au cas où)
      localStorage.removeItem('activeRoomId');
      localStorage.removeItem('activeUserId');
      localStorage.removeItem('activeGameType');
      
      console.log('Cleared room data from all storage mechanisms');
    } catch (error) {
      console.error('Failed to clear room data from storage:', error);
    }
  }

  getStored() {
    try {
      const roomId = sessionStorage.getItem('activeRoomId');
      const userId = sessionStorage.getItem('activeUserId');
      const gameType = sessionStorage.getItem('activeGameType');
      
      // Only return valid values if all required fields exist
      if (roomId && userId) {
        console.log(`Found stored room connection: ${roomId} for user ${userId}, game type: ${gameType}`);
        return { roomId, userId, gameType };
      } else {
        // If any required field is missing, clear all data and return null values
        if (roomId || userId || gameType) {
          console.log('Incomplete room data found, clearing storage');
          this.clear();
        }
        return { roomId: null, userId: null, gameType: null };
      }
    } catch (error) {
      console.error('Failed to get room data from session storage:', error);
      return { roomId: null, userId: null, gameType: null };
    }
  }

  hasStoredConnection() {
    const { roomId, userId } = this.getStored();
    return Boolean(roomId && userId);
  }
}

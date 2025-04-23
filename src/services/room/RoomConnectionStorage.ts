
export class RoomConnectionStorage {
  save(roomId: string, userId: string, gameType?: string) {
    try {
      // If any of the required values are empty, clear everything
      if (!roomId || !userId) {
        this.clear();
        return;
      }
      
      console.log(`Saving room connection data: roomId=${roomId}, userId=${userId}, gameType=${gameType}`);
      
      // Store both in sessionStorage and localStorage for redundancy
      sessionStorage.setItem('activeRoomId', roomId);
      localStorage.setItem('activeRoomId', roomId);
      
      sessionStorage.setItem('activeUserId', userId);
      localStorage.setItem('activeUserId', userId);
      
      // Always store the gameType if provided
      if (gameType) {
        sessionStorage.setItem('activeGameType', gameType);
        localStorage.setItem('activeGameType', gameType);
      }
      
      console.log(`Saved room ${roomId} and user ${userId} to storage for reconnection. Game type: ${gameType}`);
    } catch (error) {
      console.error('Failed to save room data to storage:', error);
    }
  }

  clear() {
    try {
      console.log('Clearing room connection data from storage');
      // Clear both session and local storage to be safe
      sessionStorage.removeItem('activeRoomId');
      sessionStorage.removeItem('activeUserId');
      sessionStorage.removeItem('activeGameType');
      
      // Also clear from localStorage as a precaution
      localStorage.removeItem('activeRoomId');
      localStorage.removeItem('activeUserId');
      localStorage.removeItem('activeGameType');
      
      console.log('Cleared room data from all storage');
    } catch (error) {
      console.error('Failed to clear room data from storage:', error);
    }
  }

  getStored() {
    try {
      // First try sessionStorage, then fall back to localStorage
      const roomId = sessionStorage.getItem('activeRoomId') || localStorage.getItem('activeRoomId');
      const userId = sessionStorage.getItem('activeUserId') || localStorage.getItem('activeUserId');
      const gameType = sessionStorage.getItem('activeGameType') || localStorage.getItem('activeGameType');
      
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
      console.error('Failed to get room data from storage:', error);
      return { roomId: null, userId: null, gameType: null };
    }
  }

  hasStoredConnection() {
    const { roomId, userId } = this.getStored();
    return Boolean(roomId && userId);
  }
}

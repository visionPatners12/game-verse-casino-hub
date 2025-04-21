
export class RoomConnectionStorage {
  save(roomId: string, userId: string) {
    try {
      sessionStorage.setItem('activeRoomId', roomId);
      sessionStorage.setItem('activeUserId', userId);
      console.log(`Saved room ${roomId} and user ${userId} to session storage for reconnection`);
    } catch (error) {
      console.error('Failed to save room data to session storage:', error);
    }
  }

  clear() {
    try {
      sessionStorage.removeItem('activeRoomId');
      sessionStorage.removeItem('activeUserId');
      console.log('Cleared room data from session storage');
    } catch (error) {
      console.error('Failed to clear room data from session storage:', error);
    }
  }

  getStored() {
    try {
      const roomId = sessionStorage.getItem('activeRoomId');
      const userId = sessionStorage.getItem('activeUserId');
      if (roomId && userId) {
        console.log(`Found stored room connection: ${roomId} for user ${userId}`);
      }
      return { roomId, userId };
    } catch (error) {
      console.error('Failed to get room data from session storage:', error);
      return { roomId: null, userId: null };
    }
  }
}

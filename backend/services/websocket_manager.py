"""WebSocket Manager for Phase V - Real-time sync."""

import logging
from typing import List, Dict, Any
from fastapi import WebSocket

logger = logging.getLogger(__name__)

class ConnectionManager:
    """Manages WebSocket connections for real-time updates."""
    
    def __init__(self):
        # user_id -> list of websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        """Connect a new client."""
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        logger.info(f"🔌 WebSocket connected for User {user_id}. Total connections: {len(self.active_connections[user_id])}")

    def disconnect(self, websocket: WebSocket, user_id: str):
        """Disconnect a client."""
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        logger.info(f"🔌 WebSocket disconnected for User {user_id}")

    async def broadcast_to_user(self, user_id: str, message: Any):
        """Send message to all connections of a specific user."""
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"❌ Error broadcasting to User {user_id}: {e}")
                    # Ideally remove broken connection here

# Singleton instance
manager = ConnectionManager()

def get_websocket_manager() -> ConnectionManager:
    return manager

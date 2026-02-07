"""WebSocket routes for Phase V - Real-time sync."""

import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from services.websocket_manager import get_websocket_manager
from dependencies.auth import get_current_user_from_token  # We need a helper for token in query params

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ws", tags=["websocket"])

@router.websocket("/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """
    WebSocket endpoint for real-time task updates.
    
    URL: /ws/{user_id}?token=...
    """
    manager = get_websocket_manager()
    
    # In a real app, we would validate the token from query params here
    # token = websocket.query_params.get("token")
    # ... validation ...
    
    await manager.connect(websocket, user_id)
    try:
        while True:
            # We don't expect much FROM the client here, mostly push TO them
            data = await websocket.receive_text()
            # Handle client messages if needed (e.g., ping/pong)
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
    except Exception as e:
        logger.error(f"❌ WebSocket error: {e}")
        manager.disconnect(websocket, user_id)

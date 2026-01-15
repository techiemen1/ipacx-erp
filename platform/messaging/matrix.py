import os
import logging

logger = logging.getLogger(__name__)

class MatrixConnector:
    """
    Connector for Matrix (Synapse) Chat.
    """
    def __init__(self):
        self.homeserver = os.environ.get("MATRIX_HOMESERVER", "https://matrix.org")
        self.access_token = os.environ.get("MATRIX_ACCESS_TOKEN", "")
        self.enabled = bool(self.access_token)

    def create_room(self, room_alias: str, name: str):
        if not self.enabled:
            logger.info(f"[Mock] Creating Matrix room '{name}' ({room_alias})")
            return "mock-room-id"
        # Real impl request to /_matrix/client/r0/createRoom
        pass

    def send_message(self, room_id: str, message: str):
        if not self.enabled:
            logger.info(f"[Mock] Message to {room_id}: {message}")
            return
        # Real impl
        pass

from abc import ABC, abstractmethod
from typing import Dict, Any, List
import logging

logger = logging.getLogger(__name__)

class NotificationAdapter(ABC):
    @abstractmethod
    def send(self, to: str, subject: str, content: str, channel: str = "email"):
        pass

class ConsoleNotificationAdapter(NotificationAdapter):
    """
    Default adapter for localhost development. Prints to console.
    """
    def send(self, to: str, subject: str, content: str, channel: str = "email"):
        print(f"--- NOTIFICATION [{channel}] ---")
        print(f"To: {to}")
        print(f"Subject: {subject}")
        print(f"Content: {content}")
        print("-------------------------------")

class NovuAdapter(NotificationAdapter):
    """
    Adapter for Novu (Open Source Notification Infrastructure).
    """
    def __init__(self, api_key: str):
        self.api_key = api_key

    def send(self, to: str, subject: str, content: str, channel: str = "email"):
        # Real impl: requests.post("https://api.novu.co/...", ...)
        logger.info(f"Sending via Novu to {to}")

def get_notifier():
    import os
    if os.environ.get("NOVU_API_KEY"):
        return NovuAdapter(os.environ.get("NOVU_API_KEY"))
    return ConsoleNotificationAdapter()

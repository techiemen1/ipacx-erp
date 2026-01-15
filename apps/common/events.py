from typing import Callable, Any, List, Dict, Type
from dataclasses import dataclass
import asyncio
import logging

logger = logging.getLogger(__name__)

@dataclass
class DomainEvent:
    name: str
    payload: Dict[str, Any]

class EventBus:
    """
    Simple in-memory event bus for decoupling modules.
    Modules can subscribe to events and publish them.
    """
    _subscribers: Dict[str, List[Callable[[DomainEvent], Any]]] = {}

    @classmethod
    def subscribe(cls, event_name: str, handler: Callable[[DomainEvent], Any]):
        if event_name not in cls._subscribers:
            cls._subscribers[event_name] = []
        cls._subscribers[event_name].append(handler)
        logger.info(f"Subscribed handler {handler.__name__} to event {event_name}")

    @classmethod
    async def publish(cls, event: DomainEvent):
        """
        Publish an event to all subscribers.
        """
        if event.name not in cls._subscribers:
            return

        handlers = cls._subscribers[event.name]
        for handler in handlers:
            try:
                # Support both sync and async handlers
                if asyncio.iscoroutinefunction(handler):
                    await handler(event)
                else:
                    handler(event)
            except Exception as e:
                logger.error(f"Error handling event {event.name}: {str(e)}")

# Global instance (if needed, or use class methods directly)
event_bus = EventBus()

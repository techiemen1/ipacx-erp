from contextvars import ContextVar
from typing import Optional
import uuid

# Context variables to hold request-scoped state
_tenant_id_ctx: ContextVar[Optional[str]] = ContextVar("tenant_id", default=None)
_user_id_ctx: ContextVar[Optional[str]] = ContextVar("user_id", default=None)
_org_id_ctx: ContextVar[Optional[str]] = ContextVar("org_id", default=None)

class ExecutionContext:
    """
    Helper class to manage execution context (Tenant, User, Organization).
    """

    @staticmethod
    def set_tenant_id(tenant_id: str) -> None:
        _tenant_id_ctx.set(tenant_id)

    @staticmethod
    def get_tenant_id() -> Optional[str]:
        return _tenant_id_ctx.get()

    @staticmethod
    def set_user_id(user_id: str) -> None:
        _user_id_ctx.set(user_id)

    @staticmethod
    def get_user_id() -> Optional[str]:
        return _user_id_ctx.get()

    @staticmethod
    def set_org_id(org_id: str) -> None:
        _org_id_ctx.set(org_id)
        
    @staticmethod
    def get_org_id() -> Optional[str]:
        return _org_id_ctx.get()

    @staticmethod
    def clear() -> None:
        _tenant_id_ctx.set(None)
        _user_id_ctx.set(None)
        _org_id_ctx.set(None)

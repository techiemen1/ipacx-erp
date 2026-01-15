from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from apps.common.context import ExecutionContext

class TenantContextMiddleware(BaseHTTPMiddleware):
    """
    Middleware to extract tenant_id and user_id from headers/token
    and set them in the ExecutionContext.
    """
    async def dispatch(self, request: Request, call_next):
        # Reset context at start of request
        ExecutionContext.clear()

        # In a real app, this would come from the JWT token decoded by Keycloak
        # For now, we trust headers for internal/dev usage or behind gateway
        tenant_id = request.headers.get("X-Tenant-ID")
        user_id = request.headers.get("X-User-ID")
        org_id = request.headers.get("X-Org-ID")

        if tenant_id:
            ExecutionContext.set_tenant_id(tenant_id)
        if user_id:
            ExecutionContext.set_user_id(user_id)
        if org_id:
            ExecutionContext.set_org_id(org_id)

        response = await call_next(request)
        
        # Cleanup (good practice, though contextvars are async-safe)
        ExecutionContext.clear()
        
        return response

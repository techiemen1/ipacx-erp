from apps.common.context import ExecutionContext

class TenantContextMiddleware:
    """
    Middleware to extract tenant_id and user_id from headers/token
    and set them in the ExecutionContext.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Reset context at start of request
        ExecutionContext.clear()

        # In a real app, this would come from the JWT token decoded by Keycloak
        # For now, we trust headers for internal/dev usage or behind gateway
        tenant_id = request.headers.get("X-Tenant-ID")
        user_id = request.headers.get("X-User-ID")
        org_id = request.headers.get("X-Org-ID")

        # Fallback: check session or user if authenticated by Django's auth
        if not user_id and request.user.is_authenticated:
            user_id = str(request.user.id)

        if tenant_id:
            ExecutionContext.set_tenant_id(tenant_id)
        if user_id:
            ExecutionContext.set_user_id(user_id)
        if org_id:
            ExecutionContext.set_org_id(org_id)

        response = self.get_response(request)
        
        # Cleanup
        ExecutionContext.clear()
        
        return response

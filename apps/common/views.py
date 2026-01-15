from django.http import JsonResponse
from django.conf import settings

def api_root(request):
    return JsonResponse({
        "status": "ok",
        "system": "IPACX ERP",
        "version": "0.1.0-alpha",
        "message": "Welcome to IPACX ERP API",
        "endpoints": {
            "admin": "/admin/",
            "accounting": "/api/accounting/",
            "docs": "/docs/ (Coming Soon)"
        }
    })

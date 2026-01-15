from django.contrib import admin
from django.urls import path, include

from apps.common.views import api_root

# --- Admin Customization ---
admin.site.site_header = "IPACX ERP Administration"
admin.site.site_title = "IPACX ERP Admin"
admin.site.index_title = "Module Dashboard"

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    # We will include app URLs here as we build them, e.g.:
    path('api/accounting/', include('apps.accounting.api.urls')),
    path('api/inventory/', include('apps.inventory.api.urls')),
    path('api/common/', include('apps.common.api.urls')),
]

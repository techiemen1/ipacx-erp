from django.contrib import admin
from apps.common.models import Organization, TenantUser, AuditLog

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    search_fields = ('name', 'slug')

@admin.register(TenantUser)
class TenantUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'organization', 'is_admin')
    list_filter = ('organization', 'is_admin')

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'entity_name', 'entity_id', 'user_id', 'tenant_id', 'created_at')
    list_filter = ('action', 'entity_name')
    readonly_fields = [field.name for field in AuditLog._meta.get_fields()]

    def has_add_permission(self, request):
        return False

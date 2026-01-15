from django.db import models
from apps.common.context import ExecutionContext
import uuid

class TenantAwareModel(models.Model):
    """
    Abstract base model that includes tenant_id and standard audit fields.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tenant_id = models.CharField(max_length=64, db_index=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        # Auto-inject tenant_id from context if not provided
        if not self.tenant_id:
            current_tenant = ExecutionContext.get_tenant_id()
            if current_tenant:
                self.tenant_id = current_tenant
            else:
                # Fallback for superuser/system actions -> 'public' or None
                # For strict multi-tenancy, we might want to raise an error
                pass 
        super().save(*args, **kwargs)

class AuditLog(TenantAwareModel):
    """
    Centralized Audit Log table.
    """
    action = models.CharField(max_length=32) # CREATE, UPDATE, DELETE
    entity_name = models.CharField(max_length=128)
    entity_id = models.CharField(max_length=64)
    user_id = models.CharField(max_length=64, null=True, blank=True)
    changes = models.TextField(null=True, blank=True) # JSON string

    class Meta:
        db_table = 'audit_logs'

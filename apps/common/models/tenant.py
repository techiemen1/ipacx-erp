from django.db import models
from django.contrib.auth.models import User
import uuid

class Organization(models.Model):
    """
    Represents a Tenant in the system.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, help_text="Unique identifier for the tenant (e.g. acme-corp)")
    
    # Metadata
    address = models.TextField(blank=True, null=True)
    tax_id = models.CharField(max_length=50, blank=True, null=True)
    
    # Localization
    currency = models.CharField(max_length=3, default='USD', help_text="ISO 4217 Currency Code (e.g. USD, EUR)")
    timezone = models.CharField(max_length=50, default='UTC', help_text="Timezone (e.g. UTC, Asia/Kolkata)")
    locale = models.CharField(max_length=10, default='en-us', help_text="Locale code (e.g. en-us)")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class TenantUser(models.Model):
    """
    Links a User to an Organization.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tenant_memberships')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='members')
    
    is_admin = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'organization')

    def __str__(self):
        return f"{self.user.username} @ {self.organization.name}"

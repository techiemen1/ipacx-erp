from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.common.models.base import TenantAwareModel
from decimal import Decimal

class Warehouse(TenantAwareModel):
    name = models.CharField(max_length=128)
    code = models.CharField(max_length=32, db_index=True)
    address = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('tenant_id', 'code')

    def __str__(self):
        return f"[{self.code}] {self.name}"

class ProductCategory(TenantAwareModel):
    name = models.CharField(max_length=64)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')

    class Meta:
        verbose_name_plural = "Product Categories"

    def __str__(self):
        return self.name

class ProductType(models.TextChoices):
    STORABLE = 'STORABLE', _('Storable Product')
    SERVICE = 'SERVICE', _('Service')
    CONSUMABLE = 'CONSUMABLE', _('Consumable')

class Product(TenantAwareModel):
    name = models.CharField(max_length=128)
    sku = models.CharField(max_length=64, db_index=True, verbose_name="SKU")
    category = models.ForeignKey(ProductCategory, on_delete=models.SET_NULL, null=True, blank=True)
    product_type = models.CharField(max_length=16, choices=ProductType.choices, default=ProductType.STORABLE)
    
    # Pricing
    list_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    cost_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00')) # Standard cost

    description = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('tenant_id', 'sku')

    def __str__(self):
        return f"[{self.sku}] {self.name}"

class StockMove(TenantAwareModel):
    """
    Represents a movement of stock from one location (Warehouse) to another.
    If 'from_warehouse' is None, it is an INCOMING shipment (Supplier -> Us).
    If 'to_warehouse' is None, it is an OUTGOING shipment (Us -> Customer/Loss).
    """
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='moves')
    qty = models.DecimalField(max_digits=12, decimal_places=4)
    
    from_warehouse = models.ForeignKey(Warehouse, on_delete=models.PROTECT, null=True, blank=True, related_name='outgoing_moves')
    to_warehouse = models.ForeignKey(Warehouse, on_delete=models.PROTECT, null=True, blank=True, related_name='incoming_moves')
    
    date = models.DateTimeField(auto_now_add=True)
    reference = models.CharField(max_length=128, help_text="Order ID, internal ref, etc.")
    
    # Link to Accounting (Optional for now, but good to plan)
    # voucher = models.ForeignKey('accounting.Voucher', ...) 

    def __str__(self):
        src = self.from_warehouse.code if self.from_warehouse else "Vendor"
        dst = self.to_warehouse.code if self.to_warehouse else "Customer"
        return f"{self.date.date()} | {self.product.sku}: {self.qty} ({src} -> {dst})"

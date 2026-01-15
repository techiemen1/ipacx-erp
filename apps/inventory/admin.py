from django.contrib import admin
from .models import Warehouse, ProductCategory, Product, StockMove
from django.db.models import Sum, Case, When, F, DecimalField

@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'address')

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('sku', 'name', 'product_type', 'list_price', 'current_stock_demo')
    search_fields = ('sku', 'name')
    list_filter = ('product_type', 'category')

    # This is a naive calculation for List View demo. 
    # In production, this should be a separate query/service call or cached field.
    def current_stock_demo(self, obj):
        # Just summing up all incoming - outgoing across ALL warehouses for this tenant
        # This is strictly for the admin list view convenience
        incoming = obj.moves.filter(to_warehouse__isnull=False).aggregate(t=Sum('qty'))['t'] or 0
        outgoing = obj.moves.filter(from_warehouse__isnull=False).aggregate(t=Sum('qty'))['t'] or 0
        return incoming - outgoing
    
    current_stock_demo.short_description = "Global Stock (Est)"

@admin.register(StockMove)
class StockMoveAdmin(admin.ModelAdmin):
    list_display = ('date', 'reference', 'product', 'qty', 'from_warehouse', 'to_warehouse')
    list_filter = ('date', 'product', 'from_warehouse', 'to_warehouse')
    search_fields = ('reference', 'product__sku')

    # Moves are audit logs -> Read Only ideally, but editable for correction in MVP

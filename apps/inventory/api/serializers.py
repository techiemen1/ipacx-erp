from rest_framework import serializers
from apps.inventory.models import Product, Warehouse, StockMove, ProductCategory
from apps.inventory.services.stock import StockService
from django.db import transaction

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'
        read_only_fields = ('tenant_id', 'created_at', 'updated_at')

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'
        read_only_fields = ('tenant_id', 'created_at', 'updated_at')

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ('tenant_id', 'created_at', 'updated_at')

class StockMoveSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    from_wh_code = serializers.CharField(source='from_warehouse.code', read_only=True)
    to_wh_code = serializers.CharField(source='to_warehouse.code', read_only=True)

    class Meta:
        model = StockMove
        fields = '__all__'
        read_only_fields = ('tenant_id', 'created_at', 'updated_at')

class StockTransferSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    qty = serializers.DecimalField(max_digits=12, decimal_places=4)
    from_warehouse_id = serializers.UUIDField(required=False, allow_null=True)
    to_warehouse_id = serializers.UUIDField(required=False, allow_null=True)
    reference = serializers.CharField(max_length=128)

    def validate(self, data):
        if not data.get('from_warehouse_id') and not data.get('to_warehouse_id'):
            raise serializers.ValidationError("Must specify at least one warehouse.")
        return data

    def create(self, validated_data):
        return StockService.transfer_stock(
            product=Product.objects.get(id=validated_data['product_id']),
            qty=validated_data['qty'],
            reference=validated_data['reference'],
            from_wh=Warehouse.objects.filter(id=validated_data.get('from_warehouse_id')).first(),
            to_wh=Warehouse.objects.filter(id=validated_data.get('to_warehouse_id')).first()
        )

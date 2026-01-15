from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.inventory.models import Product, Warehouse, StockMove, ProductCategory
from apps.inventory.api.serializers import (
    ProductSerializer, WarehouseSerializer, StockMoveSerializer, 
    ProductCategorySerializer, StockTransferSerializer
)

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer

class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filterset_fields = ['category', 'product_type']
    search_fields = ['name', 'sku']

class StockMoveViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only view of the stock ledger.
    To create moves, use the 'transfer' endpoint.
    """
    queryset = StockMove.objects.all().order_by('-date')
    serializer_class = StockMoveSerializer
    filterset_fields = ['product', 'from_warehouse', 'to_warehouse']

    @action(detail=False, methods=['post'])
    def transfer(self, request):
        serializer = StockTransferSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        move = serializer.save()
        return Response(StockMoveSerializer(move).data, status=status.HTTP_201_CREATED)

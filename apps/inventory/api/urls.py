from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.inventory.api.views import (
    ProductViewSet, WarehouseViewSet, StockMoveViewSet, ProductCategoryViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'warehouses', WarehouseViewSet)
router.register(r'stock/moves', StockMoveViewSet, basename='stockmove')
router.register(r'categories', ProductCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

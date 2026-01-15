from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.accounting.api.views import AccountViewSet, VoucherViewSet, LedgerViewSet

router = DefaultRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'vouchers', VoucherViewSet)
router.register(r'ledger', LedgerViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

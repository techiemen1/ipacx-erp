from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from apps.accounting.models import Account, Voucher, LedgerEntry
from apps.accounting.api.serializers import AccountSerializer, VoucherSerializer, LedgerEntrySerializer
from apps.accounting.services.ledger import LedgerService

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    filterset_fields = ['account_type', 'is_active', 'code']

class VoucherViewSet(viewsets.ModelViewSet):
    queryset = Voucher.objects.all()
    serializer_class = VoucherSerializer
    filterset_fields = ['voucher_type', 'is_posted', 'date']

    @action(detail=True, methods=['post'])
    def post_to_ledger(self, request, pk=None):
        voucher = self.get_object()
        try:
            LedgerService.post_voucher(voucher)
            return Response({'status': 'posted', 'is_posted': True})
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LedgerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LedgerEntry.objects.all().select_related('account')
    serializer_class = LedgerEntrySerializer
    filterset_fields = ['account', 'date']

from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.common.models.base import TenantAwareModel
from decimal import Decimal

class AccountType(models.TextChoices):
    ASSET = 'ASSET', _('Asset')
    LIABILITY = 'LIABILITY', _('Liability')
    EQUITY = 'EQUITY', _('Equity')
    INCOME = 'INCOME', _('Income')
    EXPENSE = 'EXPENSE', _('Expense')

class Account(TenantAwareModel):
    """
    Chart of Accounts.
    """
    code = models.CharField(max_length=32, db_index=True)
    name = models.CharField(max_length=128)
    account_type = models.CharField(max_length=16, choices=AccountType.choices)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    currency = models.CharField(max_length=3, default='USD') # Multi-currency support start

    class Meta:
        unique_together = ('tenant_id', 'code')
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.name}"

class VoucherType(models.TextChoices):
    JOURNAL = 'JOURNAL', _('Journal Entry')
    SALES = 'SALES', _('Sales Invoice')
    PURCHASE = 'PURCHASE', _('Purchase Invoice')
    PAYMENT = 'PAYMENT', _('Payment')
    RECEIPT = 'RECEIPT', _('Receipt')
    CONTRA = 'CONTRA', _('Contra')

class Voucher(TenantAwareModel):
    """
    Transaction Header (Journal Entry).
    """
    voucher_number = models.CharField(max_length=64, db_index=True)
    voucher_type = models.CharField(max_length=16, choices=VoucherType.choices)
    date = models.DateField()
    description = models.TextField(blank=True, null=True)
    
    # Workflow state
    is_posted = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('tenant_id', 'voucher_number')
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.voucher_number} ({self.voucher_type})"

class VoucherEntry(TenantAwareModel):
    """
    Line items for a voucher.
    Total Debits must equal Total Credits per voucher.
    """
    voucher = models.ForeignKey(Voucher, on_delete=models.CASCADE, related_name='entries')
    account = models.ForeignKey(Account, on_delete=models.PROTECT)
    description = models.CharField(max_length=255, blank=True, null=True)
    
    debit = models.DecimalField(max_digits=20, decimal_places=4, default=Decimal("0.00"))
    credit = models.DecimalField(max_digits=20, decimal_places=4, default=Decimal("0.00"))

    def __str__(self):
        return f"{self.account.code}: Dr {self.debit} | Cr {self.credit}"

class LedgerEntry(TenantAwareModel):
    """
    Immutable posted records for reporting.
    Populated only when a Voucher is POSTED.
    """
    account = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='ledger_entries')
    voucher = models.ForeignKey(Voucher, on_delete=models.PROTECT) # Protect to ensure audit trail
    date = models.DateField(db_index=True) # Duplicated from voucher for query speed
    
    debit = models.DecimalField(max_digits=20, decimal_places=4)
    credit = models.DecimalField(max_digits=20, decimal_places=4)
    
    # Running balance snapshot? (Optional, skipping for now to rely on summation)
    
    class Meta:
        indexes = [
            models.Index(fields=['tenant_id', 'date', 'account']),
        ]

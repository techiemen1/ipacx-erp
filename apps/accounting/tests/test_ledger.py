from django.test import TestCase
from decimal import Decimal
from django.core.exceptions import ValidationError
from apps.accounting.models import Account, AccountType, Voucher, VoucherType, VoucherEntry, LedgerEntry
from apps.accounting.services.ledger import LedgerService
import datetime

class LedgerServiceTest(TestCase):
    def setUp(self):
        # Setup Chart of Accounts
        self.cash = Account.objects.create(code="1000", name="Cash", account_type=AccountType.ASSET)
        self.sales = Account.objects.create(code="4000", name="Sales", account_type=AccountType.INCOME)
        self.expense = Account.objects.create(code="5000", name="Expense", account_type=AccountType.EXPENSE)

    def test_post_balanced_voucher(self):
        voucher = Voucher.objects.create(
            voucher_number="V001", 
            voucher_type=VoucherType.SALES, 
            date=datetime.date.today()
        )
        # Dr Cash 100, Cr Sales 100
        VoucherEntry.objects.create(voucher=voucher, account=self.cash, debit=Decimal("100.00"), credit=Decimal("0.00"))
        VoucherEntry.objects.create(voucher=voucher, account=self.sales, debit=Decimal("0.00"), credit=Decimal("100.00"))

        LedgerService.post_voucher(voucher)

        self.assertTrue(voucher.is_posted)
        self.assertEqual(LedgerEntry.objects.count(), 2)
        
        # Verify Ledger Entries
        cash_entry = LedgerEntry.objects.get(account=self.cash)
        self.assertEqual(cash_entry.debit, Decimal("100.00"))

    def test_post_unbalanced_voucher_fails(self):
        voucher = Voucher.objects.create(
             voucher_number="V002", 
            voucher_type=VoucherType.JOURNAL, 
            date=datetime.date.today()
        )
        # Dr Cash 100, Cr 0 (Unbalanced)
        VoucherEntry.objects.create(voucher=voucher, account=self.cash, debit=Decimal("100.00"), credit=Decimal("0.00"))
        
        with self.assertRaisesMessage(ValidationError, "Voucher is unbalanced"):
            LedgerService.post_voucher(voucher)
        
        self.assertFalse(voucher.is_posted)
        self.assertEqual(LedgerEntry.objects.count(), 0)

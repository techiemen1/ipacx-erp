from django.db import transaction
from django.core.exceptions import ValidationError
from decimal import Decimal
from apps.accounting.models import Voucher, LedgerEntry, VoucherEntry

class LedgerService:
    @staticmethod
    @transaction.atomic
    def post_voucher(voucher: Voucher):
        """
        Validates and posts a voucher to the General Ledger.
        """
        if voucher.is_posted:
            raise ValidationError("Voucher is already posted.")

        entries = voucher.entries.all()
        if not entries:
            raise ValidationError("Voucher has no entries.")

        total_debit = sum(e.debit for e in entries)
        total_credit = sum(e.credit for e in entries)

        # Basic Check: Debits == Credits
        if total_debit != total_credit:
            raise ValidationError(f"Voucher is unbalanced: Debit={total_debit}, Credit={total_credit}")

        # Create Ledger Entries (Immutable)
        ledger_entries = []
        for entry in entries:
            ledger_entries.append(LedgerEntry(
                tenant_id=voucher.tenant_id, # Inherit from voucher
                account=entry.account,
                voucher=voucher,
                date=voucher.date,
                debit=entry.debit,
                credit=entry.credit
            ))
        
        LedgerEntry.objects.bulk_create(ledger_entries)

        # Mark as posted
        voucher.is_posted = True
        voucher.save()

        return voucher

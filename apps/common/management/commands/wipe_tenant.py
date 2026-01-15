from django.core.management.base import BaseCommand
from django.db import transaction
from apps.common.models import Organization, TenantUser, AuditLog
from apps.accounting.models import Account, Voucher, VoucherEntry, LedgerEntry, AccountType
from apps.inventory.models import Product, Warehouse, StockMove, ProductCategory

class Command(BaseCommand):
    help = 'Hard deletes ALL data for a specific tenant.'

    def add_arguments(self, parser):
        parser.add_argument('tenant_slug', type=str, help='The slug of the tenant to wipe')
        parser.add_argument('--force', action='store_true', help='Skip confirmation')

    def handle(self, *args, **options):
        slug = options['tenant_slug']
        
        try:
            org = Organization.objects.get(slug=slug)
        except Organization.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Organization "{slug}" not found.'))
            return

        if not options['force']:
            confirm = input(f"Are you sure you want to WIPE ALL DATA for '{org.name}' ({slug})? [y/N]: ")
            if confirm.lower() != 'y':
                self.stdout.write('Operation cancelled.')
                return

        with transaction.atomic():
            self.stdout.write(f'Wiping data for: {org.name}...')
            
            # Inventory
            self._delete_tenant_data(StockMove, slug)
            self._delete_tenant_data(Product, slug)
            self._delete_tenant_data(Warehouse, slug) 
            self._delete_tenant_data(ProductCategory, slug)

            # Accounting
            self._delete_tenant_data(LedgerEntry, slug)
            self._delete_tenant_data(VoucherEntry, slug)
            self._delete_tenant_data(Voucher, slug)
            self._delete_tenant_data(Account, slug)
            self._delete_tenant_data(AccountType, slug)

            self.stdout.write(self.style.SUCCESS(f'Successfully wiped data for {slug}'))

    def _delete_tenant_data(self, model, tenant_id):
        count, _ = model.objects.filter(tenant_id=tenant_id).delete()
        if count > 0:
            self.stdout.write(f'  - Deleted {count} {model.__name__} records')

from django.core.management.base import BaseCommand
from apps.common.models import Organization
from apps.common.context import ExecutionContext
from apps.accounting.models import Account, AccountType
from apps.inventory.models import Product, ProductCategory, Warehouse

class Command(BaseCommand):
    help = 'Seeds a tenant with demo data (COA, Products, etc.)'

    def add_arguments(self, parser):
        parser.add_argument('tenant_slug', type=str, help='The slug of the tenant to seed')

    def handle(self, *args, **options):
        slug = options['tenant_slug']
        
        try:
            org = Organization.objects.get(slug=slug)
        except Organization.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Organization "{slug}" not found.'))
            return

        self.stdout.write(f'Seeding data for: {org.name} ({slug})...')
        
        # ACTIVATE CONTEXT
        # This ensures all TenantAwareModels automatically get this tenant_id
        ExecutionContext.set_tenant_id(slug)

        self._seed_accounting()
        self._seed_inventory()

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded data for {slug}'))

    def _seed_accounting(self):
        self.stdout.write('  - Creating Chart of Accounts...')
        
        # Standard Types
        assets, _ = AccountType.objects.get_or_create(code='ASSET', defaults={'name': 'Assets', 'category': 'ASSET'})
        liabilities, _ = AccountType.objects.get_or_create(code='LIAB', defaults={'name': 'Liabilities', 'category': 'LIABILITY'})
        income, _ = AccountType.objects.get_or_create(code='INC', defaults={'name': 'Income', 'category': 'INCOME'})
        expense, _ = AccountType.objects.get_or_create(code='EXP', defaults={'name': 'Expenses', 'category': 'EXPENSE'})
        equity, _ = AccountType.objects.get_or_create(code='EQ', defaults={'name': 'Equity', 'category': 'EQUITY'})

        # Common Accounts
        Account.objects.get_or_create(code='1000', defaults={'name': 'Cash', 'account_type': assets})
        Account.objects.get_or_create(code='1010', defaults={'name': 'Bank', 'account_type': assets})
        Account.objects.get_or_create(code='1200', defaults={'name': 'Accounts Receivable', 'account_type': assets})
        Account.objects.get_or_create(code='2000', defaults={'name': 'Accounts Payable', 'account_type': liabilities})
        Account.objects.get_or_create(code='3000', defaults={'name': 'Capital', 'account_type': equity})
        Account.objects.get_or_create(code='4000', defaults={'name': 'Product Sales', 'account_type': income})
        Account.objects.get_or_create(code='5000', defaults={'name': 'Cost of Goods Sold', 'account_type': expense})
        Account.objects.get_or_create(code='6000', defaults={'name': 'Rent Expense', 'account_type': expense})

    def _seed_inventory(self):
        self.stdout.write('  - Creating Inventory Data...')
        
        # Warehouses
        Warehouse.objects.get_or_create(code='WH-MAIN', defaults={'name': 'Main Warehouse'})
        
        # Categories
        electronics, _ = ProductCategory.objects.get_or_create(name='Electronics')
        furniture, _ = ProductCategory.objects.get_or_create(name='Furniture')

        # Products
        Product.objects.get_or_create(sku='LAPTOP01', defaults={
            'name': 'High-End Laptop',
            'product_type': 'STORABLE',
            'category': electronics,
            'list_price': 1200.00
        })
        Product.objects.get_or_create(sku='DESK01', defaults={
            'name': 'Office Desk',
            'product_type': 'STORABLE',
            'category': furniture,
            'list_price': 350.00
        })
        Product.objects.get_or_create(sku='SERV01', defaults={
            'name': 'Consulting Hour',
            'product_type': 'SERVICE',
            'list_price': 150.00
        })

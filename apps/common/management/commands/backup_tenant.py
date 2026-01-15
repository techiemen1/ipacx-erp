import json
from django.core.management.base import BaseCommand
from django.core.serializers.json import DjangoJSONEncoder
from django.apps import apps
from apps.common.models import Organization

# List of models to backup (order matters for dependencies)
BACKUP_MODELS = [
    'inventory.ProductCategory',
    'inventory.Warehouse',
    'inventory.Product',
    'inventory.StockMove',
    'accounting.AccountType',
    'accounting.Account',
    'accounting.Voucher',
    'accounting.VoucherEntry',
    'accounting.LedgerEntry',
]

class Command(BaseCommand):
    help = 'Exports tenant data to a JSON file.'

    def add_arguments(self, parser):
        parser.add_argument('tenant_slug', type=str, help='The slug of the tenant to backup')
        parser.add_argument('--output', type=str, help='Output file path', default=None)

    def handle(self, *args, **options):
        slug = options['tenant_slug']
        
        try:
            org = Organization.objects.get(slug=slug)
        except Organization.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Organization "{slug}" not found.'))
            return

        data = {
            'tenant_slug': slug,
            'timestamp': str(org.updated_at), # placeholder
            'objects': []
        }

        self.stdout.write(f'Backing up data for: {org.name}...')

        for model_name in BACKUP_MODELS:
            app_label, model_name_str = model_name.split('.')
            model = apps.get_model(app_label, model_name_str)
            
            qs = model.objects.filter(tenant_id=slug)
            count = qs.count()
            self.stdout.write(f'  - Exporting {count} {model_name_str}...')
            
            for obj in qs:
                # Basic serialization
                obj_data = {'model': model_name}
                for field in model._meta.fields:
                    val = getattr(obj, field.name)
                    if val is not None:
                         # Handle foreign keys (UUIDs)
                        if field.is_relation and field.many_to_one:
                             val = str(val.pk) if val else None
                        obj_data[field.name] = val
                
                data['objects'].append(obj_data)

        # Output
        filename = options['output'] or f"{slug}_backup.json"
        with open(filename, 'w') as f:
            json.dump(data, f, cls=DjangoJSONEncoder, indent=2)

        self.stdout.write(self.style.SUCCESS(f'Backup saved to {filename}'))

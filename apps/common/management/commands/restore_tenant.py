import json
from django.core.management.base import BaseCommand
from django.apps import apps
from apps.common.models import Organization
from django.db import transaction

class Command(BaseCommand):
    help = 'Restores tenant data from a JSON file.'

    def add_arguments(self, parser):
        parser.add_argument('backup_file', type=str, help='Path to the backup JSON file')
        parser.add_argument('--force', action='store_true', help='Skip wipe confirmation')

    def handle(self, *args, **options):
        filename = options['backup_file']
        
        with open(filename, 'r') as f:
            data = json.load(f)

        slug = data.get('tenant_slug')
        if not slug:
            self.stdout.write(self.style.ERROR('Invalid backup file: missing tenant_slug'))
            return

        self.stdout.write(f"Restoring data for tenant: {slug}")
        
        # Confirmation
        if not options['force']:
             confirm = input(f"This will OVERWRITE/APPEND to tenant '{slug}'. Proceed? [y/N]: ")
             if confirm.lower() != 'y': return

        with transaction.atomic():
            for item in data['objects']:
                model_label = item.pop('model')
                app_label, model_name = model_label.split('.')
                model = apps.get_model(app_label, model_name)
                
                pk = item.get('id')
                if pk:
                    model.objects.update_or_create(id=pk, defaults=item)

        self.stdout.write(self.style.SUCCESS(f'Restore complete from {filename}'))

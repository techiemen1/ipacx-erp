from rest_framework import serializers
from apps.accounting.models import Account, Voucher, VoucherEntry, LedgerEntry
from apps.accounting.services.ledger import LedgerService
from django.db import transaction

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'
        read_only_fields = ('tenant_id', 'created_at', 'updated_at')

class VoucherEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = VoucherEntry
        fields = ('id', 'account', 'description', 'debit', 'credit')
        read_only_fields = ('tenant_id', 'created_at', 'updated_at')

class VoucherSerializer(serializers.ModelSerializer):
    entries = VoucherEntrySerializer(many=True)

    class Meta:
        model = Voucher
        fields = '__all__'
        read_only_fields = ('tenant_id', 'created_at', 'updated_at', 'is_posted', 'voucher_number')

    def create(self, validated_data):
        entries_data = validated_data.pop('entries')
        
        # Simple auto-numbering logic for demo (in prod, use a sequence generator)
        import uuid
        if 'voucher_number' not in validated_data:
            validated_data['voucher_number'] = str(uuid.uuid4())[:8].upper()

        with transaction.atomic():
            voucher = Voucher.objects.create(**validated_data)
            for entry_data in entries_data:
                VoucherEntry.objects.create(voucher=voucher, **entry_data)
        
        return voucher

    def update(self, instance, validated_data):
        if instance.is_posted:
            raise serializers.ValidationError("Cannot edit a posted voucher.")
            
        entries_data = validated_data.pop('entries', None)
        instance = super().update(instance, validated_data)
        
        if entries_data is not None:
            # Replace entries logic (simplistic for MVP)
            instance.entries.all().delete()
            for entry_data in entries_data:
                VoucherEntry.objects.create(voucher=instance, **entry_data)
        
        return instance

class LedgerEntrySerializer(serializers.ModelSerializer):
    account_code = serializers.CharField(source='account.code', read_only=True)
    account_name = serializers.CharField(source='account.name', read_only=True)

    class Meta:
        model = LedgerEntry
        fields = '__all__'

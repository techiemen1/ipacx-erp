from django.contrib import admin
from .models import Account, Voucher, VoucherEntry, LedgerEntry
from .services.ledger import LedgerService
from django.core.exceptions import ValidationError
from django.contrib import messages

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'account_type', 'parent', 'is_active')
    list_filter = ('account_type', 'is_active')
    search_fields = ('code', 'name')

class VoucherEntryInline(admin.TabularInline):
    model = VoucherEntry
    extra = 2

@admin.register(Voucher)
class VoucherAdmin(admin.ModelAdmin):
    list_display = ('voucher_number', 'date', 'voucher_type', 'is_posted', 'created_at')
    list_filter = ('voucher_type', 'is_posted', 'date')
    inlines = [VoucherEntryInline]
    actions = ['post_selected_vouchers']

    @admin.action(description='Post selected vouchers to Ledger')
    def post_selected_vouchers(self, request, queryset):
        count = 0
        for voucher in queryset:
            try:
                LedgerService.post_voucher(voucher)
                count += 1
            except ValidationError as e:
                self.message_user(request, f"Error posting {voucher.voucher_number}: {e}", level=messages.ERROR)
        
        if count > 0:
            self.message_user(request, f"Successfully posted {count} vouchers.")

@admin.register(LedgerEntry)
class LedgerEntryAdmin(admin.ModelAdmin):
    list_display = ('date', 'account', 'debit', 'credit', 'voucher')
    list_filter = ('date', 'account')
    
    # Ledger is immutable, remove add/delete permissions for safety
    def has_add_permission(self, request):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False

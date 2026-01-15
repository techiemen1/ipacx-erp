from django.db import transaction
from django.core.exceptions import ValidationError
from decimal import Decimal
from apps.inventory.models import StockMove, Product, Warehouse

class StockService:
    @staticmethod
    @transaction.atomic
    def transfer_stock(product: Product, 
                       qty: Decimal, 
                       reference: str, 
                       from_wh: Warehouse = None, 
                       to_wh: Warehouse = None):
        """
        Moves stock. 
        - from_wh=None -> Supplier Receipt (Increase Stock)
        - to_wh=None -> Customer Delivery/Loss (Decrease Stock)
        - Both Set -> Internal Transfer
        """
        if qty <= 0:
            raise ValidationError("Quantity must be positive.")
        
        if not from_wh and not to_wh:
             raise ValidationError("At least one warehouse (source or dest) must be specified.")

        # Optional: Check availability in from_wh if enforced
        # For MVP, allowing negative stock to keep operations unblocked.

        move = StockMove.objects.create(
            product=product,
            qty=qty,
            from_warehouse=from_wh,
            to_warehouse=to_wh,
            reference=reference
        )
        return move

    @staticmethod
    def get_stock_level(product: Product, warehouse: Warehouse) -> Decimal:
        """
        Calculates current stock by aggregating moves.
        Ideally cached or materialized view in prod.
        """
        incoming = StockMove.objects.filter(product=product, to_warehouse=warehouse).aggregate(
            total=models.Sum('qty')
        )['total'] or Decimal('0.00')
        
        outgoing = StockMove.objects.filter(product=product, from_warehouse=warehouse).aggregate(
            total=models.Sum('qty')
        )['total'] or Decimal('0.00')
        
        return incoming - outgoing

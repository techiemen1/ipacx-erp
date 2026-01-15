# IPACX ERP - Technical Documentation

## 1. Architecture
- **Type**: Multi-Tenant (Shared Schema, Tenant ID Filtering).
- **Backend**: Django 4.2 + Django REST Framework.
- **Frontend**: React 18 + Vite + Tailwind CSS.
- **Database**: PostgreSQL (Production) / SQLite (Dev).
- **Async**: Celery + Redis.

## 2. Multi-Tenancy Implementation
- **TenantAwareModel**: Abstract base model in `apps.common.models`.
    - Automatically injects `tenant_id` on save.
    - Filters queries by `tenant_id` (via Manager - *To Be Implemented fully*).
- **ExecutionContext**: Uses `contextvars` to store the current request's Tenant ID (from Auth Token or Header).

## 3. Key Modules
### Accounting (`apps.accounting`)
- **Double Entry**: `LedgerService.post_voucher()` ensures Debits == Credits.
- **Models**: `Account`, `Voucher` (Header), `VoucherEntry` (Line), `LedgerEntry` (Posted).

### Inventory (`apps.inventory`)
- **Stock Ledger**: `StockService.transfer()` ensures atomic moves.
- **Models**: `Product`, `Warehouse`, `StockMove`.

## 4. API Reference
### Authentication
- `POST /api/common/auth/register/`: Create Org + User.
- `POST /api/common/auth/login/`: Get credentials.

### Inventory
- `GET /api/inventory/products/`: List products.
- `POST /api/inventory/stock/moves/transfer/`: Execute move.

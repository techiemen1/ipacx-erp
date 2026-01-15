# IPACX ERP - Administrator Guide

## 1. System Management (Django Admin)
- **URL**: `http://localhost:8000/admin`
- **Superuser**: `admin` / `admin` (Created during setup).
- **Capabilities**:
    - Manage **Organizations** (Tenants).
    - Manage **Tenant Users** (Memberships).
    - View global **Audit Logs**.

## 2. Data Management Tools
These tools are run from the command line in the Backend (`ipacx-erp` folder).

### Generating Demo Data
Populates a tenant with standard Chart of Accounts, Products, and Warehouses.
```bash
python manage.py seed_data <tenant_slug>
# Example
python manage.py seed_data acme
```

### Wiping Data (Reset)
**WARNING**: This permanently deletes ALL inventory and accounting data for the specified tenant. User accounts are preserved.
```bash
python manage.py wipe_tenant <tenant_slug>
```

### Backup & Restore
**Backup**: Exports a tenant's data to a JSON file.
```bash
python manage.py backup_tenant <tenant_slug> --output <filename.json>
```

**Restore**: Imports data from a JSON file.
```bash
python manage.py restore_tenant <filename.json>
```

## 3. Localization
- Go to `Admin > Organizations > [Your Org]`.
- Set **Currency** (e.g., USD, EUR).
- Set **Timezone** (e.g., UTC, Asia/Kolkata).

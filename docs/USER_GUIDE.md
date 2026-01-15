# IPACX ERP - User Guide

## 1. Getting Started
### Login and Registration
- **URL**: `http://localhost:5173`
- **First Time?**: Click "Register here" on the login screen.
    - **Org Name**: Your company name.
    - **Org ID**: A short unique code (e.g., `acme`). This is your **Tenant ID**.
    - **Username**: Your admin login.
- **Login**: Enter your Username and Tenant ID.

## 2. Inventory Management
### Dashboard
- View **Total Revenue** (Coming Soon) and quick stats.
- Navigate to **Inventory** in the sidebar.

### Products
- The list shows all items currently defined in your catalog.
- **Stock Level**: Real-time quantity on hand.
- **SKU**: Unique Stock Keeping Unit code.

### Moving Stock (Transfers)
1. Click **Stock Operation**.
2. **Product**: Select the item.
3. **From (Source)**:
    - Leave blank for "Vendor" (Receipt).
    - Select a Warehouse to move FROM.
4. **To (Destination)**:
    - Leave blank for "Customer" (Delivery).
    - Select a Warehouse to move TO.
5. **Qty**: Amount to move.
6. Click **Confirm**.

## 3. Accounting (Beta)
- Currently access via the Backend Admin Panel (`http://localhost:8000/admin`).
- **Vouchers**: Create Journal Entries.
- **Ledger**: View posted transactions.

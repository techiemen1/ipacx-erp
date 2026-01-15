import api from '../lib/axios';

export interface Product {
    id: string;
    name: string;
    sku: string;
    product_type: 'STORABLE' | 'SERVICE' | 'CONSUMABLE';
    list_price: string;
    category_name?: string;
}

export interface StockMove {
    id: string;
    date: string;
    reference: string;
    qty: string;
    product_name: string;
    from_wh_code: string;
    to_wh_code: string;
}

export interface Warehouse {
    id: string;
    name: string;
    code: string;
}

export const inventoryApi = {
    getProducts: () => api.get<Product[]>('inventory/products/'),
    getWarehouses: () => api.get<Warehouse[]>('inventory/warehouses/'),
    getStockMoves: () => api.get<StockMove[]>('inventory/stock/moves/'),

    // Transfer Payload
    transferStock: (payload: {
        product_id: string;
        qty: number;
        from_warehouse_id: string | null;
        to_warehouse_id: string | null;
        reference: string;
    }) => api.post('inventory/stock/moves/transfer/', payload),
};

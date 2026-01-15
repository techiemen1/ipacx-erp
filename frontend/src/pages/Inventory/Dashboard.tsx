import { useEffect, useState } from 'react'
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/20/solid'
import { inventoryApi, Product, StockMove } from '../../api/inventory'
import StockTransferModal from './StockTransfer'

export default function InventoryDashboard() {
    const [products, setProducts] = useState<Product[]>([])
    const [moves, setMoves] = useState<StockMove[]>([])
    const [modalOpen, setModalOpen] = useState(false)

    const fetchData = () => {
        inventoryApi.getProducts().then(r => setProducts(r.data))
        inventoryApi.getStockMoves().then(r => setMoves(r.data))
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-2xl font-bold leading-6 text-gray-900">Inventory Dashboard</h3>
                    <p className="mt-2 text-sm text-gray-500">Real-time overview of your stock and movements.</p>
                </div>
                <div className="mt-3 flex sm:ml-4 sm:mt-0">
                    <button
                        onClick={fetchData}
                        type="button"
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-3"
                    >
                        <ArrowPathIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Refresh
                    </button>
                    <button
                        onClick={() => setModalOpen(true)}
                        type="button"
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                        Stock Operation
                    </button>
                </div>
            </div>

            {/* Key Metrics - Dummy Data for Visuals */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {[
                    { name: 'Total Stock Value', stat: '$124,592', change: '+12%', changeType: 'increase' },
                    { name: 'Low Stock Items', stat: '8', change: '-2', changeType: 'decrease' },
                    { name: 'Pending Transfers', stat: '3', change: '0', changeType: 'neutral' },
                    { name: 'Active Warehouses', stat: '4', change: '+1', changeType: 'increase' },
                ].map((item) => (
                    <div key={item.name} className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6 border border-gray-100">
                        <dt>
                            <div className="absolute rounded-md bg-indigo-500 p-3">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                </svg>
                            </div>
                            <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                        </dt>
                        <dd className="ml-16 flex items-baseline pb-1 sm:pb-7">
                            <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                            <p className={`ml-2 flex items-baseline text-sm font-semibold ${item.changeType === 'increase' ? 'text-green-600' : item.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'}`}>
                                {item.change}
                            </p>
                        </dd>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Product List */}
                <div className="overflow-hidden bg-white shadow sm:rounded-md border border-gray-100">
                    <div className="px-4 py-5 sm:px-6 bg-gray-50/50">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Products</h3>
                    </div>
                    <ul role="list" className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <li key={product.id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">
                                            {product.name}
                                        </p>
                                        <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                            <span className="truncate">SKU: {product.sku}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-x-4">
                                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                        {product.product_type}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Stock Moves History */}
                <div className="overflow-hidden bg-white shadow sm:rounded-md border border-gray-100">
                    <div className="px-4 py-5 sm:px-6 bg-gray-50/50">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Moves</h3>
                    </div>
                    <ul role="list" className="divide-y divide-gray-100">
                        {moves.map((move) => (
                            <li key={move.id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">
                                            {move.product_name}
                                        </p>
                                        <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                            {move.reference}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-gray-900">{Number(move.qty).toFixed(2)}</span>
                                    <div className="text-xs text-gray-500">
                                        {move.from_wh_code || 'Vendor'} &rarr; {move.to_wh_code || 'Cust'}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <StockTransferModal open={modalOpen} setOpen={setModalOpen} onSuccess={fetchData} />
        </div>
    )
}

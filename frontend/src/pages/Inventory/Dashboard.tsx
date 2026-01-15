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
                    <p className="mt-1 text-sm text-gray-500">Corporate Stock Overview</p>
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
                        Operation
                    </button>
                </div>
            </div>

            {/* Corporate Stat Cards */}
            {/* Corporate Stat Cards - Compact */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4 mb-8">
                {[
                    { name: 'Stock Value', stat: '$124,592', change: '+12%', changeType: 'increase' },
                    { name: 'Critical Items', stat: '8', change: '-2', changeType: 'decrease' },
                    { name: 'Pending', stat: '3', change: '0', changeType: 'neutral' },
                    { name: 'Warehouses', stat: '4', change: '+1', changeType: 'increase' },
                ].map((item) => (
                    <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-3 shadow border border-gray-200 flex items-center justify-between">
                        <div>
                            <dt className="truncate text-xs font-medium text-gray-500 uppercase tracking-wide">{item.name}</dt>
                            <dd className="mt-1 text-xl font-bold tracking-tight text-gray-900">{item.stat}</dd>
                        </div>
                        <span className={`text-sm font-semibold ${item.changeType === 'increase' ? 'text-green-600' : item.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'}`}>
                            {item.change}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Product Table */}
                <div className="bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Product Ledger</h3>
                    </div>
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6">Name</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">SKU</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{product.name}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.sku}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                {product.product_type}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="py-4 text-center text-sm text-gray-500">No products found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Moves Table */}
                <div className="bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Movement History</h3>
                    </div>
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6">Item</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Ref</th>
                                    <th scope="col" className="px-3 py-3.5 text-right text-xs font-medium uppercase tracking-wide text-gray-500">Qty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {moves.map((move) => (
                                    <tr key={move.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{move.product_name}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{move.reference}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-mono text-gray-900">{Number(move.qty).toFixed(2)}</td>
                                    </tr>
                                ))}
                                {moves.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="py-4 text-center text-sm text-gray-500">No movements recorded.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <StockTransferModal open={modalOpen} setOpen={setModalOpen} onSuccess={fetchData} />
        </div>
    )
}

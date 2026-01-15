import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { inventoryApi, Product, Warehouse } from '../../api/inventory'

interface StockTransferModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onSuccess: () => void;
}

export default function StockTransferModal({ open, setOpen, onSuccess }: StockTransferModalProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [warehouses, setWarehouses] = useState<Warehouse[]>([])

    // Form State
    const [selectedProduct, setSelectedProduct] = useState('')
    const [qty, setQty] = useState(1)
    const [fromWh, setFromWh] = useState('')
    const [toWh, setToWh] = useState('')
    const [reference, setReference] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            inventoryApi.getProducts().then(r => setProducts(r.data))
            inventoryApi.getWarehouses().then(r => setWarehouses(r.data))
        }
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await inventoryApi.transferStock({
                product_id: selectedProduct,
                qty: Number(qty),
                from_warehouse_id: fromWh || null,
                to_warehouse_id: toWh || null,
                reference: reference
            })
            setOpen(false)
            onSuccess()
            // Reset form
            setReference('')
            setQty(1)
        } catch (error) {
            alert('Transfer failed! Check console.')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <div className="mt-3 text-center sm:mt-5">
                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                Transfer / Move Stock
                                            </Dialog.Title>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                                        <div className="sm:col-span-6">
                                            <label className="block text-sm font-medium leading-6 text-gray-900">Reference</label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    required
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    value={reference}
                                                    onChange={e => setReference(e.target.value)}
                                                    placeholder="e.g. INV-001"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-6">
                                            <label className="block text-sm font-medium leading-6 text-gray-900">Product</label>
                                            <div className="mt-2">
                                                <select
                                                    required
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    value={selectedProduct}
                                                    onChange={e => setSelectedProduct(e.target.value)}
                                                >
                                                    <option value="">Select Product...</option>
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-6">
                                            <label className="block text-sm font-medium leading-6 text-gray-900">Quantity</label>
                                            <div className="mt-2">
                                                <input
                                                    type="number"
                                                    required
                                                    step="0.0001"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    value={qty}
                                                    onChange={e => setQty(Number(e.target.value))}
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label className="block text-sm font-medium leading-6 text-gray-900">From (Source)</label>
                                            <div className="mt-2">
                                                <select
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    value={fromWh}
                                                    onChange={e => setFromWh(e.target.value)}
                                                >
                                                    <option value="">(External / Vendor)</option>
                                                    {warehouses.map(w => (
                                                        <option key={w.id} value={w.id}>{w.code}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label className="block text-sm font-medium leading-6 text-gray-900">To (Destination)</label>
                                            <div className="mt-2">
                                                <select
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    value={toWh}
                                                    onChange={e => setToWh(e.target.value)}
                                                >
                                                    <option value="">(External / Customer)</option>
                                                    {warehouses.map(w => (
                                                        <option key={w.id} value={w.id}>{w.code}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 disabled:bg-gray-400"
                                        >
                                            {loading ? 'Processing...' : 'Confirm Transfer'}
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                            onClick={() => setOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

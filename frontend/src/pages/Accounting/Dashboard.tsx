import { useState } from 'react'
import { ArrowPathIcon, DocumentPlusIcon } from '@heroicons/react/20/solid'

export default function AccountingDashboard() {
    const [invoices] = useState([
        { id: 'INV-001', client: 'Acme Corp', amount: '$1,200.00', status: 'Paid', date: '2026-01-10' },
        { id: 'INV-002', client: 'Globex Inc', amount: '$4,500.00', status: 'Pending', date: '2026-01-12' },
        { id: 'INV-003', client: 'Soylent Corp', amount: '$850.00', status: 'Overdue', date: '2026-01-05' },
    ])

    return (
        <div>
            <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-2xl font-bold leading-6 text-gray-900">Accounting Overview</h3>
                    <p className="mt-1 text-sm text-gray-500">Financial Health & Cash Flow</p>
                </div>
                <div className="mt-3 flex sm:ml-4 sm:mt-0">
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-3"
                    >
                        <ArrowPathIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Refresh
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <DocumentPlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                        New Invoice
                    </button>
                </div>
            </div>

            {/* Compact Stat Row */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
                {[
                    { name: 'Revenue (MTD)', value: '$12,450', change: '+8%', color: 'text-green-600' },
                    { name: 'Outstanding', value: '$3,200', change: '-2%', color: 'text-red-600' },
                    { name: 'Expenses', value: '$4,100', change: '+1%', color: 'text-gray-600' },
                    { name: 'Net Profit', value: '$8,350', change: '+12%', color: 'text-indigo-600' },
                ].map((stat) => (
                    <div key={stat.name} className="overflow-hidden rounded-lg bg-white px-4 py-3 shadow border border-gray-200 flex items-center justify-between">
                        <div>
                            <p className="truncate text-xs font-medium text-gray-500 uppercase">{stat.name}</p>
                            <p className="mt-1 text-xl font-bold tracking-tight text-gray-900">{stat.value}</p>
                        </div>
                        <span className={`text-sm font-semibold ${stat.color}`}>{stat.change}</span>
                    </div>
                ))}
            </div>

            {/* Invoices Table */}
            <div className="mt-8 bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg overflow-hidden">
                <div className="border-b border-gray-200 px-4 py-4 sm:px-6 bg-gray-50">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Invoices</h3>
                </div>
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-white">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6">Invoice #</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Client</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Date</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Status</th>
                            <th scope="col" className="px-3 py-3.5 text-right text-xs font-medium uppercase tracking-wide text-gray-500">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-indigo-600 sm:pl-6 font-mono">{invoice.id}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">{invoice.client}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{invoice.date}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${invoice.status === 'Paid' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                            invoice.status === 'Pending' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                                                'bg-red-50 text-red-700 ring-red-600/20'
                                        }`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900 font-mono">{invoice.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

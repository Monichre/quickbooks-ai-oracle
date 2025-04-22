import {findPurchases} from '@/services/intuit/purchase/purchase.api'
import Link from 'next/link'

export default async function PurchaseOrdersPage() {
  const purchasesResponse = await findPurchases({maxResults: 100})
  const purchases = purchasesResponse.QueryResponse?.Purchase || []

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Purchase Orders</h1>
        <Link
          href='/dashboard/purchase-orders/create'
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          Create Purchase Order
        </Link>
      </div>

      <div className='bg-white shadow overflow-hidden rounded-lg'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Doc #
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Vendor
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Date
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Total
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Payment Type
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {purchases.length === 0 ? (
              <tr>
                <td colSpan={6} className='px-6 py-4 text-center text-gray-500'>
                  No purchase orders found
                </td>
              </tr>
            ) : (
              purchases.map((purchase) => (
                <tr key={purchase.Id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {purchase.DocNumber || 'N/A'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {purchase.EntityRef?.name || 'N/A'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {purchase.TxnDate
                      ? new Date(purchase.TxnDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    ${purchase.TotalAmt?.toFixed(2) || '0.00'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {purchase.PaymentType || 'N/A'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <Link
                      href={`/dashboard/purchase-orders/${purchase.Id}`}
                      className='text-blue-600 hover:text-blue-900 mr-4'
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/purchase-orders/${purchase.Id}/edit`}
                      className='text-indigo-600 hover:text-indigo-900'
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

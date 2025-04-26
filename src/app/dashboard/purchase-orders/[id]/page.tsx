import {getPurchase} from '@/services/intuit/purchase/purchase.api'
import Link from 'next/link'
import {notFound} from 'next/navigation'

export default async function PurchaseOrderDetailPage({
  params,
}: {
  params: {id: string}
}) {
  try {
    const purchaseResponse = await getPurchase(params.id)
    const purchase = purchaseResponse.Purchase

    return (
      <div className='py-4 px-12 purchase-order-detail h-screen w-full'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>
            Purchase Order #{purchase.DocNumber || purchase.Id}
          </h1>
          <div className='flex space-x-4'>
            <Link
              href={`/dashboard/purchase-orders/${purchase.Id}/edit`}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Edit Purchase Order
            </Link>
          </div>
        </div>

        <div className='bg-white shadow rounded-lg p-6 mb-6'>
          <div className='grid grid-cols-2 gap-6'>
            <div>
              <h2 className='text-xl font-semibold mb-2'>Vendor Information</h2>
              <p>
                <span className='font-medium'>Name:</span>{' '}
                {purchase.EntityRef?.name}
              </p>
            </div>
            <div>
              <h2 className='text-xl font-semibold mb-2'>
                Purchase Order Details
              </h2>
              <p>
                <span className='font-medium'>Date:</span>{' '}
                {purchase.TxnDate
                  ? new Date(purchase.TxnDate).toLocaleDateString()
                  : 'N/A'}
              </p>
              <p>
                <span className='font-medium'>Total:</span> $
                {purchase.TotalAmt?.toFixed(2) || '0.00'}
              </p>
              <p>
                <span className='font-medium'>Payment Type:</span>{' '}
                {purchase.PaymentType || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white shadow rounded-lg overflow-hidden'>
          <h2 className='text-xl font-semibold p-6 border-b'>Line Items</h2>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Item
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Description
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Qty
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Unit Price
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {purchase.Line?.map(
                (line, index) =>
                  line.DetailType === 'ItemBasedExpenseLineDetail' && (
                    <tr key={index}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {line.ItemBasedExpenseLineDetail?.ItemRef?.name ||
                          'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {line.Description || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {line.ItemBasedExpenseLineDetail?.Qty || 0}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        $
                        {line.ItemBasedExpenseLineDetail?.UnitPrice?.toFixed(
                          2
                        ) || '0.00'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        ${line.Amount?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  )
              )}
            </tbody>
            <tfoot className='bg-gray-50'>
              <tr>
                <td colSpan={4} className='px-6 py-3 text-right font-medium'>
                  Total:
                </td>
                <td className='px-6 py-3 font-medium'>
                  ${purchase.TotalAmt?.toFixed(2) || '0.00'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {purchase.PrivateNote && (
          <div className='bg-white shadow rounded-lg p-6 mt-6'>
            <h2 className='text-xl font-semibold mb-2'>Notes</h2>
            <p>{purchase.PrivateNote}</p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error fetching purchase order:', error)
    return notFound()
  }
}

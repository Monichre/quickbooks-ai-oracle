import {getEstimate} from '@/services/intuit/estimate/estimate.api'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {CreatePOForm} from '@/components/estimates/CreatePOForm'

export default async function EstimateDetailPage({
  params,
}: {
  params: {id: string}
}) {
  try {
    const estimateResponse = await getEstimate(params.id)
    const estimate = estimateResponse.Estimate

    return (
      <div>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>
            Estimate #{estimate.DocNumber || estimate.Id}
          </h1>
          <div className='flex space-x-4'>
            <Link
              href={`/dashboard/estimates/${estimate.Id}/edit`}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Edit Estimate
            </Link>
            <CreatePOForm estimateId={estimate.Id} />
          </div>
        </div>

        <div className='bg-white shadow rounded-lg p-6 mb-6'>
          <div className='grid grid-cols-2 gap-6'>
            <div>
              <h2 className='text-xl font-semibold mb-2'>
                Customer Information
              </h2>
              <p>
                <span className='font-medium'>Name:</span>{' '}
                {estimate.CustomerRef?.name}
              </p>
            </div>
            <div>
              <h2 className='text-xl font-semibold mb-2'>Estimate Details</h2>
              <p>
                <span className='font-medium'>Date:</span>{' '}
                {estimate.TxnDate
                  ? new Date(estimate.TxnDate).toLocaleDateString()
                  : 'N/A'}
              </p>
              <p>
                <span className='font-medium'>Total:</span> $
                {estimate.TotalAmt?.toFixed(2) || '0.00'}
              </p>
              <p>
                <span className='font-medium'>Status:</span>{' '}
                {estimate.TxnStatus || 'Pending'}
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
              {estimate.Line?.map(
                (line, index) =>
                  line.DetailType === 'SalesItemLineDetail' && (
                    <tr key={index}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {line.SalesItemLineDetail?.ItemRef?.name || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {line.Description || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {line.SalesItemLineDetail?.Qty || 0}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        $
                        {line.SalesItemLineDetail?.UnitPrice?.toFixed(2) ||
                          '0.00'}
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
                  ${estimate.TotalAmt?.toFixed(2) || '0.00'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {estimate.PrivateNote && (
          <div className='bg-white shadow rounded-lg p-6 mt-6'>
            <h2 className='text-xl font-semibold mb-2'>Notes</h2>
            <p>{estimate.PrivateNote}</p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error fetching estimate:', error)
    return notFound()
  }
}

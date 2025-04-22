import {findEstimates} from '@/services/intuit/estimate/estimate.api'
import Link from 'next/link'

export default async function EstimatesPage() {
  const estimatesResponse = await findEstimates({maxResults: 100})
  const estimates = estimatesResponse.QueryResponse?.Estimate || []

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Estimates</h1>
        <Link
          href='/dashboard/estimates/create'
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          Create Estimate
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
                Customer
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Date
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Total
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {estimates.length === 0 ? (
              <tr>
                <td colSpan={6} className='px-6 py-4 text-center text-gray-500'>
                  No estimates found
                </td>
              </tr>
            ) : (
              estimates.map((estimate) => (
                <tr key={estimate.Id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {estimate.DocNumber || 'N/A'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {estimate.CustomerRef?.name || 'N/A'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {estimate.TxnDate
                      ? new Date(estimate.TxnDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    ${estimate.TotalAmt?.toFixed(2) || '0.00'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {estimate.TxnStatus || 'Pending'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <Link
                      href={`/dashboard/estimates/${estimate.Id}`}
                      className='text-blue-600 hover:text-blue-900 mr-4'
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/estimates/${estimate.Id}/edit`}
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

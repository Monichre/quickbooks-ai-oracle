import {findEstimates} from '@/services/intuit/estimate/estimate.api'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const EntityTable = dynamic(() => import('../[entity]/entity-table'), {
  // ssr: false,
})

export default async function EstimatesPage() {
  const estimatesResponse = await findEstimates({maxResults: 100})

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
      <EntityTable entity='estimates' initialData={estimatesResponse} />
    </div>
  )
}

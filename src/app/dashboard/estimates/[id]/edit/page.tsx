import {EstimateForm} from '@/components/estimates/EstimateForm'
import {findCustomers} from '@/services/intuit/customer/customer.api'
import {getEstimate} from '@/services/intuit/estimate/estimate.api'
import {notFound} from 'next/navigation'

export default async function EditEstimatePage({
  params,
}: {
  params: {id: string}
}) {
  try {
    const [customersResponse, estimateResponse] = await Promise.all([
      findCustomers({maxResults: 100}),
      getEstimate(params.id),
    ])

    const customers = customersResponse.QueryResponse?.Customer || []
    const estimate = estimateResponse.Estimate

    return (
      <div>
        <h1 className='text-3xl font-bold mb-6'>
          Edit Estimate #{estimate.DocNumber || estimate.Id}
        </h1>
        <EstimateForm customers={customers} initialData={estimate} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching data:', error)
    return notFound()
  }
}

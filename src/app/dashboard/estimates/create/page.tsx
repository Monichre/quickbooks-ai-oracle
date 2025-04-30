import {EstimateForm} from '@/components/estimates/EstimateForm'
import {findCustomers} from '@/services/intuit/customer/customer.api'

export default async function CreateEstimatePage() {
  const customersResponse = await findCustomers({maxResults: 100})

  const customers = customersResponse.QueryResponse?.Customer || []

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Create Estimate</h1>
      <EstimateForm customers={customers} />
    </div>
  )
}

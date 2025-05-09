import {getEstimate} from '@/services/intuit/estimate/estimate.api'
import {notFound} from 'next/navigation'
import EstimateDetailView from '@/components/estimates/EstimateDetailView'

export default async function EstimateDetailPage({
  params,
}: {
  params: {id: string}
}) {
  try {
    const estimateResponse = await getEstimate(params.id)

    // Ensure we're passing the Estimate object, not the response wrapper
    const estimate = estimateResponse.Estimate

    if (!estimate) {
      return notFound()
    }

    return (
      <div className='container mx-auto pb-10'>
        <EstimateDetailView estimate={estimate} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching estimate:', error)
    return notFound()
  }
}

import {Suspense} from 'react'
import {getEstimate} from '@/services/intuit/estimate'
import {mapEstimateToPurchaseOrder} from '@/services/intuit/purchase-order/map-estimate-to-purchase-order'
import {PurchaseOrderForm} from '@/components/purchase-orders/PurchaseOrderForm'
import {PurchaseOrderFormSkeleton} from '@/components/purchase-orders/PurchaseOrderFormSkeleton'

interface CreatePurchaseOrderPageProps {
  searchParams?: {
    fromEstimate?: string
  }
}

/**
 * Create Purchase Order page
 *
 * This page can either start with a blank PO form or pre-populate
 * from an existing estimate when the `fromEstimate` query parameter is provided.
 */
export default async function CreatePurchaseOrderPage({
  searchParams,
}: CreatePurchaseOrderPageProps) {
  // Extract the estimate ID from the query parameter, if present
  const estimateId = searchParams?.fromEstimate

  // Initial data for the form - will be populated if fromEstimate is provided
  let initialData = null

  // If we have an estimate ID, fetch the estimate and map it to a PO
  if (estimateId) {
    try {
      const estimate = await getEstimate(estimateId)

      if (estimate) {
        // Use the utility to map the estimate to one or more purchase orders
        const purchaseOrders = mapEstimateToPurchaseOrder(estimate)

        // Use the first PO as initial form data (UI will need to handle multiple POs if needed)
        initialData = purchaseOrders[0] || null
      }
    } catch (error) {
      console.error('Error mapping estimate to purchase order:', error)
      // Fall back to empty form if there's an error
    }
  }

  return (
    <div className='container py-8'>
      <h1 className='text-2xl font-bold mb-6'>
        {estimateId
          ? 'Create Purchase Order from Estimate'
          : 'Create Purchase Order'}
      </h1>

      <Suspense fallback={<PurchaseOrderFormSkeleton />}>
        <PurchaseOrderForm initialData={initialData} />
      </Suspense>

      {estimateId && (
        <div className='mt-4 text-sm text-muted-foreground'>
          <p>This purchase order was created from Estimate #{estimateId}.</p>
        </div>
      )}
    </div>
  )
}

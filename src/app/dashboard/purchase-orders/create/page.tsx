import {Suspense} from 'react'
import {getEstimate} from '@/services/intuit/estimate'
import {mapEstimateToPurchaseOrder} from '@/services/intuit/purchase-order/map-estimate-to-purchase-order'
import {PurchaseOrderForm} from '@/components/purchase-orders/PurchaseOrderForm'
import {PurchaseOrderFormSkeleton} from '@/components/purchase-orders/PurchaseOrderFormSkeleton'
import {findVendors} from '@/services/intuit/vendor/vendor.api'
import {Vendor} from '@/services/intuit/types'

interface CreatePurchaseOrderPageProps {
  params: Promise<Record<string, never>>
  searchParams: Promise<{
    fromEstimate?: string
    estimate?: string
    vendor?: string
  }>
}

/**
 * Create Purchase Order page
 *
 * This page can either:
 * 1. Start with a blank PO form
 * 2. Pre-populate from an existing estimate when the `fromEstimate` query parameter is provided
 * 3. Pre-populate from an estimate for a specific vendor via `estimate` and `vendor` parameters
 */
export default async function CreatePurchaseOrderPage({
  params,
  searchParams,
}: CreatePurchaseOrderPageProps) {
  // Await params in Next.js 15
  await params
  const resolvedSearchParams = await searchParams

  // Extract the estimate ID from the query parameters
  const estimateId =
    resolvedSearchParams?.fromEstimate || resolvedSearchParams?.estimate
  const vendorId = resolvedSearchParams?.vendor

  // Fetch all vendors for the dropdown
  const vendorsResponse = await findVendors({limit: 100})
  const vendors = vendorsResponse.QueryResponse.Vendor || []

  // Initial data for the form - will be populated if an estimate ID is provided
  let initialData = null
  let sourceEstimateId = null

  // If we have an estimate ID, fetch the estimate and map it to a PO
  if (estimateId) {
    sourceEstimateId = estimateId
    try {
      const estimate = await getEstimate(estimateId)

      if (estimate) {
        // Use the utility to map the estimate to one or more purchase orders
        // Skip items without vendor references instead of throwing errors
        const purchaseOrders = mapEstimateToPurchaseOrder(estimate, {
          strictVendorValidation: false,
        })

        if (purchaseOrders.length === 0) {
          console.warn(
            'No purchase orders could be created from this estimate. All items may be missing vendor references.'
          )
        } else if (vendorId) {
          // If a vendor ID is specified, find the PO for that vendor
          const vendorPO = purchaseOrders.find(
            (po) => po.VendorRef?.value === vendorId
          )
          initialData = vendorPO || purchaseOrders[0] || null
        } else {
          // Otherwise use the first PO
          initialData = purchaseOrders[0] || null
        }
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
        <PurchaseOrderForm initialData={initialData} vendors={vendors} />
      </Suspense>

      {sourceEstimateId && (
        <div className='mt-4 text-sm text-muted-foreground'>
          <p>
            This purchase order was created from Estimate #{sourceEstimateId}.
          </p>
        </div>
      )}
    </div>
  )
}

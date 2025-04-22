import {PurchaseOrderForm} from '@/components/purchase-orders/PurchaseOrderForm'
import {findVendors} from '@/services/intuit/vendor/vendor.api'

export default async function CreatePurchaseOrderPage() {
  const vendorsResponse = await findVendors({maxResults: 100})
  const vendors = vendorsResponse.QueryResponse?.Vendor || []

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Create Purchase Order</h1>
      <PurchaseOrderForm vendors={vendors} />
    </div>
  )
}

import {PurchaseOrderForm} from '@/components/purchase-orders/PurchaseOrderForm'
import {findVendors} from '@/services/intuit/vendor/vendor.api'
import {getPurchase} from '@/services/intuit/purchase/purchase.api'
import {notFound} from 'next/navigation'

export default async function EditPurchaseOrderPage({
  params,
}: {
  params: {id: string}
}) {
  try {
    const [vendorsResponse, purchaseResponse] = await Promise.all([
      findVendors({maxResults: 100}),
      getPurchase(params.id),
    ])

    const vendors = vendorsResponse.QueryResponse?.Vendor || []
    const purchase = purchaseResponse.Purchase

    return (
      <div>
        <h1 className='text-3xl font-bold mb-6'>
          Edit Purchase Order #{purchase.DocNumber || purchase.Id}
        </h1>
        <PurchaseOrderForm vendors={vendors} initialData={purchase} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching data:', error)
    return notFound()
  }
}

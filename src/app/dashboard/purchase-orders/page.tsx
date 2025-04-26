import {findPurchases} from '@/services/intuit/purchase/purchase.api'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const EntityTable = dynamic(() => import('../[entity]/entity-table'), {
  // ssr: false,
})

export default async function PurchaseOrdersPage() {
  const purchasesResponse = await findPurchases({maxResults: 100})

  return (
    <div className='flex flex-col gap-4 py-4 px-12'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Purchase Orders</h1>
        <Link
          href='/dashboard/purchase-orders/create'
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          Create Purchase Order
        </Link>
      </div>
      <EntityTable entity='purchase-orders' initialData={purchasesResponse} />
    </div>
  )
}

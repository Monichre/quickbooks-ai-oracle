'use client'

import {useCallback} from 'react'
import {useRouter} from 'next/navigation'
import type {Estimate} from '@/services/intuit/estimate/estimate.types'
import dynamic from 'next/dynamic'
import type {PurchaseOrder} from '@/services/intuit/purchase-order/purchase-order.types'

const EntityTable = dynamic(() => import('../[entity]/entity-table'), {
  // ssr: false,
})

interface EstimateTableClientProps {
  estimates: Estimate[]
  columnConfig: {
    selectedColumns: string[]
    columnLabels: Record<string, string>
  }
}

// Type to allow estimates to match what EntityTable expects
type EntityObject = PurchaseOrder | Estimate | any

export default function EstimateTableClient({
  estimates,
  columnConfig,
}: EstimateTableClientProps) {
  const router = useRouter()

  // Handlers for dropdown actions
  const handleCreatePurchaseOrder = useCallback(
    (estimate: Estimate) => {
      // Will be implemented in ticket #06
      console.log('Creating purchase order from estimate:', estimate.Id)
      // Navigate to the create purchase order page with estimate ID
      router.push(
        `/dashboard/purchase-orders/create?fromEstimateId=${estimate.Id}`
      )
    },
    [router]
  )

  const handleCreateInvoice = useCallback(
    (estimate: Estimate) => {
      // Will be implemented in ticket #07
      console.log('Creating invoice from estimate:', estimate.Id)
      // Navigate to the create invoice page with estimate ID
      router.push(`/dashboard/invoices/create?fromEstimateId=${estimate.Id}`)
    },
    [router]
  )

  // Cast estimates to the required type for EntityTable
  const entityData = estimates as unknown as EntityObject[]

  return (
    <EntityTable
      entity='estimates'
      initialData={entityData}
      columnConfig={columnConfig}
      onCreatePurchaseOrder={handleCreatePurchaseOrder}
      onCreateInvoice={handleCreateInvoice}
    />
  )
}

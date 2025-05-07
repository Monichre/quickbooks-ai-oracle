'use client'

import {useCallback} from 'react'
import {findEstimates} from '@/services/intuit/estimate/estimate.api'
import type {Estimate} from '@/services/intuit/estimate/estimate.types'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/navigation'

const EntityTable = dynamic(() => import('../[entity]/entity-table'), {
  // ssr: false,
})

export default function EstimatesPage() {
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

  // Define columns to display for estimates
  const columnConfig = {
    selectedColumns: [
      'TxnDate', // Date
      'DocNumber', // Number
      'Id', // ID
      'CustomerRef.name', // Customer name
      'TotalAmt', // Amount
      'TxnStatus', // Status
    ],
    columnLabels: {
      TxnDate: 'Date',
      DocNumber: 'Number',
      Id: 'ID',
      'CustomerRef.name': 'Customer',
      TotalAmt: 'Amount',
      TxnStatus: 'Status',
    },
  }

  // This async function fetches the data
  const getEstimatesData = async () => {
    return await findEstimates({maxResults: 100})
  }

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
      {/* @ts-expect-error Async Server Component */}
      <EntityTable
        entity='estimates'
        initialData={getEstimatesData()}
        columnConfig={columnConfig}
        onCreatePurchaseOrder={handleCreatePurchaseOrder}
        onCreateInvoice={handleCreateInvoice}
      />
    </div>
  )
}

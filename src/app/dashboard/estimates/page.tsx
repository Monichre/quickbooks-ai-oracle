import {findEstimates} from '@/services/intuit/estimate/estimate.api'
import type {Estimate} from '@/services/intuit/estimate/estimate.types'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import EstimateTableClient from './estimate-table-client'

const EntityTable = dynamic(() => import('../[entity]/entity-table'), {
  // ssr: false,
})

export default async function EstimatesPage() {
  const estimates = await findEstimates({maxResults: 100})

  // Extract the Estimate array from the response to fix type mismatch
  const estimateArray = estimates.QueryResponse.Estimate || []

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

      <EstimateTableClient
        estimates={estimateArray}
        columnConfig={columnConfig}
      />
    </div>
  )
}

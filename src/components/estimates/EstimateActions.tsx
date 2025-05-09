'use client'

import React from 'react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {Edit} from 'lucide-react'
import {PrintButton} from './PrintButton'
import {CopyToPurchaseOrderAction} from './CopyToPurchaseOrderAction'

interface EstimateActionsProps {
  estimateId: string
}

/**
 * Component that renders all the action buttons for an estimate detail page
 * Includes: Edit, Print, and additional actions in a dropdown menu
 */
export function EstimateActions({estimateId}: EstimateActionsProps) {
  return (
    <div className='flex items-center gap-2'>
      <PrintButton estimateId={estimateId} />

      <Button variant='outline' asChild>
        <Link href={`/dashboard/estimates/${estimateId}/edit`}>
          <Edit className='h-4 w-4 mr-2' />
          Edit Estimate
        </Link>
      </Button>

      <CopyToPurchaseOrderAction estimateId={estimateId} />
    </div>
  )
}

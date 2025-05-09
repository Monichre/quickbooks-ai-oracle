'use client'

import {Button} from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ClipboardCopy,
  FileText,
  Mail,
  MoreHorizontal,
  Printer,
} from 'lucide-react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'

interface EstimateActionsProps {
  estimateId: string
  isCompact?: boolean
}

/**
 * Actions toolbar for an estimate
 *
 * Provides buttons for:
 * - Creating a purchase order
 * - Printing the estimate
 * - Additional actions via dropdown
 */
export function EstimateActions({
  estimateId,
  isCompact = false,
}: EstimateActionsProps) {
  const router = useRouter()

  const handleCreatePO = () => {
    // Navigate to the vendor selection page if there might be multiple vendors
    router.push(
      `/dashboard/purchase-orders/create/vendor-select?estimate=${estimateId}`
    )
  }

  return (
    <div className='flex items-center gap-2'>
      <Button
        size={isCompact ? 'sm' : 'default'}
        variant='outline'
        onClick={handleCreatePO}
      >
        <ClipboardCopy className='mr-2 h-4 w-4' />
        <span>Create Purchase Order</span>
      </Button>

      <Link href={`/dashboard/estimates/${estimateId}/print`} prefetch={false}>
        <Button size={isCompact ? 'sm' : 'default'} variant='outline'>
          <Printer className='mr-2 h-4 w-4' />
          <span>Print</span>
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={isCompact ? 'sm' : 'default'} variant='outline'>
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/estimates/${estimateId}/edit`}>
              <FileText className='mr-2 h-4 w-4' />
              <span>Edit estimate</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => alert('Email functionality coming soon')}
          >
            <Mail className='mr-2 h-4 w-4' />
            <span>Email to customer</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/invoices/create?estimate=${estimateId}`}>
              <FileText className='mr-2 h-4 w-4' />
              <span>Create invoice</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

'use client'

import {useRouter} from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {Button} from '@/components/ui/button'
import {MoreVertical, ClipboardCopy} from 'lucide-react'

interface CopyToPurchaseOrderActionProps {
  estimateId: string
  className?: string
}

/**
 * Dropdown menu component for the Copy to Purchase Order action.
 *
 * This component renders a kebab menu (three vertical dots) that, when clicked,
 * opens a dropdown with an option to copy the estimate to a purchase order.
 */
export function CopyToPurchaseOrderAction({
  estimateId,
  className,
}: CopyToPurchaseOrderActionProps) {
  const router = useRouter()

  const handleCopyToPurchaseOrder = () => {
    // Navigate to the create PO page with the estimate ID as a query parameter
    router.push(`/dashboard/purchase-orders/create?fromEstimate=${estimateId}`)

    // Optional: Fire analytics event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'estimate.copy_to_po_clicked', {
        estimateId,
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className={className}>
          <MoreVertical className='h-4 w-4' />
          <span className='sr-only'>More actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={handleCopyToPurchaseOrder}>
          <ClipboardCopy className='mr-2 h-4 w-4' />
          <span>Copy to purchase order</span>
        </DropdownMenuItem>
        {/* Additional actions can be added here in the future */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

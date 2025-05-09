'use client'

import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {ClipboardCopy} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {getEstimate} from '@/services/intuit/estimate'
import {mapEstimateToPurchaseOrder} from '@/services/intuit/purchase-order/map-estimate-to-purchase-order'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Vendor} from '@/services/intuit/types'

interface EstimateToPurchaseOrderActionProps {
  estimateId: string
  vendors: Vendor[]
  onSuccess?: () => void
  className?: string
}

/**
 * Button component for creating a purchase order from an estimate.
 *
 * When there are multiple vendors on an estimate, shows a dialog to select
 * which vendor to create a purchase order for.
 */
export function EstimateToPurchaseOrderAction({
  estimateId,
  vendors,
  onSuccess,
  className,
}: EstimateToPurchaseOrderActionProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showVendorDialog, setShowVendorDialog] = useState(false)
  const [estimateVendors, setEstimateVendors] = useState<
    {id: string; name: string}[]
  >([])
  const [selectedVendorId, setSelectedVendorId] = useState<string>('')

  const handleClick = async () => {
    setIsLoading(true)
    try {
      // Get the estimate and determine if it has multiple vendors
      const estimate = await getEstimate(estimateId)
      const purchaseOrders = mapEstimateToPurchaseOrder(estimate)

      if (purchaseOrders.length === 1) {
        // If only one vendor, go directly to create page
        router.push(`/dashboard/purchase-orders/create?estimate=${estimateId}`)
        if (onSuccess) onSuccess()
      } else {
        // If multiple vendors, show dialog to select which one
        const vendorOptions = purchaseOrders.map((po) => ({
          id: po.VendorRef?.value || '',
          name: po.VendorRef?.name || 'Unknown Vendor',
        }))
        setEstimateVendors(vendorOptions)
        setShowVendorDialog(true)
      }
    } catch (error) {
      console.error('Error preparing purchase order:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateForVendor = () => {
    if (!selectedVendorId) return

    router.push(
      `/dashboard/purchase-orders/create?estimate=${estimateId}&vendor=${selectedVendorId}`
    )
    setShowVendorDialog(false)
    if (onSuccess) onSuccess()
  }

  return (
    <>
      <Button
        variant='outline'
        size='sm'
        className={className}
        onClick={handleClick}
        disabled={isLoading}
      >
        <ClipboardCopy className='mr-2 h-4 w-4' />
        {isLoading ? 'Loading...' : 'Create Purchase Order'}
      </Button>

      <Dialog open={showVendorDialog} onOpenChange={setShowVendorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Vendor</DialogTitle>
            <DialogDescription>
              This estimate contains items from multiple vendors. Select which
              vendor to create a purchase order for.
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <Select
              value={selectedVendorId}
              onValueChange={setSelectedVendorId}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a vendor' />
              </SelectTrigger>
              <SelectContent>
                {estimateVendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowVendorDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateForVendor}
              disabled={!selectedVendorId}
            >
              Create Purchase Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

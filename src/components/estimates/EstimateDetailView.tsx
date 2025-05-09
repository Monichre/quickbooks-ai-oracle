'use client'

import React, {useState, useMemo} from 'react'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Separator} from '@/components/ui/separator'
import {Button} from '@/components/ui/button'
import {
  PencilIcon,
  FileText,
  Share2,
  ClipboardCopy,
  Loader2,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type {Estimate} from '@/services/intuit/estimate/estimate.types'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Label} from '@/components/ui/label'
import {toast} from 'sonner'
import {useRouter} from 'next/navigation'
import {
  mapEstimateToPurchaseOrder,
  checkEstimateVendorReferences,
} from '@/services/intuit/purchase-order/map-estimate-to-purchase-order'
import {createPurchaseOrder} from '@/services/intuit/purchase-order/purchase-order.api'
import type {PurchaseOrder} from '@/services/intuit/types'
import {cn} from '@/lib/utils'

// Define LineItem type locally since it's not exported from estimate.types.ts
interface LineItem {
  Id?: string
  DetailType: 'SalesItemLineDetail'
  Description?: string
  Amount: number
  SalesItemLineDetail?: {
    ItemRef?: {
      name?: string
      value: string
    }
    Qty?: number
    UnitPrice?: number
    VendorRef?: {
      name?: string
      value: string
    }
  }
}

interface VendorOption {
  id: string
  name: string
  purchaseOrder: PurchaseOrder
}

interface EstimateDetailViewProps {
  estimate: Estimate
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default function EstimateDetailView({
  estimate,
}: EstimateDetailViewProps) {
  const router = useRouter()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedVendorId, setSelectedVendorId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [missingVendorItems, setMissingVendorItems] = useState<LineItem[]>([])
  const [vendorReferenceStats, setVendorReferenceStats] = useState({
    hasVendorReferences: false,
    totalItems: 0,
    itemsWithVendors: 0,
    itemsMissingVendors: 0,
  })

  // Extract vendor information from estimate line items
  const vendorOptions = useMemo(() => {
    if (!estimate.Line || estimate.Line.length === 0) {
      return []
    }

    try {
      // Check vendor references in the estimate
      const stats = checkEstimateVendorReferences(estimate)
      setVendorReferenceStats(stats)

      // Get items missing vendor references
      const missingItems = estimate.Line.filter(
        (line) =>
          line.DetailType === 'SalesItemLineDetail' &&
          line.SalesItemLineDetail &&
          (!line.SalesItemLineDetail.VendorRef ||
            !line.SalesItemLineDetail.VendorRef.value)
      ).map((line) => line as LineItem)

      setMissingVendorItems(missingItems)

      // Use mapEstimateToPurchaseOrder to get the vendor-grouped POs
      // This will skip items without vendor references
      const posByVendor = mapEstimateToPurchaseOrder(estimate)

      // Convert to our VendorOption format
      return posByVendor.map((po) => ({
        id: po.VendorRef?.value || '',
        name: po.VendorRef?.name || 'Unknown Vendor',
        purchaseOrder: po,
      }))
    } catch (error) {
      console.error('Error extracting vendor options:', error)
      return []
    }
  }, [estimate])

  // Auto-select the vendor if there's only one
  React.useEffect(() => {
    if (vendorOptions.length === 1) {
      setSelectedVendorId(vendorOptions[0].id)
    }
  }, [vendorOptions])

  const handleCreatePurchaseOrder = async () => {
    if (!selectedVendorId) {
      toast({
        title: 'Error',
        description: 'Please select a vendor',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Find the purchase order for the selected vendor
      const selectedVendorPO = vendorOptions.find(
        (v) => v.id === selectedVendorId
      )?.purchaseOrder

      if (!selectedVendorPO) {
        throw new Error('Selected vendor purchase order not found')
      }

      // Create the purchase order
      const response = await createPurchaseOrder(selectedVendorPO)

      // Close the modal
      setCreateModalOpen(false)

      // Show success message
      toast({
        title: 'Purchase Order Created',
        description: `Successfully created purchase order for ${selectedVendorPO.VendorRef?.name}`,
      })

      // Navigate to the new purchase order if available
      if (response?.PurchaseOrder?.Id) {
        router.push(`/dashboard/purchase-orders/${response.PurchaseOrder.Id}`)
      }
    } catch (error) {
      console.error('Error creating purchase order:', error)
      toast({
        title: 'Error',
        description: 'Failed to create purchase order. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const statusMap = {
    Pending: 'amber',
    Accepted: 'green',
    Rejected: 'red',
    Closed: 'slate',
  } as const

  // Use the actual estimate data status or default to 'Pending'
  const status = estimate.TxnStatus || 'Pending'

  return (
    <div className='container mx-auto p-4 space-y-6 max-w-5xl'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Estimate #{estimate.Id}
          </h1>
          <p className='text-gray-500 dark:text-gray-400'>
            Customer: {estimate.CustomerRef?.name}
          </p>
        </div>

        <div className='flex items-center space-x-2'>
          <Link href={`/dashboard/estimates/${estimate.Id}/print`}>
            <Button variant='outline' size='sm' className='gap-1'>
              <FileText size={16} /> Print
            </Button>
          </Link>
          <Button variant='outline' size='sm' className='gap-1'>
            <Share2 size={16} /> Share
          </Button>
          <Link href={`/dashboard/estimates/${estimate.Id}/edit`}>
            <Button variant='outline' size='sm' className='gap-1'>
              <PencilIcon size={16} /> Edit Estimate
            </Button>
          </Link>
          <Button
            variant='default'
            size='sm'
            className='bg-green-600 hover:bg-green-700'
            onClick={() => setCreateModalOpen(true)}
            disabled={!vendorReferenceStats.hasVendorReferences}
            title={
              !vendorReferenceStats.hasVendorReferences
                ? 'No vendor references found in this estimate'
                : 'Create a purchase order from this estimate'
            }
          >
            <ClipboardCopy className='mr-2 h-4 w-4' />
            Create Purchase Order
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Customer Information */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg'>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className='grid gap-2'>
              <div className='flex justify-between'>
                <dt className='font-medium text-gray-500 dark:text-gray-400'>
                  Name:
                </dt>
                <dd>{estimate.CustomerRef?.name}</dd>
              </div>
              {/* Add more customer info here (address, contact, etc.) as needed */}
            </dl>
          </CardContent>
        </Card>

        {/* Estimate Details */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg'>Estimate Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className='grid gap-2'>
              <div className='flex justify-between'>
                <dt className='font-medium text-gray-500 dark:text-gray-400'>
                  Date:
                </dt>
                <dd>{new Date(estimate.TxnDate).toLocaleDateString()}</dd>
              </div>
              <div className='flex justify-between'>
                <dt className='font-medium text-gray-500 dark:text-gray-400'>
                  Total:
                </dt>
                <dd className='font-medium'>
                  {formatCurrency(estimate.TotalAmt)}
                </dd>
              </div>
              <div className='flex justify-between'>
                <dt className='font-medium text-gray-500 dark:text-gray-400'>
                  Status:
                </dt>
                <dd>
                  <Badge
                    variant='outline'
                    className='bg-amber-100 text-amber-800 border-amber-200'
                  >
                    {status}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Line Items */}
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg'>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50 dark:bg-gray-800'>
                <TableHead>Item</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className='text-right'>Qty</TableHead>
                <TableHead className='text-right'>Unit Price</TableHead>
                <TableHead className='text-right'>Amount</TableHead>
                <TableHead>Vendor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estimate.Line?.filter(
                (line) => line.DetailType === 'SalesItemLineDetail'
              ).map((line, index) => {
                const lineItem = line as LineItem
                const hasVendor = lineItem.SalesItemLineDetail?.VendorRef?.value

                return (
                  <TableRow
                    key={line.Id || index}
                    className={cn(
                      'hover:bg-gray-50 dark:hover:bg-gray-800',
                      !hasVendor && 'bg-amber-50 dark:bg-amber-950/20'
                    )}
                  >
                    <TableCell className='font-medium'>
                      {lineItem.SalesItemLineDetail?.ItemRef?.name}
                    </TableCell>
                    <TableCell>{lineItem.Description}</TableCell>
                    <TableCell className='text-right'>
                      {lineItem.SalesItemLineDetail?.Qty}
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatCurrency(
                        lineItem.SalesItemLineDetail?.UnitPrice || 0
                      )}
                    </TableCell>
                    <TableCell className='text-right font-medium'>
                      {formatCurrency(lineItem.Amount)}
                    </TableCell>
                    <TableCell>
                      {lineItem.SalesItemLineDetail?.VendorRef?.name || (
                        <span className='text-amber-600 dark:text-amber-400'>
                          No vendor assigned
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {missingVendorItems.length > 0 && (
            <div className='mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800'>
              <p className='text-amber-700 dark:text-amber-400 text-sm'>
                <strong>Note:</strong> {missingVendorItems.length} line item(s)
                are missing vendor references. These items will be excluded from
                purchase orders. To include them, edit the estimate to assign
                vendors.
              </p>
            </div>
          )}

          <div className='mt-4 flex justify-end'>
            <dl className='w-64 space-y-1'>
              <div className='flex justify-between'>
                <dt className='font-medium'>Subtotal:</dt>
                <dd>{formatCurrency(estimate.TotalAmt)}</dd>
              </div>
              {/* Add tax, discount, etc. as needed */}
              <Separator className='my-2' />
              <div className='flex justify-between text-lg font-bold'>
                <dt>Total:</dt>
                <dd>{formatCurrency(estimate.TotalAmt)}</dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {estimate.CustomerMemo?.value && (
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg'>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-700 dark:text-gray-300'>
              {estimate.CustomerMemo.value}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Purchase Order Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>
              {vendorOptions.length > 0
                ? 'Create a purchase order from this estimate.'
                : "This estimate doesn't have any line items with vendor information."}
            </DialogDescription>
          </DialogHeader>

          {vendorOptions.length > 0 ? (
            <>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='vendor' className='text-right'>
                    Vendor
                  </Label>
                  <Select
                    value={selectedVendorId}
                    onValueChange={setSelectedVendorId}
                    disabled={vendorOptions.length <= 1 || isSubmitting}
                  >
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Select a vendor' />
                    </SelectTrigger>
                    <SelectContent>
                      {vendorOptions.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {missingVendorItems.length > 0 && (
                  <div className='col-span-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800'>
                    <p className='text-amber-700 dark:text-amber-400 text-sm'>
                      <strong>Warning:</strong> {missingVendorItems.length} of{' '}
                      {vendorReferenceStats.totalItems} line item(s) are missing
                      vendor references and will not be included in the purchase
                      order.
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant='secondary'
                  onClick={() => setCreateModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  onClick={handleCreatePurchaseOrder}
                  disabled={!selectedVendorId || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Creating...
                    </>
                  ) : (
                    'Create Purchase Order'
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className='py-4'>
                <div className='p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800'>
                  <p className='text-amber-700 dark:text-amber-400'>
                    <strong>No vendor references found</strong>
                    <br />
                    To create a purchase order, first edit the estimate to add
                    vendor references to line items.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant='secondary'
                  onClick={() => setCreateModalOpen(false)}
                >
                  Close
                </Button>
                <Link href={`/dashboard/estimates/${estimate.Id}/edit`}>
                  <Button variant='default'>Edit Estimate</Button>
                </Link>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

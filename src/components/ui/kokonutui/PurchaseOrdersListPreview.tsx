import type {PurchaseOrder} from '@/services/intuit/types'
import {cn} from '@/lib/utils'
import {ShoppingBag, ArrowDownLeft, CheckCircle2, Timer} from 'lucide-react'
import BaseListPreview from './BaseListPreview'

interface PurchaseOrdersListPreviewProps {
  purchaseOrders?: PurchaseOrder[]
  className?: string
}

export default function PurchaseOrdersListPreview({
  purchaseOrders = [],
  className,
}: PurchaseOrdersListPreviewProps) {
  const hasPurchaseOrders = purchaseOrders && purchaseOrders.length > 0

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <BaseListPreview
      title='Purchase Orders'
      entityCount={purchaseOrders.length}
      viewAllLink='/dashboard/purchase-orders'
      viewAllText='View All Purchase Orders'
      className={className}
    >
      {hasPurchaseOrders ? (
        purchaseOrders.map((po) => (
          <div
            key={po.Id}
            className={cn(
              'group flex items-center gap-3',
              'p-2 rounded-lg',
              'hover:bg-zinc-800/50',
              'transition-all duration-200'
            )}
          >
            <div className={cn('p-2 rounded-lg', 'bg-zinc-800')}>
              <ShoppingBag className='w-4 h-4 text-zinc-100' />
            </div>

            <div className='flex-1 flex items-center justify-between min-w-0'>
              <div className='space-y-0.5'>
                <h3 className='text-xs font-medium text-zinc-100'>
                  {po.VendorRef?.name || 'Unknown Vendor'}
                </h3>
                <p className='text-[11px] text-zinc-400'>
                  Ordered: {formatDate(po.TxnDate)}
                </p>
              </div>

              <div className='flex items-center gap-1.5 pl-3'>
                <span className='text-xs font-medium text-red-400'>
                  {po.TotalAmt
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(po.TotalAmt)
                    : '$0.00'}
                </span>
                <ArrowDownLeft className='w-3.5 h-3.5 text-red-400' />
                <div
                  className={cn(
                    'px-1.5 py-0.5 rounded-full',
                    po.POStatus === 'Closed'
                      ? 'bg-emerald-900/30 text-emerald-400'
                      : 'bg-amber-900/30 text-amber-400'
                  )}
                >
                  {po.POStatus === 'Closed' ? (
                    <CheckCircle2 className='w-3 h-3' />
                  ) : (
                    <Timer className='w-3 h-3' />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className='text-xs text-zinc-400 py-2'>
          No purchase orders found
        </div>
      )}
    </BaseListPreview>
  )
}

import type {Bill} from '@/services/intuit/types'
import {cn} from '@/lib/utils'
import {FileText, ArrowDownLeft, CheckCircle2, Timer} from 'lucide-react'
import BaseListPreview from './BaseListPreview'

interface BillsListPreviewProps {
  bills?: Bill[]
  className?: string
}

export default function BillsListPreview({
  bills = [],
  className,
}: BillsListPreviewProps) {
  const hasBills = bills && bills.length > 0

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <BaseListPreview
      title='Recent Bills'
      entityCount={bills.length}
      viewAllLink='/dashboard/bills'
      viewAllText='View All Bills'
      className={className}
    >
      {hasBills ? (
        bills.map((bill) => (
          <div
            key={bill.Id}
            className={cn(
              'group flex items-center gap-3',
              'p-2 rounded-lg',
              'hover:bg-zinc-800/50',
              'transition-all duration-200'
            )}
          >
            <div className={cn('p-2 rounded-lg', 'bg-zinc-800')}>
              <FileText className='w-4 h-4 text-zinc-100' />
            </div>

            <div className='flex-1 flex items-center justify-between min-w-0'>
              <div className='space-y-0.5'>
                <h3 className='text-xs font-medium text-zinc-100'>
                  {bill.VendorRef?.name || 'Unknown Vendor'}
                </h3>
                <p className='text-[11px] text-zinc-400'>
                  Due: {formatDate(bill.DueDate)}
                </p>
              </div>

              <div className='flex items-center gap-1.5 pl-3'>
                <span className='text-xs font-medium text-red-400'>
                  {bill.TotalAmt
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(bill.TotalAmt)
                    : '$0.00'}
                </span>
                <ArrowDownLeft className='w-3.5 h-3.5 text-red-400' />
                <div
                  className={cn(
                    'px-1.5 py-0.5 rounded-full',
                    bill.Balance === 0
                      ? 'bg-emerald-900/30 text-emerald-400'
                      : 'bg-amber-900/30 text-amber-400'
                  )}
                >
                  {bill.Balance === 0 ? (
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
        <div className='text-xs text-zinc-400 py-2'>No bills found</div>
      )}
    </BaseListPreview>
  )
}

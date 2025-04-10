import type {Invoice} from '@/services/intuit/types'
import {cn} from '@/lib/utils'
import {Receipt, ArrowUpRight, CheckCircle2, Timer} from 'lucide-react'
import BaseListPreview from './BaseListPreview'

interface InvoicesListPreviewProps {
  invoices?: Invoice[]
  className?: string
}

export default function InvoicesListPreview({
  invoices = [],
  className,
}: InvoicesListPreviewProps) {
  const hasInvoices = invoices && invoices.length > 0

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <BaseListPreview
      title='Recent Invoices'
      entityCount={invoices.length}
      viewAllLink='/dashboard/invoices'
      viewAllText='View All Invoices'
      className={className}
    >
      {hasInvoices ? (
        invoices.map((invoice) => (
          <div
            key={invoice.Id}
            className={cn(
              'group flex items-center gap-3',
              'p-2 rounded-lg',
              'hover:bg-zinc-800/50',
              'transition-all duration-200'
            )}
          >
            <div className={cn('p-2 rounded-lg', 'bg-zinc-800')}>
              <Receipt className='w-4 h-4 text-zinc-100' />
            </div>

            <div className='flex-1 flex items-center justify-between min-w-0'>
              <div className='space-y-0.5'>
                <h3 className='text-xs font-medium text-zinc-100'>
                  {invoice.CustomerRef?.name || 'Unknown Customer'}
                </h3>
                <p className='text-[11px] text-zinc-400'>
                  Due: {formatDate(invoice.DueDate)}
                </p>
              </div>

              <div className='flex items-center gap-1.5 pl-3'>
                <span className='text-xs font-medium text-green-400'>
                  {invoice.TotalAmt
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(invoice.TotalAmt)
                    : '$0.00'}
                </span>
                <div
                  className={cn(
                    'px-1.5 py-0.5 rounded-full',
                    invoice.Balance === 0
                      ? 'bg-emerald-900/30 text-emerald-400'
                      : 'bg-amber-900/30 text-amber-400'
                  )}
                >
                  {invoice.Balance === 0 ? (
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
        <div className='text-xs text-zinc-400 py-2'>No invoices found</div>
      )}
    </BaseListPreview>
  )
}

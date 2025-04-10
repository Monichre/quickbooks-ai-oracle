import type {Payment} from '@/services/intuit/types'
import {cn} from '@/lib/utils'
import {DollarSign, ArrowUpRight, CheckCircle2} from 'lucide-react'
import BaseListPreview from './BaseListPreview'

interface PaymentsListPreviewProps {
  payments?: Payment[]
  className?: string
}

export default function PaymentsListPreview({
  payments = [],
  className,
}: PaymentsListPreviewProps) {
  const hasPayments = payments && payments.length > 0

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <BaseListPreview
      title='Recent Payments'
      entityCount={payments.length}
      viewAllLink='/dashboard/payments'
      viewAllText='View All Payments'
      className={className}
    >
      {hasPayments ? (
        payments.map((payment) => (
          <div
            key={payment.Id}
            className={cn(
              'group flex items-center gap-3',
              'p-2 rounded-lg',
              'hover:bg-zinc-800/50',
              'transition-all duration-200'
            )}
          >
            <div className={cn('p-2 rounded-lg', 'bg-zinc-800')}>
              <DollarSign className='w-4 h-4 text-zinc-100' />
            </div>

            <div className='flex-1 flex items-center justify-between min-w-0'>
              <div className='space-y-0.5'>
                <h3 className='text-xs font-medium text-zinc-100'>
                  {payment.CustomerRef?.name || 'Unknown Customer'}
                </h3>
                <p className='text-[11px] text-zinc-400'>
                  Received: {formatDate(payment.TxnDate)}
                </p>
              </div>

              <div className='flex items-center gap-1.5 pl-3'>
                <span className='text-xs font-medium text-green-400'>
                  {payment.TotalAmt
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(payment.TotalAmt)
                    : '$0.00'}
                </span>
                <ArrowUpRight className='w-3.5 h-3.5 text-green-400' />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className='text-xs text-zinc-400 py-2'>No payments found</div>
      )}
    </BaseListPreview>
  )
}

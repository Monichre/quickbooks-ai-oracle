import type {Estimate} from '@/services/intuit/types'
import {cn} from '@/lib/utils'
import {FileText, Calendar, CheckCircle2, Timer} from 'lucide-react'
import BaseListPreview from './BaseListPreview'

interface EstimatesListPreviewProps {
  estimates?: Estimate[]
  className?: string
}

export default function EstimatesListPreview({
  estimates = [],
  className,
}: EstimatesListPreviewProps) {
  const hasEstimates = estimates && estimates.length > 0

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <BaseListPreview
      title='Recent Estimates'
      entityCount={estimates.length}
      viewAllLink='/dashboard/estimates'
      viewAllText='View All Estimates'
      className={className}
    >
      {hasEstimates ? (
        estimates.map((estimate) => (
          <div
            key={estimate.Id}
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
                  {estimate.CustomerRef?.name || 'Unknown Customer'}
                </h3>
                <p className='text-[11px] text-zinc-400'>
                  Created: {formatDate(estimate.TxnDate)}
                </p>
              </div>

              <div className='flex items-center gap-1.5 pl-3'>
                <span className='text-xs font-medium text-blue-400'>
                  {estimate.TotalAmt
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(estimate.TotalAmt)
                    : '$0.00'}
                </span>
                <div
                  className={cn(
                    'px-1.5 py-0.5 rounded-full',
                    estimate.TxnStatus === 'Accepted'
                      ? 'bg-emerald-900/30 text-emerald-400'
                      : 'bg-amber-900/30 text-amber-400'
                  )}
                >
                  {estimate.TxnStatus === 'Accepted' ? (
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
        <div className='text-xs text-zinc-400 py-2'>No estimates found</div>
      )}
    </BaseListPreview>
  )
}

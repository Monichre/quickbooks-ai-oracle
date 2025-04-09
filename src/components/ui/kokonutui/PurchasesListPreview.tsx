import type {Purchase} from '@/services/intuit/types'
import {cn} from '@/lib/utils'
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  ShoppingCart,
  CreditCard,
  type LucideIcon,
  ArrowRight,
  DollarSign,
  Building,
} from 'lucide-react'
import Link from 'next/link'

interface Transaction {
  id: string
  title: string
  amount: string
  type: 'incoming' | 'outgoing'
  category: string
  icon: LucideIcon
  timestamp: string
  status: 'completed' | 'pending' | 'failed'
}

interface List02Props {
  transactions?: Transaction[]
  purchases?: Purchase[]
  className?: string
}

const categoryStyles = {
  shopping: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-100',
  food: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-100',
  transport: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-100',
  entertainment: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-100',
}

export default function PurchasesListPreview({
  purchases = [],
  className,
}: List02Props) {
  // If purchases are provided, use them instead of the default transactions
  const hasPurchases = purchases && purchases.length > 0

  // Format date from ISO string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'

    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const isYesterday =
      new Date(now.setDate(now.getDate() - 1)).toDateString() ===
      date.toDateString()

    const timeStr = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

    if (isToday) return `Today, ${timeStr}`
    if (isYesterday) return `Yesterday, ${timeStr}`

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year:
        date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    })
  }

  return (
    <div
      className={cn(
        'w-full',
        'bg-zinc-900/70',
        'border border-zinc-100 dark:border-zinc-800',
        'rounded-xl shadow-sm backdrop-blur-xl',
        className
      )}
    >
      <div className='p-4'>
        <div className='flex items-center justify-between mb-3'>
          <h2 className='text-sm font-semibold text-zinc-100'>
            {hasPurchases ? 'Recent Purchases' : 'Recent Activity'}
            <span className='text-xs font-normal text-zinc-400 ml-1'>
              ({hasPurchases ? purchases.length : '23'} transactions)
            </span>
          </h2>
          <span className='text-xs text-zinc-400'>This Month</span>
        </div>

        <div className='space-y-1'>
          {hasPurchases
            ? // Render purchases from QuickBooks API
              purchases.map((purchase) => (
                <div
                  key={purchase.Id}
                  className={cn(
                    'group flex items-center gap-3',
                    'p-2 rounded-lg',
                    'hover:bg-zinc-100 dark:hover:bg-zinc-800/50',
                    'transition-all duration-200'
                  )}
                >
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      'bg-zinc-100 dark:bg-zinc-800',
                      'border border-zinc-700'
                    )}
                  >
                    {purchase.PaymentType === 'CreditCard' ? (
                      <CreditCard className='w-4 h-4 text-zinc-100' />
                    ) : purchase.PaymentType === 'Cash' ? (
                      <DollarSign className='w-4 h-4 text-zinc-100' />
                    ) : (
                      <Building className='w-4 h-4 text-zinc-100' />
                    )}
                  </div>

                  <div className='flex-1 flex items-center justify-between min-w-0'>
                    <div className='space-y-0.5'>
                      <h3 className='text-xs font-medium text-zinc-100'>
                        {purchase.EntityRef?.name || 'Unknown Vendor'}
                      </h3>
                      <p className='text-[11px] text-zinc-400'>
                        {formatDate(purchase.TxnDate)}
                      </p>
                    </div>

                    <div className='flex items-center gap-1.5 pl-3'>
                      <span className='text-xs font-medium text-red-600 dark:text-red-400'>
                        -{' '}
                        {purchase.Line && purchase.Line.length > 0
                          ? new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            }).format(
                              purchase.Line.reduce(
                                (sum, line) => sum + (line.Amount || 0),
                                0
                              )
                            )
                          : '$0.00'}
                      </span>
                      <ArrowUpRight className='w-3.5 h-3.5 text-red-600 dark:text-red-400' />
                    </div>
                  </div>
                </div>
              ))
            : 'No purchases found'}
        </div>
      </div>

      <div className='p-2 border-t border-zinc-100 dark:border-zinc-800'>
        <button
          type='button'
          className={cn(
            'w-full flex items-center justify-center gap-2',
            'py-2 px-3 rounded-lg',
            'text-xs font-medium',
            'bg-gradient-to-r from-zinc-900 to-zinc-800',
            'dark:from-zinc-50 dark:to-zinc-200',
            'text-zinc-50 dark:text-zinc-900',
            'hover:from-zinc-800 hover:to-zinc-700',
            'dark:hover:from-zinc-200 dark:hover:to-zinc-300',
            'shadow-sm hover:shadow',
            'transform transition-all duration-200',
            'hover:-translate-y-0.5',
            'active:translate-y-0',
            'focus:outline-none focus:ring-2',
            'focus:ring-zinc-500 dark:focus:ring-zinc-400',
            'focus:ring-offset-2 dark:focus:ring-offset-zinc-900'
          )}
        >
          <Link href='/dashboard/purchases' className='flex items-center gap-2'>
            <span>View All {hasPurchases ? 'Purchases' : 'Transactions'}</span>
            <ArrowRight className='w-3.5 h-3.5' />
          </Link>
        </button>
      </div>
    </div>
  )
}

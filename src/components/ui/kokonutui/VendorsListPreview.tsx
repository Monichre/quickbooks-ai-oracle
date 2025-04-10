import {cn} from '@/lib/utils'
import {
  Calendar,
  Users,
  FileText,
  type LucideIcon,
  Clock,
  ArrowRight,
  CheckCircle2,
  Timer,
  AlertCircle,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Building,
} from 'lucide-react'
import React from 'react'
import type {Vendor} from '@/services/intuit/types'
import Link from 'next/link'

interface ListItem {
  id: string
  title: string
  subtitle: string
  icon: LucideIcon
  iconStyle: string
  date: string
  time?: string
  amount?: string
  status: 'pending' | 'in-progress' | 'completed'
  progress?: number
}

interface List03Props {
  items?: ListItem[]
  vendors?: Vendor[]
  className?: string
}

const iconStyles = {
  savings: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100',
  investment: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100',
  debt: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100',
}

const statusConfig = {
  pending: {
    icon: Timer,
    class: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  'in-progress': {
    icon: AlertCircle,
    class: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  completed: {
    icon: CheckCircle2,
    class: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
}

const ITEMS: ListItem[] = [
  {
    id: '1',
    title: 'Emergency Fund',
    subtitle: '3 months of expenses saved',
    icon: PiggyBank,
    iconStyle: 'savings',
    date: 'Target: Dec 2024',
    amount: '$15,000',
    status: 'in-progress',
    progress: 65,
  },
  {
    id: '2',
    title: 'Stock Portfolio',
    subtitle: 'Tech sector investment plan',
    icon: TrendingUp,
    iconStyle: 'investment',
    date: 'Target: Jun 2024',
    amount: '$50,000',
    status: 'pending',
    progress: 30,
  },
  {
    id: '3',
    title: 'Debt Repayment',
    subtitle: 'Student loan payoff plan',
    icon: CreditCard,
    iconStyle: 'debt',
    date: 'Target: Mar 2025',
    amount: '$25,000',
    status: 'in-progress',
    progress: 45,
  },
]

export default function VendorsListPreview({
  items = ITEMS,
  vendors = [],
  className,
}: List03Props) {
  // If vendors are provided, use them instead of the default items
  const hasVendors = vendors && vendors.length > 0

  // Convert vendors to a format suitable for display
  const vendorItems = hasVendors
    ? vendors.map((vendor) => ({
        id: vendor.Id || '',
        title: vendor.DisplayName,
        subtitle: vendor.CompanyName || 'Vendor',
        icon: Building,
        iconStyle: 'savings',
        date: vendor.PrintOnCheckName || '',
        amount: vendor.Balance
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(vendor.Balance)
          : '$0.00',
        status: vendor.Active
          ? 'completed'
          : ('pending' as 'pending' | 'in-progress' | 'completed'),
        email: vendor.PrimaryEmailAddr?.Address,
        phone: vendor.PrimaryPhone?.FreeFormNumber,
      }))
    : []

  return (
    <div className={cn('w-full overflow-x-auto scrollbar-none', className)}>
      <div className='flex gap-3 min-w-full p-1'>
        {hasVendors
          ? // Render vendors from QuickBooks API
            vendorItems.map((vendor) => (
              <div
                key={vendor.id}
                className={cn(
                  'flex flex-col',
                  'w-[280px] shrink-0',
                  'bg-zinc-900/70',
                  'rounded-xl',
                  'border border-zinc-300',
                  'hover:border-zinc-700',
                  'transition-all duration-200',
                  'shadow-sm backdrop-blur-xl'
                )}
              >
                <div className='p-4 space-y-3'>
                  <div className='flex items-start justify-between'>
                    <div
                      className={cn(
                        'p-2 rounded-lg',
                        'bg-zinc-100 dark:bg-zinc-800'
                      )}
                    >
                      <Building className='w-4 h-4 text-zinc-900 dark:text-zinc-100' />
                    </div>
                    <div
                      className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5',
                        vendor.status === 'completed'
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      )}
                    >
                      {vendor.status === 'completed' ? (
                        <CheckCircle2 className='w-3.5 h-3.5' />
                      ) : (
                        <Timer className='w-3.5 h-3.5' />
                      )}
                      {vendor.status === 'completed' ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1'>
                      {vendor.title}
                    </h3>
                    <p className='text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2'>
                      {vendor.subtitle}
                    </p>
                  </div>

                  <div className='flex items-center gap-1.5'>
                    <span className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                      {vendor.amount}
                    </span>
                    <span className='text-xs text-zinc-600 dark:text-zinc-400'>
                      balance
                    </span>
                  </div>

                  {vendor.email && (
                    <div className='flex items-center text-xs text-zinc-600 dark:text-zinc-400'>
                      <span className='truncate'>Email: {vendor.email}</span>
                    </div>
                  )}

                  {vendor.phone && (
                    <div className='flex items-center text-xs text-zinc-600 dark:text-zinc-400'>
                      <span>Phone: {vendor.phone}</span>
                    </div>
                  )}
                </div>

                <div className='mt-auto border-t border-zinc-800'>
                  <button
                    type='button'
                    className={cn(
                      'w-full flex items-center justify-center gap-2',
                      'py-2.5 px-3',
                      'text-xs font-medium',
                      'text-zinc-600 dark:text-zinc-400',
                      'hover:text-zinc-900 dark:hover:text-zinc-100',
                      'hover:bg-zinc-100 dark:hover:bg-zinc-800/50',
                      'transition-colors duration-200'
                    )}
                  >
                    <Link
                      href={`/dashboard/vendors/${vendor.id}`}
                      className='flex items-center gap-2'
                    >
                      View Details
                      <ArrowRight className='w-3.5 h-3.5' />
                    </Link>
                  </button>
                </div>
              </div>
            ))
          : // Render default items if no vendors
            'No vendors found'}
      </div>
    </div>
  )
}

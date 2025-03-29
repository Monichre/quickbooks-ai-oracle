import {cn} from '@/lib/utils'
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  SendHorizontal,
  QrCode,
  type LucideIcon,
  Plus,
  ArrowRight,
  CreditCard,
  Users,
} from 'lucide-react'
import type {Customer} from '@/lib/intuit/api'

interface AccountItem {
  id: string
  title: string
  description?: string
  balance: string
  type: 'savings' | 'checking' | 'investment' | 'debt'
}

interface List01Props {
  totalBalance?: string
  accounts?: AccountItem[]
  customers?: Customer[]
  className?: string
}

export default function List01({
  totalBalance = '$26,540.25',
  accounts,
  customers = [],
  className,
}: List01Props) {
  // If customers are provided, use them instead of the default accounts
  const hasCustomers = customers && customers.length > 0

  // Calculate total balance if customers are provided
  const customerTotalBalance = hasCustomers
    ? customers.reduce((total, customer) => total + (customer.Balance || 0), 0)
    : 0

  // Format as currency
  const formattedCustomerBalance = hasCustomers
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(customerTotalBalance)
    : totalBalance

  return (
    <div
      className={cn(
        'w-full',
        'bg-zinc-900/70',
        'border border-zinc-800',
        'rounded-xl shadow-sm backdrop-blur-xl',
        className
      )}
    >
      {/* Total Balance Section */}
      <div className='p-4 border-b border-zinc-800'>
        <p className='text-xs text-zinc-400'>
          {hasCustomers ? 'Total Customer Balance' : 'Total Balance'}
        </p>
        <h1 className='text-2xl font-semibold text-zinc-50'>
          {formattedCustomerBalance}
        </h1>
      </div>

      {/* Accounts/Customers List */}
      <div className='p-3'>
        <div className='flex items-center justify-between mb-2'>
          <h2 className='text-xs font-medium text-zinc-100'>
            {hasCustomers ? 'Your Customers' : 'Your Accounts'}
          </h2>
        </div>

        <div className='space-y-1'>
          {hasCustomers
            ? // Render customers from QuickBooks API
              customers.map((customer) => (
                <div
                  key={customer.Id}
                  className={cn(
                    'group flex items-center justify-between',
                    'p-2 rounded-lg',
                    'hover:bg-zinc-100 hover:bg-zinc-800/50',
                    'transition-all duration-200'
                  )}
                >
                  <div className='flex items-center gap-2'>
                    <div className='p-1.5 rounded-lg bg-blue-100 bg-blue-900/30'>
                      <Users className='w-3.5 h-3.5 text-blue-600 text-blue-400' />
                    </div>
                    <div>
                      <h3 className='text-xs font-medium text-zinc-100'>
                        {customer.DisplayName}
                      </h3>
                      {customer.CompanyName && (
                        <p className='text-[11px] text-zinc-400'>
                          {customer.CompanyName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='text-right'>
                    <span className='text-xs font-medium text-zinc-100'>
                      {customer.Balance
                        ? new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(customer.Balance)
                        : '$0.00'}
                    </span>
                  </div>
                </div>
              ))
            : 'No customers found'}
        </div>
      </div>

      {/* Footer with buttons */}
      <div className='p-2 border-t border-zinc-800'>
        <div className='grid grid-cols-4 gap-2'>
          <button
            type='button'
            className={cn(
              'flex items-center justify-center gap-2',
              'py-2 px-3 rounded-lg',
              'text-xs font-medium',
              'bg-zinc-900 bg-zinc-50',
              'text-zinc-50 text-zinc-900',
              'hover:bg-zinc-800 hover:bg-zinc-200',
              'shadow-sm hover:shadow',
              'transition-all duration-200'
            )}
          >
            <Plus className='w-3.5 h-3.5' />
            <span>{hasCustomers ? 'New' : 'Add'}</span>
          </button>
          <button
            type='button'
            className={cn(
              'flex items-center justify-center gap-2',
              'py-2 px-3 rounded-lg',
              'text-xs font-medium',
              'bg-zinc-900 bg-zinc-50',
              'text-zinc-50 text-zinc-900',
              'hover:bg-zinc-800 hover:bg-zinc-200',
              'shadow-sm hover:shadow',
              'transition-all duration-200'
            )}
          >
            <SendHorizontal className='w-3.5 h-3.5' />
            <span>{hasCustomers ? 'Email' : 'Send'}</span>
          </button>
          <button
            type='button'
            className={cn(
              'flex items-center justify-center gap-2',
              'py-2 px-3 rounded-lg',
              'text-xs font-medium',
              'bg-zinc-900 bg-zinc-50',
              'text-zinc-50 text-zinc-900',
              'hover:bg-zinc-800 hover:bg-zinc-200',
              'shadow-sm hover:shadow',
              'transition-all duration-200'
            )}
          >
            <ArrowDownLeft className='w-3.5 h-3.5' />
            <span>{hasCustomers ? 'Import' : 'Top-up'}</span>
          </button>
          <button
            type='button'
            className={cn(
              'flex items-center justify-center gap-2',
              'py-2 px-3 rounded-lg',
              'text-xs font-medium',
              'bg-zinc-900 bg-zinc-50',
              'text-zinc-50 text-zinc-900',
              'hover:bg-zinc-800 hover:bg-zinc-200',
              'shadow-sm hover:shadow',
              'transition-all duration-200'
            )}
          >
            <ArrowRight className='w-3.5 h-3.5' />
            <span>More</span>
          </button>
        </div>
      </div>
    </div>
  )
}

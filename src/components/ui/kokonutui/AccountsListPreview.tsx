import type {Account} from '@/services/intuit/types'
import {cn} from '@/lib/utils'
import {Wallet, CreditCard, Building, PiggyBank} from 'lucide-react'
import BaseListPreview from './BaseListPreview'

interface AccountsListPreviewProps {
  accounts?: Account[]
  className?: string
}

export default function AccountsListPreview({
  accounts = [],
  className,
}: AccountsListPreviewProps) {
  const hasAccounts = accounts && accounts.length > 0

  // Get appropriate icon based on account type
  const getAccountIcon = (account: Account) => {
    const accountType = account.AccountType?.toLowerCase() || ''

    if (
      accountType.includes('bank') ||
      accountType.includes('checking') ||
      accountType.includes('savings')
    ) {
      return <Wallet className='w-4 h-4 text-zinc-100' />
    } else if (accountType.includes('credit') || accountType.includes('card')) {
      return <CreditCard className='w-4 h-4 text-zinc-100' />
    } else if (
      accountType.includes('investment') ||
      accountType.includes('asset')
    ) {
      return <PiggyBank className='w-4 h-4 text-zinc-100' />
    } else {
      return <Building className='w-4 h-4 text-zinc-100' />
    }
  }

  return (
    <BaseListPreview
      title='Financial Accounts'
      entityCount={accounts.length}
      viewAllLink='/dashboard/accounts'
      viewAllText='View All Accounts'
      className={className}
    >
      {hasAccounts ? (
        accounts.map((account) => (
          <div
            key={account.Id}
            className={cn(
              'group flex items-center gap-3',
              'p-2 rounded-lg',
              'hover:bg-zinc-800/50',
              'transition-all duration-200'
            )}
          >
            <div className={cn('p-2 rounded-lg', 'bg-zinc-800')}>
              {getAccountIcon(account)}
            </div>

            <div className='flex-1 flex items-center justify-between min-w-0'>
              <div className='space-y-0.5'>
                <h3 className='text-xs font-medium text-zinc-100'>
                  {account.Name}
                </h3>
                <p className='text-[11px] text-zinc-400'>
                  {account.AccountType || 'Account'}
                </p>
              </div>

              <div className='flex items-center gap-1.5 pl-3'>
                <span
                  className={cn(
                    'text-xs font-medium',
                    account.CurrentBalance && account.CurrentBalance >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  )}
                >
                  {account.CurrentBalance !== undefined
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(account.CurrentBalance)
                    : '$0.00'}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className='text-xs text-zinc-400 py-2'>No accounts found</div>
      )}
    </BaseListPreview>
  )
}

import {CreditCard, Wallet, Users} from 'lucide-react'
import {CustomersList} from '@/components/preview-lists/customers-list'
import {PurchasesList} from '@/components/preview-lists/purchases-list'
import {VendorsList} from '@/components/preview-lists/vendors-list'

export function DashboardContent() {
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 border-[#1F1F23]'>
          <h2 className='text-lg font-bold text-gray-900 text-white mb-4 text-left flex items-center gap-2 '>
            <Users className='w-3.5 h-3.5 text-zinc-900 text-zinc-50' />
            Customers
          </h2>
          <div className='flex-1'>
            <CustomersList />
          </div>
        </div>
        <div className='bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 border-[#1F1F23]'>
          <h2 className='text-lg font-bold text-gray-900 text-white mb-4 text-left flex items-center gap-2'>
            <CreditCard className='w-3.5 h-3.5 text-zinc-900 text-zinc-50' />
            Recent Purchases
          </h2>
          <div className='flex-1'>
            <PurchasesList />
          </div>
        </div>
      </div>

      <div className='bg-[#0F0F12] rounded-xl p-6 flex flex-col items-start justify-start border border-gray-200 border-[#1F1F23]'>
        <h2 className='text-lg font-bold text-gray-900 text-white mb-4 text-left flex items-center gap-2'>
          <Wallet className='w-3.5 h-3.5 text-zinc-900 text-zinc-50' />
          Vendors
        </h2>
        <VendorsList />
      </div>
    </div>
  )
}

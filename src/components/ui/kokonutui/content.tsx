import {Calendar, CreditCard, Wallet, Users, Receipt} from 'lucide-react'
import {Suspense} from 'react'

import {
  findCustomers,
  findVendors,
  findPurchases,
  // Customer,
  // Vendor,
  // Purchase,
} from '@/services/intuit/api'
import CustomersListPreview from './CustomersListPreview'
import PurchasesListPreview from './PurchasesListPreview'
import VendorsListPreview from './VendorsListPreview'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import InvoicesListPreview from '@/components/ui/kokonutui/InvoicesListPreview'

async function CustomersList() {
  const {QueryResponse} = await findCustomers({limit: 5})

  console.log('🚀 ~ CustomersList ~ QueryResponse:', QueryResponse)

  return <CustomersListPreview customers={QueryResponse.Customer} />
}

async function PurchasesList() {
  const {QueryResponse} = await findPurchases({limit: 6})

  console.log('🚀 ~ PurchasesList ~ QueryResponse:', QueryResponse)

  return <PurchasesListPreview purchases={QueryResponse.Purchase} />
}

async function VendorsList() {
  const {QueryResponse} = await findVendors({limit: 3})

  console.log('🚀 ~ VendorsList ~ QueryResponse:', QueryResponse)

  return <VendorsListPreview vendors={QueryResponse.Vendor} />
}

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
            <Suspense
              fallback={
                <div className='p-4 text-center'>Loading customers...</div>
              }
            >
              <CustomersList />
            </Suspense>
          </div>
        </div>
        <div className='bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 border-[#1F1F23]'>
          <h2 className='text-lg font-bold text-gray-900 text-white mb-4 text-left flex items-center gap-2'>
            <CreditCard className='w-3.5 h-3.5 text-zinc-900 text-zinc-50' />
            Recent Purchases
          </h2>
          <div className='flex-1'>
            <Suspense
              fallback={
                <div className='p-4 text-center'>Loading transactions...</div>
              }
            >
              <PurchasesList />
            </Suspense>
          </div>
        </div>
        <div className='bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 border-[#1F1F23]'>
          <h2 className='text-lg font-bold text-gray-900 text-white mb-4 text-left flex items-center gap-2'>
            <Receipt className='w-3.5 h-3.5 text-zinc-900 text-zinc-50' />
            Recent Invoices
          </h2>
          <div className='flex-1'>
            <Suspense
              fallback={
                <div className='p-4 text-center'>Loading invoices...</div>
              }
            >
              <InvoicesListPreview />
            </Suspense>
          </div>
        </div>
      </div>

      <div className='bg-[#0F0F12] rounded-xl p-6 flex flex-col items-start justify-start border border-gray-200 border-[#1F1F23]'>
        <h2 className='text-lg font-bold text-gray-900 text-white mb-4 text-left flex items-center gap-2'>
          <Wallet className='w-3.5 h-3.5 text-zinc-900 text-zinc-50' />
          Vendors
          <Button variant='link' asChild className='block ml-auto'>
            <Link href='/dashboard/vendors' className='flex items-center gap-2'>
              View All
            </Link>
          </Button>
        </h2>
        <Suspense
          fallback={<div className='p-4 text-center'>Loading vendors...</div>}
        >
          <VendorsList />
        </Suspense>
      </div>
    </div>
  )
}

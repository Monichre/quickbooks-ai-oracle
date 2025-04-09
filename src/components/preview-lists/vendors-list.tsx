'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {Skeleton} from '@/components/ui/skeleton'
import {ExternalLink} from 'lucide-react'
import * as api from '@/services/intuit/api'
import {
  type Vendor,
  QuickBooksResponse,
} from '@/services/intuit/types/response-types'

export function VendorsList() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchVendors() {
      try {
        setLoading(true)
        // Fetch vendors with a limit of 5 for the preview
        const response = await api.findVendors({limit: 5})
        if (response.QueryResponse?.Vendor) {
          setVendors(response.QueryResponse.Vendor)
        }

        console.log('🚀 ~ fetchVendors ~ response:', response)
      } catch (err) {
        console.error('Error fetching vendors:', err)
        setError(err instanceof Error ? err.message : 'Failed to load vendors')
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  if (loading) {
    return (
      <div className='space-y-2'>
        {['skeleton-1', 'skeleton-2', 'skeleton-3'].map((id) => (
          <div key={id} className='flex justify-between items-center p-2'>
            <Skeleton className='h-5 w-[150px]' />
            <Skeleton className='h-5 w-[60px]' />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className='text-red-500 p-2'>{error}</div>
  }

  if (vendors.length === 0) {
    return <div className='text-gray-400 p-2'>No vendors found</div>
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      {vendors.map((vendor) => (
        <div
          key={vendor.Id}
          className='p-4 border border-gray-700 rounded-lg hover:bg-gray-800/30 transition-colors'
        >
          <div className='font-medium text-white mb-1'>
            {vendor.DisplayName || vendor.CompanyName || 'Unnamed Vendor'}
          </div>
          <div className='text-sm text-gray-400'>
            Balance: ${(vendor.Balance || 0).toFixed(2)}
          </div>
          <div className='text-xs text-gray-500 mt-1'>
            {vendor.Active ? 'Active' : 'Inactive'}
          </div>
        </div>
      ))}

      <Button
        variant='outline'
        size='sm'
        className='w-full mt-4 md:col-span-3 border-gray-700 text-gray-300 hover:text-white'
        onClick={() => router.push('/dashboard/vendors')}
      >
        View All Vendors <ExternalLink className='ml-2 h-4 w-4' />
      </Button>
    </div>
  )
}

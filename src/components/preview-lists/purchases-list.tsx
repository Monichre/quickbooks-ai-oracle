'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {Skeleton} from '@/components/ui/skeleton'
import {ExternalLink} from 'lucide-react'
import * as api from '@/services/intuit/api'
import {
  type Purchase,
  QuickBooksResponse,
} from '@/services/intuit/types/response-types'

export function PurchasesList() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchPurchases() {
      try {
        setLoading(true)
        // Fetch purchases with a limit of 5 for the preview
        const response = await api.findPurchases({limit: 5})
        if (response.QueryResponse?.Purchase) {
          setPurchases(response.QueryResponse.Purchase)
        }
      } catch (err) {
        console.error('Error fetching purchases:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to load purchases'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [])

  if (loading) {
    return (
      <div className='space-y-2'>
        {['skeleton-1', 'skeleton-2', 'skeleton-3'].map((id) => (
          <div key={id} className='flex justify-between items-center p-2'>
            <Skeleton className='h-5 w-[120px]' />
            <Skeleton className='h-5 w-[80px]' />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className='text-red-500 p-2'>{error}</div>
  }

  if (purchases.length === 0) {
    return <div className='text-gray-400 p-2'>No purchases found</div>
  }

  // Format date to a readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className='space-y-2'>
      {purchases.map((purchase) => (
        <div
          key={purchase.Id}
          className='flex justify-between items-center p-2 border-b border-gray-700'
        >
          <div className='flex flex-col'>
            <span className='text-white'>{purchase.DocNumber || 'No ID'}</span>
            <span className='text-xs text-gray-400'>
              {formatDate(purchase.TxnDate)}
            </span>
          </div>
          <span className='text-gray-300'>
            ${(purchase.TotalAmt || 0).toFixed(2)}
          </span>
        </div>
      ))}

      <Button
        variant='outline'
        size='sm'
        className='w-full mt-4 border-gray-700 text-gray-300 hover:text-white'
        onClick={() => router.push('/dashboard/purchases')}
      >
        View All Purchases <ExternalLink className='ml-2 h-4 w-4' />
      </Button>
    </div>
  )
}

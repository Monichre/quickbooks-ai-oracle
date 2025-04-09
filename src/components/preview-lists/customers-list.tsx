'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {Skeleton} from '@/components/ui/skeleton'
import {ExternalLink} from 'lucide-react'
import * as api from '@/services/intuit/api'
import {
  type Customer,
  QuickBooksResponse,
} from '@/services/intuit/types/response-types'
import {findCustomers} from '@/services/intuit/api'

export function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true)
        // Try both approaches to maximize chances of success
        let response: {
          QueryResponse?: {Customer?: Customer[]}
          Customer?: Customer[]
        } | null = null

        response = await findCustomers({limit: 5})
        console.log('API Response:', response)

        // Extract customers from response - try various response formats
        let customers = null
        if (response?.QueryResponse?.Customer) {
          customers = response.QueryResponse.Customer
        } else if (response?.Customer) {
          customers = response.Customer
        }

        if (customers) {
          setCustomers(customers)
        } else {
          setError('Received response but no customer data found')
          console.error('Response structure:', response)
        }
      } catch (err) {
        console.error('Error fetching customers:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to load customers'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
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

  if (customers.length === 0) {
    return <div className='text-gray-400 p-2'>No customers found</div>
  }

  return (
    <div className='space-y-2'>
      {customers.map((customer) => (
        <div
          key={customer.Id}
          className='flex justify-between items-center p-2 border-b border-gray-700'
        >
          <span className='text-white'>
            {customer.DisplayName || customer.CompanyName}
          </span>
          <span className='text-gray-300'>
            ${(customer.Balance || 0).toFixed(2)}
          </span>
        </div>
      ))}

      <Button
        variant='outline'
        size='sm'
        className='w-full mt-4 border-gray-700 text-gray-300 hover:text-white'
        onClick={() => router.push('/dashboard/customers')}
      >
        View All Customers <ExternalLink className='ml-2 h-4 w-4' />
      </Button>
    </div>
  )
}

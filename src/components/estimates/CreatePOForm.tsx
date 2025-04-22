'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {createPurchaseOrdersFromEstimateAction} from '@/actions/estimateActions'

export function CreatePOForm({estimateId}: {estimateId: string}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createPurchaseOrdersFromEstimateAction({estimateId})
      if (result.success) {
        router.push(`/dashboard/purchase-orders/${result.data.Purchase.Id}`)
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      alert(
        `An error occurred: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <button
        type='submit'
        disabled={isSubmitting}
        className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed'
      >
        {isSubmitting ? 'Creating...' : 'Create Purchase Orders'}
      </button>
    </form>
  )
}

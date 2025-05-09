'use client'

import {useEffect} from 'react'
import {useParams, useSearchParams} from 'next/navigation'
import {Spinner} from '@/components/ui/spinner'

/**
 * Print page that serves as a simple loading UI for estimate printing
 * The actual PDF generation happens in the route handler
 */
export default function EstimatePrintPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const estimateId = params?.id as string

  // Get query parameters to display appropriate message
  const isDownloadMode = searchParams?.has('download')
  const emailAddress = searchParams?.get('email')

  // The page just needs to show loading UI
  // The route.ts handler will take care of serving the PDF

  return (
    <div className='flex h-screen w-full items-center justify-center flex-col gap-4'>
      <Spinner size='lg' />
      {emailAddress ? (
        <p className='text-muted-foreground'>
          Sending email to {emailAddress}...
        </p>
      ) : isDownloadMode ? (
        <p className='text-muted-foreground'>Preparing download...</p>
      ) : (
        <p className='text-muted-foreground'>Preparing your estimate...</p>
      )}
    </div>
  )
}

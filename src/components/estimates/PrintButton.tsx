'use client'

import React from 'react'
import {Button} from '@/components/ui/button'
import {Printer} from 'lucide-react'
import {useRouter} from 'next/navigation'

interface PrintButtonProps {
  estimateId: string
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

/**
 * Print button component that opens the estimate print preview in a new tab
 */
export function PrintButton({
  estimateId,
  variant = 'outline',
  size = 'default',
  className,
}: PrintButtonProps) {
  const router = useRouter()

  const handlePrint = () => {
    // Open print view in a new tab, using dashboard route instead of API route
    window.open(`/dashboard/estimates/${estimateId}/print`, '_blank')
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePrint}
      className={className}
      aria-label='Print estimate as PDF'
    >
      <Printer className='h-4 w-4 mr-2' />
      Print
    </Button>
  )
}

/**
 * Print dialog component with download and email options
 */
export function PrintDialog({estimateId}: {estimateId: string}) {
  const [email, setEmail] = React.useState('')
  const [sending, setSending] = React.useState(false)

  const handleDownload = () => {
    // Open download endpoint using dashboard route
    window.open(`/dashboard/estimates/${estimateId}/print?download=1`, '_blank')
  }

  const handleSendEmail = async () => {
    if (!email) return

    setSending(true)
    try {
      // Open the email endpoint using dashboard route
      window.open(
        `/dashboard/estimates/${estimateId}/print?email=${encodeURIComponent(
          email
        )}`,
        '_blank'
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div className='flex flex-col gap-4 p-4'>
      <Button onClick={handleDownload} className='w-full'>
        <Printer className='h-4 w-4 mr-2' />
        Download PDF
      </Button>

      <div className='flex flex-col gap-2'>
        <label htmlFor='email' className='text-sm font-medium'>
          Send via Email
        </label>
        <div className='flex gap-2'>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='recipient@example.com'
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          />
          <Button onClick={handleSendEmail} disabled={!email || sending}>
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

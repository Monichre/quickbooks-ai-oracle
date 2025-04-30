'use client'

import {AlertCircle, XCircle} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {useState} from 'react'

interface ErrorMessageProps {
  title?: string
  message: string
  retry?: () => void
  className?: string
}

export function ErrorMessage({
  title = 'Error',
  message,
  retry,
  className = '',
}: ErrorMessageProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className={`rounded-md bg-red-50 p-4 ${className}`}>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <XCircle className='h-5 w-5 text-red-400' aria-hidden='true' />
        </div>
        <div className='ml-3'>
          <h3 className='text-sm font-medium text-red-800'>{title}</h3>
          <div className='mt-2 text-sm text-red-700'>
            <p>{message}</p>
          </div>
          {retry && (
            <div className='mt-4'>
              <div className='-mx-2 -my-1.5 flex'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={retry}
                  className='bg-red-50 text-red-800 border-red-200 hover:bg-red-100 ml-3'
                >
                  Try again
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setDismissed(true)}
                  className='text-red-800 hover:bg-red-100 ml-2'
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ErrorMessageWithoutRetry({
  title = 'Error',
  message,
  className = '',
}: Omit<ErrorMessageProps, 'retry'>) {
  return (
    <div className={`rounded-md bg-red-50 p-4 ${className}`}>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <AlertCircle className='h-5 w-5 text-red-400' aria-hidden='true' />
        </div>
        <div className='ml-3'>
          <h3 className='text-sm font-medium text-red-800'>{title}</h3>
          <div className='mt-2 text-sm text-red-700'>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Error boundary fallback component
export function ErrorFallback({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className='p-6 max-w-2xl mx-auto my-8'>
      <ErrorMessage
        title='Something went wrong'
        message={error.message}
        retry={reset}
        className='mb-4'
      />
    </div>
  )
}

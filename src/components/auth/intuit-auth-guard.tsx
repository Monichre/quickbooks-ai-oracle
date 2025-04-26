'use client'

import React, {type ReactNode} from 'react'
import {useIntuitAuthContext} from '@/providers/intuit-auth-provider'
import {Loader2} from 'lucide-react'
import {Button} from '@/components/ui/button'

interface IntuitAuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function IntuitAuthGuard({children, fallback}: IntuitAuthGuardProps) {
  const {isAuthenticated, isLoading, error, connect} = useIntuitAuthContext()

  // Show loading state
  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[300px]'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <span className='ml-2 text-lg'>Checking authentication status...</span>
      </div>
    )
  }

  // If not authenticated, show connect button or custom fallback
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className='flex flex-col items-center justify-center min-h-[300px] text-center'>
        <h2 className='text-2xl font-bold mb-4'>
          QuickBooks Authentication Required
        </h2>
        <p className='text-gray-600 mb-6 max-w-md'>
          You need to connect to your QuickBooks account to access this feature.
        </p>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <Button size='lg' onClick={connect}>
          Connect to QuickBooks
        </Button>
      </div>
    )
  }

  // If authenticated, render children
  return <>{children}</>
}

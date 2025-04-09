'use client'

import {useIntuitAuthContext} from '@/providers/intuit-auth-provider'
import {Button} from '@/components/ui/button'
import {Loader2, CheckCircle, XCircle, RefreshCw} from 'lucide-react'
import {useState} from 'react'

export function IntuitAuthStatus() {
  const {
    isAuthenticated,
    isLoading,
    error,
    checkAuthStatus,
    refreshTokens,
    connect,
    disconnect,
  } = useIntuitAuthContext()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Handle manual token refresh with debouncing
  const handleRefreshToken = async () => {
    if (isRefreshing) return

    try {
      setIsRefreshing(true)
      await refreshTokens()
    } finally {
      // Set a timeout to prevent too many refreshes
      setTimeout(() => {
        setIsRefreshing(false)
      }, 5000) // Prevent refreshing for 5 seconds
    }
  }

  return (
    <div className='rounded-lg border p-4 mb-4'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-medium'>QuickBooks Connection Status</h2>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={checkAuthStatus}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            Check Status
          </Button>
          {isAuthenticated && (
            <Button
              variant='outline'
              size='sm'
              onClick={handleRefreshToken}
              disabled={isLoading || isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh Token
            </Button>
          )}
        </div>
      </div>

      <div className='flex items-center mb-4'>
        <div className='mr-4'>
          {isLoading ? (
            <Loader2 className='h-6 w-6 animate-spin text-gray-500' />
          ) : isAuthenticated ? (
            <CheckCircle className='h-6 w-6 text-green-500' />
          ) : (
            <XCircle className='h-6 w-6 text-red-500' />
          )}
        </div>

        <div>
          <p className='font-medium'>
            {isLoading
              ? 'Checking connection...'
              : isAuthenticated
              ? 'Connected to QuickBooks'
              : 'Not connected to QuickBooks'}
          </p>
          {error && <p className='text-sm text-red-500 mt-1'>{error}</p>}
        </div>
      </div>

      <div className='flex gap-3'>
        {isAuthenticated ? (
          <Button
            variant='destructive'
            onClick={disconnect}
            disabled={isLoading}
          >
            Disconnect from QuickBooks
          </Button>
        ) : (
          <Button variant='default' onClick={connect} disabled={isLoading}>
            Connect to QuickBooks
          </Button>
        )}
      </div>
    </div>
  )
}

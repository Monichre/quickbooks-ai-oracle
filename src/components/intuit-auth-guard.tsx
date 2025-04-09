'use client'

import {useEffect, useState} from 'react'
import {useIntuitAuthContext} from '@/providers/intuit-auth-provider'
import {Loader2} from 'lucide-react'
import {Button} from '@/components/ui/button'

interface IntuitAuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * A component that ensures Intuit authentication before rendering its children
 * If not authenticated, shows a loading state or connect button
 */
export function IntuitAuthGuard({
  children,
  fallback = <IntuitAuthGuardLoader />,
}: IntuitAuthGuardProps) {
  const {isAuthenticated, isLoading, error, refreshTokens, connect} =
    useIntuitAuthContext()
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)

  useEffect(() => {
    // Only refresh tokens if not already authenticated and not already checked
    if (!hasCheckedAuth) {
      const checkAuth = async () => {
        // Skip token refresh if we already know we're authenticated
        if (isAuthenticated !== true) {
          await refreshTokens()
        }
        setHasCheckedAuth(true)
      }

      checkAuth()
    }
  }, [refreshTokens, hasCheckedAuth, isAuthenticated])

  // Show fallback while checking auth
  if (isLoading || !hasCheckedAuth) {
    return <>{fallback}</>
  }

  // Not authenticated - show connect button
  if (!isAuthenticated) {
    return <IntuitConnectPrompt connect={connect} error={error} />
  }

  // Authenticated and ready - render children
  return <>{children}</>
}

// Component to prompt user to connect to QuickBooks
function IntuitConnectPrompt({
  connect,
  error,
}: {
  connect: () => Promise<void>
  error: string | null
}) {
  return (
    <div className='flex flex-col items-center justify-center p-8 min-h-[300px] border rounded-lg'>
      <h3 className='text-xl font-medium mb-2'>Connect to QuickBooks</h3>
      <p className='text-muted-foreground mb-6 text-center max-w-md'>
        To view your QuickBooks data, you need to connect your account. This
        allows secure access to your financial information.
      </p>

      {error && (
        <div className='text-red-500 mb-4 text-sm p-3 bg-red-50 rounded-md'>
          {error}
        </div>
      )}

      <Button onClick={connect} size='lg'>
        Connect to QuickBooks
      </Button>
    </div>
  )
}

// Default loading component
function IntuitAuthGuardLoader() {
  return (
    <div className='flex justify-center items-center p-8 min-h-[200px]'>
      <div className='flex flex-col items-center gap-3'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <p className='text-sm text-muted-foreground'>
          Verifying QuickBooks connection...
        </p>
      </div>
    </div>
  )
}

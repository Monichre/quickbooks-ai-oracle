import {getCompanyInfo} from '@/services/intuit/api'
import {Card} from '@/components/ui/card'
import {
  refreshTokensIfNeeded,
  isAuthenticated,
  getAuthorizationUrl,
  redirectToAuth,
  TokenStatus,
} from '@/services/intuit/auth'

import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {Suspense} from 'react'

import {Separator} from '@/components/ui/separator'

import {DashboardContent} from '@/components/ui/kokonutui'
import {AuthRedirectNotification} from '@/components/auth-toast'
import type {CompanyInfoResponse} from '@/services/intuit/types'
import {redirect} from 'next/navigation'
import {DynamicToolbar} from '@/components/toolbar'
// Simple dashboard card component

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: {state?: string}
}) {
  // Show notification if redirected due to token expiration
  const redirectReason = searchParams.state
  const showAuthNotification = redirectReason === 'tokenExpired'

  // Check if authenticated with QuickBooks
  let authenticated = await isAuthenticated()
  const authError = null

  if (!authenticated) {
    // Get token status - if expired, redirect immediately
    const tokenResult = await refreshTokensIfNeeded()
    if (tokenResult.status === TokenStatus.REFRESH_EXPIRED) {
      // Redirect will include state=tokenExpired which will show notification on return
      await redirectToAuth(true)
    }

    authenticated = await isAuthenticated()
    console.log('🚀 ~ DashboardPage ~ authenticated:', authenticated)

    // If still not authenticated after refresh attempt, redirect to auth
    if (!authenticated) {
      await redirectToAuth(true)
    }
  }

  // If authenticated, try to load company data
  let companyData = null
  let dataError = null

  if (authenticated) {
    try {
      companyData = await getCompanyInfo()
      console.log('🚀 ~ DashboardPage ~ companyData:', companyData)
    } catch (error) {
      console.error('Company data error:', error)
      dataError = error instanceof Error ? error.message : 'Data loading error'

      // If the error is due to authentication, redirect to auth
      if (
        error.message?.includes('Not authenticated') ||
        error.message?.includes('invalid_grant') ||
        error.message?.includes('expired')
      ) {
        await redirectToAuth(true)
      }
    }
  }

  // If we have authentication or data errors, show error UI
  if (!authenticated || authError || dataError) {
    const authUrl = await getAuthorizationUrl()

    return (
      <div className='container mx-auto p-6'>
        {(authError || dataError) && (
          <Alert variant='destructive' className='mb-6'>
            <AlertTitle>
              {authError
                ? 'QuickBooks Authentication Error'
                : 'Data Loading Error'}
            </AlertTitle>
            <AlertDescription>{authError || dataError}</AlertDescription>
          </Alert>
        )}

        {!authenticated && !authError && (
          <Alert className='mb-6'>
            <AlertTitle>QuickBooks Connection Required</AlertTitle>
            <AlertDescription>
              Please connect your QuickBooks account to continue.
            </AlertDescription>
          </Alert>
        )}

        <div className='flex gap-4 mt-6'>
          <Link href={authUrl}>
            <Button variant='default'>Connect QuickBooks</Button>
          </Link>
          <Link href='/'>
            <Button variant='outline'>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Success case - show dashboard content
  return (
    <div className='flex flex-col'>
      {showAuthNotification && (
        <div
          id='auth-notification'
          data-reason='Your QuickBooks session has expired. Please reconnect.'
        />
      )}
      <div className='flex flex-1 flex-col gap-4 p-4'>
        <DashboardContent />
      </div>
      {/* <DynamicToolbar /> */}
    </div>
  )
}

/*




catch (error) {
    console.error('Dashboard error:', error)

    return (
      <div className='container mx-auto p-6'>
        <Alert variant='destructive' className='mb-6'>
          <AlertTitle>Error loading QuickBooks data</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : 'An unknown error occurred'}
          </AlertDescription>
        </Alert>

        <div className='flex gap-4 mt-6'>
          <Link href='/quickbooks'>
            <Button variant='default'>Reconnect QuickBooks</Button>
          </Link>
          <Link href='/'>
            <Button variant='outline'>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }
*/

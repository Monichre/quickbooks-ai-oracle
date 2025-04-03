import {getCompanyInfo} from '@/services/intuit/api'
import {Card} from '@/components/ui/card'
import {
  refreshTokensIfNeeded,
  isAuthenticated,
  getAuthorizationUrl,
} from '@/services/intuit/auth'

import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'
import {Button} from '@/components/ui/button'
import Link from 'next/link'

import {SidebarLeft} from '@/components/sidebar-left'
import {SidebarRight} from '@/components/sidebar-right'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import {Separator} from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {DashboardContent} from '@/components/ui/kokonutui'
import type {CompanyInfoResponse} from '@/services/intuit/types'

// Simple dashboard card component

export default async function DashboardPage() {
  // Check if authenticated with QuickBooks
  let authenticated = false
  let authError = null
  let authUrl = ''

  try {
    authenticated = await isAuthenticated()
    if (!authenticated) {
      authUrl = await getAuthorizationUrl()
    }
  } catch (error) {
    console.error('Authentication check error:', error)
    authError = error instanceof Error ? error.message : 'Authentication error'
    try {
      authUrl = await getAuthorizationUrl()
    } catch (urlError) {
      console.error('Failed to get auth URL:', urlError)
    }
  }

  console.log('🚀 ~ DashboardPage ~ authenticated:', authenticated)

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
    }
  }

  // If we have authentication or data errors, show error UI
  if (!authenticated || authError || dataError) {
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
          {authUrl ? (
            <Link href={authUrl}>
              <Button variant='default'>Connect QuickBooks</Button>
            </Link>
          ) : (
            <Link href='/quickbooks'>
              <Button variant='default'>Go to QuickBooks Setup</Button>
            </Link>
          )}
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
      <div className='flex flex-1 flex-col gap-4 p-4'>
        <DashboardContent />
      </div>
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

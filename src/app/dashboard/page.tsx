import {getCompanyInfo} from '@/services/intuit/api'
import {Card} from '@/components/ui/card'
import {refreshTokensIfNeeded, isAuthenticated} from '@/services/intuit/auth'

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
  const authenticated = await isAuthenticated()

  console.log('🚀 ~ DashboardPage ~ authenticated:', authenticated)

  // Redirect to QuickBooks connection page if not authenticated
  // if (!authenticated) {
  //   await refreshTokensIfNeeded()
  //   // redirect('/quickbooks')
  // }

  // try {
  // Ensure we have valid tokens before loading company data
  // await refreshTokensIfNeeded()
  // Load company data directly from the API
  const companyData: any = authenticated ? await getCompanyInfo() : null

  console.log('🚀 ~ DashboardPage ~ companyData:', companyData)

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

import {getCompanyInfo} from '@/lib/intuit/api'
import {Card} from '@/components/ui/card'
import {refreshTokensIfNeeded, isAuthenticated} from '@/lib/intuit/auth'

import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {AdminDashboard} from '@/components/admin-dashboard'
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
import type {CompanyInfoResponse} from '@/lib/intuit/types'

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
  const companyData: CompanyInfoResponse = authenticated
    ? await getCompanyInfo()
    : null

  console.log('🚀 ~ DashboardPage ~ companyData:', companyData)

  return (
    <div className='flex flex-col'>
      <header className='sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background'>
        <div className='flex flex-1 items-center gap-2 px-3'>
          <SidebarTrigger />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className='line-clamp-1'>
                  <strong>Legal Name:</strong>{' '}
                  {companyData?.LegalName || companyData?.CompanyName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className='flex flex-1 flex-col gap-4 p-4'>
        {companyData && (
          <div title='Company Information'>
            {companyData?.CompanyAddr && (
              <p className='mt-2'>
                <strong>Address:</strong>
                <br />
                {companyData?.CompanyAddr.Line1}
                <br />
                {companyData?.CompanyAddr.Line2 && (
                  <>
                    {companyData?.CompanyAddr.Line2}
                    <br />
                  </>
                )}
                {companyData?.CompanyAddr.City},{' '}
                {companyData?.CompanyAddr.CountrySubDivisionCode}{' '}
                {companyData?.CompanyAddr.PostalCode}
              </p>
            )}
            {companyData?.PrimaryPhone && (
              <p className='mt-2'>
                <strong>Phone:</strong>{' '}
                {companyData?.PrimaryPhone.FreeFormNumber}
              </p>
            )}
            {companyData?.CompanyEmail && (
              <p className='mt-2'>
                <strong>Email:</strong> {companyData?.CompanyEmail.Address}
              </p>
            )}
          </div>
        )}
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

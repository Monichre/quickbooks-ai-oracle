import {getCompanyInfo} from '@/lib/intuit/api'
import {Card} from '@/components/ui/card'
import {refreshTokensIfNeeded, isAuthenticated} from '@/lib/intuit/auth'
import {redirect} from 'next/navigation'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {AdminDashboard} from '@/components/admin-dashboard'

export default async function DashboardPage() {
  // Check if authenticated with QuickBooks
  const authenticated = await isAuthenticated()

  console.log('🚀 ~ DashboardPage ~ authenticated:', authenticated)

  // Redirect to QuickBooks connection page if not authenticated
  if (!authenticated) {
    await refreshTokensIfNeeded()
    // redirect('/quickbooks')
  }

  try {
    // Ensure we have valid tokens before loading company data
    await refreshTokensIfNeeded()
    // Load company data directly from the API
    const companyData = await getCompanyInfo()

    console.log('🚀 ~ DashboardPage ~ companyData:', companyData)

    return (
      // @ts-ignore
      <AdminDashboard quickbooksCompanyDataApiResponse={companyData} />
    )
  } catch (error) {
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
}

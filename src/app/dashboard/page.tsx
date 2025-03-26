import {getCompanyInfo} from '@/lib/intuit/api'
import {Card} from '@/components/ui/card'
import {refreshTokensIfNeeded, isAuthenticated} from '@/lib/intuit/auth'
import {redirect} from 'next/navigation'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'
import {Button} from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  // Check if authenticated with QuickBooks
  const authenticated = await isAuthenticated()

  // Redirect to QuickBooks connection page if not authenticated
  if (!authenticated) {
    redirect('/quickbooks')
  }

  try {
    // Ensure we have valid tokens before loading company data
    await refreshTokensIfNeeded()

    // Load company data directly from the API
    const companyData = await getCompanyInfo()
    const {CompanyInfo} = companyData

    return (
      <div className='container mx-auto p-6'>
        <h1 className='text-3xl font-bold mb-6'>{CompanyInfo.CompanyName}</h1>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card className='p-4'>
            <h2 className='text-xl font-semibold mb-4'>Company Information</h2>
            <div className='space-y-2'>
              {CompanyInfo.LegalName && (
                <div>
                  <span className='font-medium'>Legal Name:</span>{' '}
                  {CompanyInfo.LegalName}
                </div>
              )}

              {CompanyInfo.CompanyAddr && (
                <div>
                  <span className='font-medium'>Address:</span>
                  <div className='ml-4'>
                    {CompanyInfo.CompanyAddr.Line1}
                    {CompanyInfo.CompanyAddr.Line2 && (
                      <div>{CompanyInfo.CompanyAddr.Line2}</div>
                    )}
                    {CompanyInfo.CompanyAddr.City},{' '}
                    {CompanyInfo.CompanyAddr.CountrySubDivisionCode}{' '}
                    {CompanyInfo.CompanyAddr.PostalCode}
                  </div>
                </div>
              )}

              {CompanyInfo.PrimaryPhone && (
                <div>
                  <span className='font-medium'>Phone:</span>{' '}
                  {CompanyInfo.PrimaryPhone.FreeFormNumber}
                </div>
              )}

              {CompanyInfo.CompanyEmail && (
                <div>
                  <span className='font-medium'>Email:</span>{' '}
                  {CompanyInfo.CompanyEmail.Address}
                </div>
              )}
            </div>
          </Card>

          {/* Add more dashboard cards here */}
          <Card className='p-4'>
            <h2 className='text-xl font-semibold mb-4'>Financial Overview</h2>
            {/* Placeholder for financial data */}
            <div className='text-center p-8 text-gray-500'>
              Financial data overview will appear here
            </div>
          </Card>

          <Card className='p-4'>
            <h2 className='text-xl font-semibold mb-4'>Recent Activity</h2>
            {/* Placeholder for recent activity */}
            <div className='text-center p-8 text-gray-500'>
              Recent activity will appear here
            </div>
          </Card>
        </div>
      </div>
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

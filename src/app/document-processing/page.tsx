import {DocumentProcessingPipeline} from '@/features/document-processing/DocumentProcessingPipeline'

import {getCompanyInfo} from '@/services/intuit/api'

import {
  refreshTokensIfNeeded,
  isAuthenticated,
  getAuthorizationUrl,
} from '@/services/intuit/auth/auth'

import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'
import {Button} from '@/components/ui/button'
import Link from 'next/link'

export default async function DocumentProcessingPage() {
  // Simple dashboard card component

  // Check if authenticated with QuickBooks
  let authenticated = await isAuthenticated()
  const authError = null
  const authUrl = await getAuthorizationUrl()

  if (!authenticated) {
    refreshTokensIfNeeded()
    authenticated = await isAuthenticated()

    console.log('🚀 ~ DashboardPage ~ authenticated:', authenticated)
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
    }
  }

  // If we have authentication or data errors, show error UI
  if (!authenticated || authError || dataError) {
    // redirect(authUrl)
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
    <div className='flex flex-col h-screen w-screen justify-center items-center align-middle'>
      <DocumentProcessingPipeline />
    </div>
  )
}

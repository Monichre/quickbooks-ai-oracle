import {ConnectToQuickbooks} from '@/components/connect-to-quickbooks'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {isAuthenticated} from '@/lib/intuit/auth'
import Link from 'next/link'

export default async function QuickbooksPage() {
  // Check if the user is authenticated with QuickBooks
  const authenticated = await isAuthenticated()
  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-6'>QuickBooks Integration</h1>

      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            {authenticated ? (
              <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-2'>
                  <div className='h-3 w-3 rounded-full bg-green-500' />
                  <p className='text-green-500 font-medium'>
                    Connected to QuickBooks
                  </p>
                </div>
                <Link href='/dashboard'>
                  <Button variant='default'>Go to Dashboard</Button>
                </Link>
              </div>
            ) : (
              <ConnectToQuickbooks />
            )}
          </CardContent>
        </Card>

        {authenticated && (
          <Card>
            <CardHeader>
              <CardTitle>Available Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4'>
                <Link href='/dashboard'>
                  <Button variant='outline' className='w-full justify-start'>
                    View Dashboard
                  </Button>
                </Link>
                <Link href='/dashboard/customers'>
                  <Button variant='outline' className='w-full justify-start'>
                    Manage Customers
                  </Button>
                </Link>
                <Link href='/dashboard/vendors'>
                  <Button variant='outline' className='w-full justify-start'>
                    Manage Vendors
                  </Button>
                </Link>
                <Link href='/dashboard/purchases'>
                  <Button variant='outline' className='w-full justify-start'>
                    View Purchases
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

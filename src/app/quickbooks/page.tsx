import {ConnectToQuickbooks} from '@/components/connect-to-quickbooks'
import {isAuthenticated} from '@/lib/intuit/auth'
import {getPurchases, getVendors} from '@/lib/intuit/intuit-api'
import {cookies} from 'next/headers'

export default async function QuickbooksPage() {
  // Check if authenticated with QuickBooks
  const authenticated = await isAuthenticated()

  // If not authenticated, show connect button
  if (!authenticated) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] p-6'>
        <h1 className='text-3xl font-bold mb-8'>Connect to QuickBooks</h1>
        <p className='mb-8 text-gray-700 text-center max-w-md'>
          Connect your QuickBooks account to enable seamless integration with
          your accounting data.
        </p>
        <ConnectToQuickbooks />
      </div>
    )
  }

  // Try to fetch some data from QuickBooks
  let vendorsData = null
  let purchasesData = null
  let error = null

  try {
    // Fetch vendors and purchases in parallel
    const [vendors, purchases] = await Promise.all([
      getVendors(),
      getPurchases(),
    ])

    vendorsData = vendors.QueryResponse.Vendor
    purchasesData = purchases.QueryResponse.Purchase
  } catch (err) {
    console.error('Error fetching QuickBooks data:', err)
    error = err instanceof Error ? err.message : 'Unknown error'
  }

  // Display the authenticated view with data
  return (
    <div className='container mx-auto p-6'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>QuickBooks Integration</h1>
        <form action='/api/intuit/logout' method='post'>
          <button
            type='submit'
            className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
          >
            Disconnect QuickBooks
          </button>
        </form>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6'>
          <p>Error: {error}</p>
        </div>
      )}

      <div className='grid md:grid-cols-2 gap-6'>
        {/* Vendors section */}
        <div className='bg-white shadow rounded-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>Vendors</h2>
          {vendorsData && vendorsData.length > 0 ? (
            <ul className='divide-y'>
              {vendorsData.map((vendor) => (
                <li key={vendor.Id} className='py-3'>
                  <p className='font-medium'>{vendor.DisplayName}</p>
                  {vendor.CompanyName && (
                    <p className='text-sm text-gray-600'>
                      {vendor.CompanyName}
                    </p>
                  )}
                  {vendor.PrimaryEmailAddr && (
                    <p className='text-sm text-gray-500'>
                      {vendor.PrimaryEmailAddr.Address}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500'>No vendors found</p>
          )}
        </div>

        {/* Purchases section */}
        <div className='bg-white shadow rounded-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>Recent Purchases</h2>
          {purchasesData && purchasesData.length > 0 ? (
            <ul className='divide-y'>
              {purchasesData.map((purchase) => (
                <li key={purchase.Id} className='py-3'>
                  <div className='flex justify-between'>
                    <p className='font-medium'>
                      {purchase.PaymentType} - $
                      {purchase.Line.reduce(
                        (sum, line) => sum + line.Amount,
                        0
                      ).toFixed(2)}
                    </p>
                    <p className='text-sm text-gray-500'>{purchase.TxnDate}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500'>No purchases found</p>
          )}
        </div>
      </div>
    </div>
  )
}

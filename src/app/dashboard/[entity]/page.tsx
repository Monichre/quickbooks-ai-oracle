import {Suspense} from 'react'
import {notFound} from 'next/navigation'
import EntityTable from './entity-table'

// Define a type for the supported entity types
import type {EntityType} from '@/services/intuit/types'

// Import QueryParams for type safety
import {
  findAccounts,
  findCustomers,
  findVendors,
  findInvoices,
  findItems,
  findProducts,
  findPurchases,
  findPurchaseOrders,
  findBills,
  findEstimates,
  type QueryParams,
} from '@/services/intuit/api'

// Define a common function type for all API endpoints
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiFunction = (params?: {
  limit?: number
  [key: string]: any
}) => Promise<any>

// Map entity types to their corresponding API functions
const entityApiFunctionMap: Record<EntityType, ApiFunction> = {
  accounts: findAccounts,
  customers: findCustomers,
  vendors: findVendors,
  invoices: findInvoices,
  items: findItems,
  products: findProducts,
  purchases: findPurchases,
  'purchase-orders': findPurchaseOrders,
  bills: findBills,
  estimates: findEstimates,
}

// Server Component to handle data fetching
async function fetchEntityData(entity: string) {
  if (!entity || !entityApiFunctionMap[entity as EntityType]) {
    return notFound()
  }

  try {
    // Call the appropriate API function with default parameters
    const response = await entityApiFunctionMap[entity as EntityType]({
      limit: 100,
    })

    console.log('🚀 ~ fetchEntityData ~ response:', response)

    // Convert entity string to capitalized singular form for accessing QueryResponse
    const capitalizedEntity = entity
      .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
      .replace(/s$/, '')
      .replace(/^[a-z]/, (c) => c.toUpperCase())

    // Most API responses have a QueryResponse property containing the actual data
    // Try to access the data using QueryResponse[CapitalEntityKey] pattern
    if (
      response.QueryResponse &&
      Object.prototype.hasOwnProperty.call(
        response.QueryResponse,
        capitalizedEntity
      )
    ) {
      return response.QueryResponse[capitalizedEntity]
    }

    // Fallback to the entire QueryResponse or response if specific key not found
    return response.QueryResponse || response
  } catch (error) {
    console.error(`Error fetching ${entity} data:`, error)
    throw new Error(
      `Failed to fetch ${entity} data: ${(error as Error).message}`
    )
  }
}

export default async function EntityPage({params}: {params: {entity: string}}) {
  console.log('🚀 ~ EntityPage ~ params:', params)

  const {entity} = await params

  // Check if entity is valid
  if (!entityApiFunctionMap[entity as EntityType]) {
    return notFound()
  }

  const data = await fetchEntityData(entity)

  console.log('🚀 ~ EntityPage ~ data:', data)

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-6 capitalize'>{entity}</h1>
      <Suspense
        fallback={
          <div className='flex justify-center items-center min-h-[400px]'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary' />
          </div>
        }
      >
        <EntityTable entity={entity as EntityType} initialData={data} />
      </Suspense>
    </div>
  )
}

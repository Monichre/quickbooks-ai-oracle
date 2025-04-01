import {Suspense} from 'react'
import {notFound} from 'next/navigation'
import EntityTable from './entity-table'

// Define a type for the supported entity types
type EntityType =
  | 'accounts'
  | 'customers'
  | 'vendors'
  | 'invoices'
  | 'items'
  | 'products'
  | 'purchases'
  | 'purchase-orders'

// Map entity types to their API endpoints
export const entityApiMap: Record<EntityType, string> = {
  accounts: '/api/quickbooks/account',
  customers: '/api/quickbooks/customer',
  vendors: '/api/quickbooks/vendor',
  invoices: '/api/quickbooks/invoice',
  items: '/api/quickbooks/item',
  products: '/api/quickbooks/product',
  purchases: '/api/quickbooks/purchase',
  'purchase-orders': '/api/quickbooks/purchase-order',
}

// Server Component to handle data fetching
async function fetchEntityData(entity: string) {
  if (!entity || !entityApiMap[entity as EntityType]) {
    return notFound()
  }

  const response = await fetch(entityApiMap[entity as EntityType], {
    // This ensures the data is fresh on each request
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${entity} data: ${response.statusText}`)
  }

  return response.json()
}

export default async function EntityPage({params}: {params: {entity: string}}) {
  const {entity} = params

  // Check if entity is valid
  if (!entityApiMap[entity as EntityType]) {
    return notFound()
  }

  const data = await fetchEntityData(entity)

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

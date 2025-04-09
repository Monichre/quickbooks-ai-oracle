import {Suspense} from 'react'
import {notFound} from 'next/navigation'
import EntityTable from './entity-table'
import * as api from '@/services/intuit/api'
import {Breadcrumbs} from '@/components/ui/breadcrumb'
import {IntuitAuthGuard} from '@/components/auth/intuit-auth-guard'

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
  | 'payments'
  | 'bills'

// Map entity types to their API methods
export const entityApiMap = {
  accounts: {
    findMethod: api.findAccounts,
    getMethod: api.getAccount,
  },
  customers: {
    findMethod: api.findCustomers,
    getMethod: api.getCustomer,
  },
  vendors: {
    findMethod: api.findVendors,
    getMethod: api.getVendor,
  },
  invoices: {
    findMethod: api.findInvoices,
    getMethod: api.getInvoice,
  },
  items: {
    findMethod: api.findItems,
    getMethod: api.getItem,
  },
  products: {
    findMethod: api.findItems, // Same as items in QB API
    getMethod: api.getItem,
  },
  purchases: {
    findMethod: api.findPurchases,
    getMethod: api.getPurchase,
  },
  'purchase-orders': {
    findMethod: api.findPurchaseOrders,
    getMethod: api.getPurchaseOrder,
  },
  payments: {
    findMethod: api.queryPayments,
    getMethod: api.getPayment,
  },
  bills: {
    findMethod: api.queryBills,
    getMethod: api.getBill,
  },
}

// Display names for entity types
const entityDisplayNames: Record<EntityType, string> = {
  accounts: 'Accounts',
  customers: 'Customers',
  vendors: 'Vendors',
  invoices: 'Invoices',
  items: 'Items',
  products: 'Products',
  purchases: 'Purchases',
  'purchase-orders': 'Purchase Orders',
  payments: 'Payments',
  bills: 'Bills',
}

// Server Component to handle data fetching
async function fetchEntityData(entity: string) {
  if (!entity || !entityApiMap[entity as EntityType]) {
    return notFound()
  }

  try {
    // Use the findMethod from the entityApiMap to fetch all entities of this type
    const apiMethod = entityApiMap[entity as EntityType].findMethod

    console.log('🚀 ~ fetchEntityData ~ apiMethod:', apiMethod)

    if (!apiMethod) {
      throw new Error(`API method not found for entity: ${entity}`)
    }

    // Fetch data with a larger limit for the full table view
    const data = await apiMethod({limit: 100})
    return data
  } catch (error) {
    console.error(`Error fetching ${entity} data:`, error)
    throw new Error(
      `Failed to fetch ${entity} data: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

export default async function EntityPage({params}: {params: {entity: string}}) {
  const {entity} = params

  console.log('🚀 ~ EntityPage ~ entity:', entity)

  // Check if entity is valid
  if (!entityApiMap[entity as EntityType]) {
    return notFound()
  }

  const data = await fetchEntityData(entity)

  console.log('🚀 ~ EntityPage ~ data:', data)

  // Get display name for the entity
  const displayName = entityDisplayNames[entity as EntityType] || entity

  // Set up breadcrumbs
  const breadcrumbItems = [
    {label: 'Dashboard', href: '/dashboard'},
    {label: displayName, href: `/dashboard/${entity}`, current: true},
  ]

  return (
    <div className='container mx-auto py-8'>
      <Breadcrumbs items={breadcrumbItems} className='mb-6' />

      <h1 className='text-2xl font-bold mb-6 capitalize'>{displayName}</h1>

      <IntuitAuthGuard>
        <Suspense
          fallback={
            <div className='flex justify-center items-center min-h-[400px]'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary' />
            </div>
          }
        >
          <EntityTable entity={entity as EntityType} initialData={data} />
        </Suspense>
      </IntuitAuthGuard>
    </div>
  )
}

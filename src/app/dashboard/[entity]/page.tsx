'use client'

import {useEffect, useState} from 'react'
import {useParams} from 'next/navigation'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'

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

// Define a generic entity object type
type EntityObject = Record<string, unknown>

// Map entity types to their API endpoints
const entityApiMap: Record<EntityType, string> = {
  accounts: '/api/quickbooks/account',
  customers: '/api/quickbooks/customer',
  vendors: '/api/quickbooks/vendor',
  invoices: '/api/quickbooks/invoice',
  items: '/api/quickbooks/item',
  products: '/api/quickbooks/product',
  purchases: '/api/quickbooks/purchase',
  'purchase-orders': '/api/quickbooks/purchase-order',
}

export default function EntityPage() {
  const params = useParams()
  const entity = params.entity as EntityType

  const [data, setData] = useState<EntityObject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [columns, setColumns] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!entity || !entityApiMap[entity]) {
        setError(`Unsupported entity type: ${entity}`)
        setLoading(false)
        return
      }

      try {
        const response = await fetch(entityApiMap[entity])

        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${entity} data: ${response.statusText}`
          )
        }

        const result = await response.json()

        // Extract the data from the response based on entity type
        let entityData: EntityObject[] = []

        // Different entities have different response structures
        if (result.QueryResponse) {
          // Find the entity data in the QueryResponse object
          const entityKey = Object.keys(result.QueryResponse).find(
            (key) =>
              key.toLowerCase() === entity.slice(0, -1) ||
              (entity === 'purchase-orders' && key === 'PurchaseOrder') ||
              (entity === 'items' && key === 'Item') ||
              (entity === 'products' && key === 'Item')
          )

          if (entityKey) {
            entityData = result.QueryResponse[entityKey]
          }
        } else if (Array.isArray(result)) {
          entityData = result
        } else if (result[entity.slice(0, -1)]) {
          entityData = [result[entity.slice(0, -1)]]
        }

        // If we found data, determine the columns
        if (entityData.length > 0) {
          // Get all unique keys from all objects
          const allKeys = entityData.reduce(
            (keys: Set<string>, item: EntityObject) => {
              for (const key of Object.keys(item)) {
                // Filter out complex objects and arrays for table display
                if (
                  item[key] !== null &&
                  typeof item[key] !== 'object' &&
                  !Array.isArray(item[key])
                ) {
                  keys.add(key)
                }
              }
              return keys
            },
            new Set<string>()
          )

          // Convert the keys Set to an array and prioritize common fields
          const priorityKeys = [
            'Id',
            'Name',
            'DisplayName',
            'DocNumber',
            'Active',
            'Balance',
          ]
          const otherKeys = Array.from(allKeys).filter(
            (key) => !priorityKeys.includes(key)
          )
          setColumns([
            ...priorityKeys.filter((key) => allKeys.has(key)),
            ...otherKeys,
          ])
        }

        setData(entityData || [])
        setLoading(false)
      } catch (err) {
        console.error(`Error fetching ${entity} data:`, err)
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        )
        setLoading(false)
      }
    }

    fetchData()
  }, [entity])

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-4 bg-red-50 border border-red-200 rounded-md text-red-700'>
        <h2 className='text-lg font-semibold'>Error</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700'>
        <h2 className='text-lg font-semibold'>No Data Found</h2>
        <p>No {entity} data available.</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-6 capitalize'>{entity}</h1>

      <div className='overflow-x-auto rounded-lg border border-gray-200'>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.Id?.toString() || index}>
                {columns.map((column) => (
                  <TableCell key={`${item.Id || index}-${column}`}>
                    {item[column]?.toString() || '—'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

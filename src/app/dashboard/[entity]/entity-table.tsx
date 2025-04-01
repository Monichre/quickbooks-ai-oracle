'use client'

import {useEffect, useState} from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {entityApiMap} from './page'

// Define a generic entity object type
type EntityObject = Record<string, unknown>

// Define possible response structures
type QuickBooksResponse = {
  QueryResponse?: Record<string, EntityObject[]>
  [key: string]: unknown
}

interface EntityTableProps {
  entity: string
  initialData: QuickBooksResponse
}

export default function EntityTable({entity, initialData}: EntityTableProps) {
  const [data, setData] = useState<EntityObject[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Extract the data from the response based on entity type
      let entityData: EntityObject[] = []

      // Process the initialData based on its structure
      if (initialData.QueryResponse) {
        // Find the entity data in the QueryResponse object
        const entityKey = Object.keys(initialData.QueryResponse).find(
          (key) =>
            key.toLowerCase() === entity.slice(0, -1) ||
            (entity === 'purchase-orders' && key === 'PurchaseOrder') ||
            (entity === 'items' && key === 'Item') ||
            (entity === 'products' && key === 'Item')
        )

        if (entityKey) {
          entityData = initialData.QueryResponse[entityKey]
        }
      } else if (Array.isArray(initialData)) {
        entityData = initialData as unknown as EntityObject[]
      } else if (initialData[entity.slice(0, -1)]) {
        entityData = [initialData[entity.slice(0, -1)] as EntityObject]
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
    } catch (err) {
      console.error(`Error processing ${entity} data:`, err)
      setError(
        err instanceof Error ? err.message : 'An error occurred processing data'
      )
    }
  }, [entity, initialData])

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
  )
}

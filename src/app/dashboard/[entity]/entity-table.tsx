'use client'

import {useEffect, useState, useMemo} from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {ChevronDown, ChevronUp} from 'lucide-react'
import {Pagination} from '@/components/ui/pagination'
import {entityApiMap} from './page'
import {
  type EntityObject,
  type QuickBooksResponse,
  entityTypeToResponseKey,
} from '@/services/intuit/types/response-types'

interface EntityTableProps {
  entity: string
  initialData: QuickBooksResponse
}

export default function EntityTable({entity, initialData}: EntityTableProps) {
  const [data, setData] = useState<EntityObject[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState<{
    key: string | null
    direction: 'asc' | 'desc'
  }>({
    key: null,
    direction: 'asc',
  })

  // Extract all data from the response
  const allData = useMemo(() => {
    try {
      // Extract the data from the response based on entity type
      let entityData: EntityObject[] = []

      // Get the entity key from the mapping
      const entityKey = entityTypeToResponseKey[entity]

      // Process the initialData based on its structure
      if (initialData.QueryResponse?.[entityKey]) {
        entityData = initialData.QueryResponse[entityKey]
      } else if (Array.isArray(initialData)) {
        entityData = initialData as unknown as EntityObject[]
      } else if (initialData[entityKey]) {
        entityData = [initialData[entityKey] as EntityObject]
      }

      return entityData || []
    } catch (err) {
      console.error(`Error extracting data for ${entity}:`, err)
      return []
    }
  }, [entity, initialData])

  // Total count of items
  const totalCount = useMemo(() => {
    return initialData.QueryResponse?.totalCount || allData.length
  }, [allData.length, initialData.QueryResponse?.totalCount])

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(allData.length / itemsPerPage))
  }, [allData.length, itemsPerPage])

  // Current page data
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sortData(allData, sortConfig.key, sortConfig.direction).slice(
      startIndex,
      endIndex
    )
  }, [allData, currentPage, itemsPerPage, sortConfig])

  useEffect(() => {
    try {
      // If we found data, determine the columns
      if (allData.length > 0) {
        // Get all unique keys from all objects
        const allKeys = allData.reduce(
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
          'TotalAmt',
          'TxnDate',
          'DueDate',
        ]
        const otherKeys = Array.from(allKeys).filter(
          (key) => !priorityKeys.includes(key)
        )
        setColumns([
          ...priorityKeys.filter((key) => allKeys.has(key)),
          ...otherKeys,
        ])
      }

      setData(currentData)
    } catch (err) {
      console.error(`Error processing ${entity} data:`, err)
      setError(
        err instanceof Error ? err.message : 'An error occurred processing data'
      )
    }
  }, [entity, allData, currentData])

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Sort data function
  function sortData(
    data: EntityObject[],
    key: string | null,
    direction: 'asc' | 'desc'
  ): EntityObject[] {
    if (!key || !data) return data

    return [...data].sort((a, b) => {
      // Handle null or undefined values
      if (a[key] === null || a[key] === undefined)
        return direction === 'asc' ? -1 : 1
      if (b[key] === null || b[key] === undefined)
        return direction === 'asc' ? 1 : -1

      // Compare based on value types
      if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        return direction === 'asc'
          ? (a[key] as string).localeCompare(b[key] as string)
          : (b[key] as string).localeCompare(a[key] as string)
      }

      // Default numeric comparison
      return direction === 'asc'
        ? Number(a[key]) - Number(b[key])
        : Number(b[key]) - Number(a[key])
    })
  }

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    })
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
    <div className='space-y-2'>
      <div className='text-sm text-gray-500 mb-2 flex justify-between items-center'>
        <div>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, allData.length)} of{' '}
          {allData.length} records (Total: {totalCount})
        </div>
        <div className='flex items-center space-x-2'>
          <span>Rows per page:</span>
          <select
            className='border border-gray-300 rounded p-1 text-sm'
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1) // Reset to first page when changing page size
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      <div className='overflow-x-auto rounded-lg border border-gray-200'>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column}
                  className='cursor-pointer hover:bg-gray-50'
                  onClick={() => handleSort(column)}
                >
                  <div className='flex items-center space-x-1'>
                    <span>{column}</span>
                    {sortConfig.key === column &&
                      (sortConfig.direction === 'asc' ? (
                        <ChevronUp className='h-4 w-4' />
                      ) : (
                        <ChevronDown className='h-4 w-4' />
                      ))}
                  </div>
                </TableHead>
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

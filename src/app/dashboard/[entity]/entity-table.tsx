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
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {ArrowUpDown, ChevronLeft, ChevronRight} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {cn} from '@/lib/utils'
import type {
  Item,
  Invoice,
  Account,
  Customer,
  Purchase,
  PurchaseOrder,
  Vendor,
  Product,
} from '@/services'
import type {Bill} from '@/services/intuit/bill/bill.types'
import type {Estimate} from '@/services/intuit/estimate/estimate.types'
import type {Payment} from '@/services/intuit/payment/payment.types'
import type {Employee} from '@/services/intuit/employee/employee.types'

// Define a generic entity object type
type EntityObject = Purchase | PurchaseOrder

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
  const [columnKeys, setColumnKeys] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)

  useEffect(() => {
    try {
      // Extract the data from the response based on entity type
      let entityData: EntityObject[] = []

      // Define a more comprehensive EntityObject type to include all possible entity types
      type EntityObject =
        | Purchase
        | PurchaseOrder
        | Account
        | Customer
        | Vendor
        | Invoice
        | Item
        | Product
        | Bill
        | Estimate
        | Payment
        | Employee
        | {[key: string]: any} // Fallback for other entity types

      // Process the initialData based on its structure
      if (Array.isArray(initialData)) {
        entityData = initialData as unknown as EntityObject[]
      } else if (initialData?.QueryResponse) {
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
        setColumnKeys([
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

  // Memoize columns definition based on column keys
  const columns = useMemo<ColumnDef<EntityObject>[]>(() => {
    if (!columnKeys.length) return []

    // Determine which column should be pinned (DisplayName, Name, or Id in that order)
    const pinnedColumnKey = columnKeys.includes('DisplayName')
      ? 'DisplayName'
      : columnKeys.includes('Name')
      ? 'Name'
      : columnKeys.includes('Id')
      ? 'Id'
      : null

    return columnKeys.map((key) => ({
      id: key,
      accessorKey: key,
      enablePinning: true,
      // Pin the DisplayName, Name or Id column to the left
      ...(key === pinnedColumnKey ? {pin: 'left'} : {}),
      header: ({column}) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className={cn(
              'pl-0 font-medium',
              column.getIsPinned() && 'bg-muted/50'
            )}
          >
            {key}
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        )
      },
      cell: ({row}) => {
        const value = row.getValue(key)
        return (
          <div className='truncate max-w-[200px]'>
            {value?.toString() || '—'}
          </div>
        )
      },
      enableSorting: true,
      enableFiltering: true,
    }))
  }, [columnKeys])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    enableColumnFilters: true,
    enableColumnPinning: true,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

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
    <div className='space-y-4'>
      {/* Global filter */}
      <div className='flex items-center gap-2'>
        <Input
          placeholder='Search all columns...'
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className='max-w-sm'
        />
      </div>

      {/* Table with horizontal scrolling container */}
      <div className='overflow-x-auto rounded-lg border border-gray-200'>
        <Table>
          <TableHeader>
            <TableRow>
              {table.getFlatHeaders().map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    'whitespace-nowrap',
                    header.column.getIsPinned() &&
                      'sticky left-0 z-10 bg-background border-r'
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
            {/* Add filtering inputs */}
            <TableRow>
              {table.getFlatHeaders().map((header) => (
                <TableHead
                  key={`filter-${header.id}`}
                  className={cn(
                    header.column.getIsPinned() &&
                      'sticky left-0 z-10 bg-background border-r'
                  )}
                >
                  {header.column.getCanFilter() ? (
                    <Input
                      placeholder={`Filter ${header.column.id}`}
                      value={(header.column.getFilterValue() as string) ?? ''}
                      onChange={(e) =>
                        header.column.setFilterValue(e.target.value)
                      }
                      className='w-full max-w-[150px] h-8 text-xs'
                    />
                  ) : null}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.getIsPinned() &&
                          'sticky left-0 z-10 bg-white border-r'
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between space-x-2 py-4'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm text-muted-foreground'>Rows per page:</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value))
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className='h-8 w-20'>
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center justify-end space-x-6 lg:space-x-8'>
          <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

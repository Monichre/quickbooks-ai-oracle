'use client'

import {useEffect, useState, useMemo, useCallback} from 'react'
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
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  ExternalLink,
  MoreHorizontal,
} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {cn} from '@/lib/utils'
import {useRouter} from 'next/navigation'
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

// Add to the EntityTableProps interface
type ColumnConfig = {
  selectedColumns?: string[]
  columnLabels?: Record<string, string>
}

type EntityTableProps = {
  entity: string
  initialData: QuickBooksResponse | EntityObject[]
  columnConfig?: ColumnConfig
  onCreatePurchaseOrder?: (estimate: Estimate) => void
  onCreateInvoice?: (estimate: Estimate) => void
}

export default function EntityTable({
  entity,
  initialData,
  columnConfig,
  onCreatePurchaseOrder,
  onCreateInvoice,
}: EntityTableProps) {
  const router = useRouter()
  const [data, setData] = useState<EntityObject[]>([])
  const [columnKeys, setColumnKeys] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false)
  const [selectedEntity, setSelectedEntity] = useState<EntityObject | null>(
    null
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setIsLoading(true)
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
        | {[key: string]: unknown} // Fallback for other entity types

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
        if (columnConfig?.selectedColumns) {
          // Use the custom column configuration if provided
          setColumnKeys(columnConfig.selectedColumns)
        } else {
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
      }
      // @ts-ignore
      setData(entityData || ([] as unknown))
    } catch (err) {
      console.error(`Error processing ${entity} data:`, err)
      setError(
        err instanceof Error ? err.message : 'An error occurred processing data'
      )
    } finally {
      setIsLoading(false)
    }
  }, [entity, initialData, columnConfig])

  // Helper function to get entity ID
  const getEntityId = (entityObject: EntityObject) => {
    return entityObject?.Id || ''
  }

  // Navigate to entity detail page - wrapped in useCallback
  const navigateToEntityDetail = useCallback(
    (entityObject: EntityObject) => {
      const id = getEntityId(entityObject)
      if (!id) return

      const entityPath = entity.endsWith('s') ? entity : `${entity}s` // Handle pluralization

      router.push(`/dashboard/${entityPath}/${id}`)
    },
    [entity, router]
  )

  // Open quick view modal - wrapped in useCallback
  const openQuickView = useCallback((entityObject: EntityObject) => {
    setSelectedEntity(entityObject)
    setIsQuickViewOpen(true)
  }, [])

  // Handler for create purchase order - wrapped in useCallback
  const handleCreatePurchaseOrder = useCallback(
    (entityObject: EntityObject) => {
      if (onCreatePurchaseOrder && entity === 'estimates') {
        onCreatePurchaseOrder(entityObject as Estimate)
      }
    },
    [entity, onCreatePurchaseOrder]
  )

  // Handler for create invoice - wrapped in useCallback
  const handleCreateInvoice = useCallback(
    (entityObject: EntityObject) => {
      if (onCreateInvoice && entity === 'estimates') {
        onCreateInvoice(entityObject as Estimate)
      }
    },
    [entity, onCreateInvoice]
  )

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

    const dataColumns = columnKeys.map((key) => ({
      id: key,
      accessorKey: key,
      enablePinning: true,
      // Pin the DisplayName, Name or Id column to the left
      ...(key === pinnedColumnKey ? {pin: 'left'} : {}),
      header: ({column}) => {
        // Use custom column label if provided
        const displayName = columnConfig?.columnLabels?.[key] || key

        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className={cn(
              'pl-0 font-medium',
              column.getIsPinned() && 'bg-muted/50'
            )}
          >
            {displayName}
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        )
      },
      cell: ({row}) => {
        // Handle nested properties like CustomerRef.name
        if (key.includes('.')) {
          const [parent, child] = key.split('.')
          const parentObj = row.original[parent] as
            | Record<string, any>
            | undefined
          const value = parentObj && parentObj[child]
          return (
            <div className='truncate max-w-[200px]'>
              {value?.toString() || '—'}
            </div>
          )
        }

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

    // Add action columns
    const actionColumns: ColumnDef<EntityObject>[] = [
      {
        id: 'quickView',
        enableSorting: false,
        enablePinning: true,
        pin: 'right',
        header: () => <div className='text-center'>Quick View</div>,
        cell: ({row}) => (
          <div className='text-center'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => openQuickView(row.original)}
              className='px-2'
            >
              <Eye className='h-4 w-4' />
            </Button>
          </div>
        ),
      },
      {
        id: 'view',
        enableSorting: false,
        enablePinning: true,
        pin: 'right',
        header: () => <div className='text-center'>View</div>,
        cell: ({row}) => (
          <div className='text-center'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigateToEntityDetail(row.original)}
              className='px-2'
            >
              <ExternalLink className='h-4 w-4' />
            </Button>
          </div>
        ),
      },
    ]

    // Add dropdown actions column for estimates only
    if (entity === 'estimates' && (onCreatePurchaseOrder || onCreateInvoice)) {
      actionColumns.unshift({
        id: 'actions',
        enableSorting: false,
        enablePinning: true,
        pin: 'right',
        header: () => <div className='text-center'>Actions</div>,
        cell: ({row}) => (
          <div className='text-center'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='px-2'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {onCreatePurchaseOrder && (
                  <DropdownMenuItem
                    onClick={() => handleCreatePurchaseOrder(row.original)}
                  >
                    Create Purchase Order
                  </DropdownMenuItem>
                )}
                {onCreateInvoice && (
                  <DropdownMenuItem
                    onClick={() => handleCreateInvoice(row.original)}
                  >
                    Create Invoice
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      })
    }

    return [...dataColumns, ...actionColumns]
  }, [
    columnKeys,
    columnConfig,
    entity,
    navigateToEntityDetail,
    openQuickView,
    onCreatePurchaseOrder,
    onCreateInvoice,
    handleCreatePurchaseOrder,
    handleCreateInvoice,
  ])

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

  // Common loading UI that matches the Suspense fallback
  const LoadingUI = () => (
    <div className='flex justify-center items-center min-h-[400px]'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary' />
    </div>
  )

  if (error) {
    return (
      <div className='p-4 bg-red-50 border border-red-200 rounded-md text-red-700'>
        <h2 className='text-lg font-semibold'>Error</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingUI />
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

      {/* Quick View Modal */}
      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className='max-w-3xl max-h-[80vh] overflow-y-auto bg-black'>
          <DialogHeader>
            <DialogTitle>
              {entity.slice(0, -1).charAt(0).toUpperCase() +
                entity.slice(0, -1).slice(1)}{' '}
              Details
            </DialogTitle>
            <DialogDescription>
              Showing details for{' '}
              {selectedEntity?.Name ||
                selectedEntity?.DisplayName ||
                `${entity.slice(0, -1)} #${selectedEntity?.Id}`}
            </DialogDescription>
          </DialogHeader>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            {selectedEntity &&
              Object.entries(selectedEntity).map(([key, value]) => {
                // Skip rendering complex objects and arrays
                if (
                  value === null ||
                  typeof value === 'object' ||
                  Array.isArray(value)
                ) {
                  return null
                }

                return (
                  <div key={key} className='border-b pb-2'>
                    <div className='font-medium text-sm text-gray-500'>
                      {key}
                    </div>
                    <div>{value.toString()}</div>
                  </div>
                )
              })}
          </div>
          <div className='flex justify-end mt-4'>
            <Button
              onClick={() =>
                selectedEntity && navigateToEntityDetail(selectedEntity)
              }
              className='mr-2'
            >
              View Full Details
            </Button>
            <Button variant='outline' onClick={() => setIsQuickViewOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

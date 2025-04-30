import {fetchEntityById} from '@/services/intuit/_common/helpers'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {Skeleton} from '@/components/ui/skeleton'
import {Suspense} from 'react'
import {notFound} from 'next/navigation'
import type {
  Customer,
  Vendor,
  Invoice,
  PurchaseOrder,
  Account,
  EntityType,
} from '@/services/intuit/types'
import {ErrorMessageWithoutRetry} from '@/components/ui/error-message'

// Loading state component
function EntityDetailLoading() {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-10 w-3/4' />
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-1/3' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-3/4' />
        </CardContent>
      </Card>
    </div>
  )
}

// Generic field display component
function EntityField({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) {
  if (value === undefined || value === null) return null

  return (
    <div className='py-2'>
      <div className='text-sm font-medium text-gray-500'>{label}</div>
      <div className='mt-1'>{value}</div>
    </div>
  )
}

// Entity-specific detail components
function CustomerDetail({data}: {data: Customer}) {
  return (
    <>
      <EntityField label='Company Name' value={data.CompanyName} />
      <EntityField label='Display Name' value={data.DisplayName} />
      <EntityField label='Email' value={data.PrimaryEmailAddr?.Address} />
      <EntityField label='Phone' value={data.PrimaryPhone?.FreeFormNumber} />
      <EntityField label='Balance' value={data.Balance} />
      {data.BillAddr && (
        <div className='py-2'>
          <div className='text-sm font-medium text-gray-500'>
            Billing Address
          </div>
          <div className='mt-1'>
            {data.BillAddr.Line1 && <div>{data.BillAddr.Line1}</div>}
            {data.BillAddr.Line2 && <div>{data.BillAddr.Line2}</div>}
            {data.BillAddr.City && <span>{data.BillAddr.City}, </span>}
            {data.BillAddr.CountrySubDivisionCode && (
              <span>{data.BillAddr.CountrySubDivisionCode} </span>
            )}
            {data.BillAddr.PostalCode && (
              <span>{data.BillAddr.PostalCode}</span>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function VendorDetail({data}: {data: Vendor}) {
  return (
    <>
      <EntityField label='Company Name' value={data.CompanyName} />
      <EntityField label='Display Name' value={data.DisplayName} />
      <EntityField label='Email' value={data.PrimaryEmailAddr?.Address} />
      <EntityField label='Phone' value={data.PrimaryPhone?.FreeFormNumber} />
      <EntityField label='Balance' value={data.Balance} />
      <EntityField label='Tax Identifier' value={data.TaxIdentifier} />
      {data.BillAddr && (
        <div className='py-2'>
          <div className='text-sm font-medium text-gray-500'>Address</div>
          <div className='mt-1'>
            {data.BillAddr.Line1 && <div>{data.BillAddr.Line1}</div>}
            {data.BillAddr.Line2 && <div>{data.BillAddr.Line2}</div>}
            {data.BillAddr.City && <span>{data.BillAddr.City}, </span>}
            {data.BillAddr.CountrySubDivisionCode && (
              <span>{data.BillAddr.CountrySubDivisionCode} </span>
            )}
            {data.BillAddr.PostalCode && (
              <span>{data.BillAddr.PostalCode}</span>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function InvoiceDetail({data}: {data: Invoice}) {
  return (
    <>
      <EntityField label='Invoice Number' value={data.DocNumber} />
      <EntityField label='Customer' value={data.CustomerRef?.name} />
      <EntityField label='Total Amount' value={data.TotalAmt} />
      <EntityField label='Balance' value={data.Balance} />
      <EntityField label='Due Date' value={data.DueDate} />
      <EntityField label='Transaction Date' value={data.TxnDate} />

      {data.Line && data.Line.length > 0 && (
        <div className='py-2'>
          <div className='text-sm font-medium text-gray-500 mb-2'>
            Line Items
          </div>
          <div className='mt-1 border rounded-md overflow-hidden'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Description
                  </th>
                  <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Qty
                  </th>
                  <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Price
                  </th>
                  <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {data.Line.map((line, index) => (
                  <tr key={line.Id || index}>
                    <td className='px-4 py-2 text-sm text-gray-900'>
                      {line.Description || 'N/A'}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-900 text-right'>
                      {line.SalesItemLineDetail?.Qty || 'N/A'}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-900 text-right'>
                      {line.SalesItemLineDetail?.UnitPrice || 'N/A'}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-900 text-right'>
                      {line.Amount || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}

function PurchaseOrderDetail({data}: {data: PurchaseOrder}) {
  return (
    <>
      <EntityField label='PO Number' value={data.DocNumber} />
      <EntityField label='Vendor' value={data.VendorRef?.name} />
      <EntityField label='Total Amount' value={data.TotalAmt} />

      {data.Line && data.Line.length > 0 && (
        <div className='py-2'>
          <div className='text-sm font-medium text-gray-500 mb-2'>
            Line Items
          </div>
          <div className='mt-1 border rounded-md overflow-hidden'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Description
                  </th>
                  <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Qty
                  </th>
                  <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Price
                  </th>
                  <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {data.Line.map((line, index) => (
                  <tr key={line.Id || index}>
                    <td className='px-4 py-2 text-sm text-gray-900'>
                      {line.Description || 'N/A'}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-900 text-right'>
                      {line.ItemBasedExpenseLineDetail?.Qty || 'N/A'}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-900 text-right'>
                      {line.ItemBasedExpenseLineDetail?.UnitPrice || 'N/A'}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-900 text-right'>
                      {line.Amount || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}

function AccountDetail({data}: {data: Account}) {
  return (
    <>
      <EntityField label='Name' value={data.Name} />
      <EntityField label='Account Type' value={data.AccountType} />
      <EntityField label='Account Sub-Type' value={data.AccountSubType} />
      <EntityField label='Current Balance' value={data.CurrentBalance} />
      <EntityField label='Description' value={data.Description} />
      <EntityField label='Active' value={data.Active ? 'Yes' : 'No'} />
    </>
  )
}

// Default entity detail component for entities without specific components
function GenericEntityDetail({
  data,
  entity,
}: {
  data: Record<string, unknown>
  entity: string
}) {
  return (
    <div className='space-y-4'>
      {Object.entries(data).map(([key, value]) => {
        // Skip rendering complex nested objects or arrays
        if (typeof value === 'object' && value !== null) return null

        return (
          <EntityField key={key} label={key} value={value as string | number} />
        )
      })}
    </div>
  )
}

// Main entity detail component with conditional rendering
function EntityDetailContent({
  entity,
  data,
}: {
  entity: string
  data: Record<string, unknown>
}) {
  // Function to get the entity title
  const getEntityTitle = () => {
    if (!data) return `${entity} Details`

    // Try to find a name field based on common patterns
    const nameField =
      data.DisplayName || data.Name || data.DocNumber || data.Id || 'Details'
    return `${
      entity.charAt(0).toUpperCase() + entity.slice(1).replace(/-/g, ' ')
    } - ${nameField}`
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>{getEntityTitle()}</CardTitle>
        <CardDescription>ID: {data?.Id || 'N/A'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='divide-y'>
          {/* Render appropriate detail component based on entity type */}
          {entity === 'customers' && <CustomerDetail data={data as Customer} />}
          {entity === 'vendors' && <VendorDetail data={data as Vendor} />}
          {entity === 'invoices' && <InvoiceDetail data={data as Invoice} />}
          {entity === 'purchase-orders' && (
            <PurchaseOrderDetail data={data as PurchaseOrder} />
          )}
          {entity === 'accounts' && <AccountDetail data={data as Account} />}

          {/* For entities without specific components, use generic renderer */}
          {entity !== 'customers' &&
            entity !== 'vendors' &&
            entity !== 'invoices' &&
            entity !== 'purchase-orders' &&
            entity !== 'accounts' && (
              <GenericEntityDetail
                data={data as Record<string, unknown>}
                entity={entity}
              />
            )}
        </div>
      </CardContent>
    </Card>
  )
}

// Error component for showing API errors
function EntityDetailError({error, entity}: {error: Error; entity: string}) {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>
          Error Loading{' '}
          {entity.charAt(0).toUpperCase() + entity.slice(1).replace(/-/g, ' ')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorMessageWithoutRetry
          title={`Failed to load ${entity.replace(/-/g, ' ')} details`}
          message={error.message}
        />
      </CardContent>
    </Card>
  )
}

// Async wrapper for data fetching
async function EntityDetailWithData({
  entity,
  id,
}: {
  entity: string
  id: string
}) {
  try {
    const entityData = await fetchEntityById(entity, id)

    if (!entityData) {
      return notFound()
    }

    return <EntityDetailContent entity={entity} data={entityData} />
  } catch (error) {
    console.error(`Error fetching ${entity} detail:`, error)
    return <EntityDetailError error={error as Error} entity={entity} />
  }
}

// Main page component
export default async function EntityDetailPage({
  params,
}: {
  params: {entity: string; id: string}
}) {
  const {entity, id} = params

  return (
    <div className='container mx-auto py-6 space-y-6'>
      <h1 className='text-2xl font-bold'>
        {entity.charAt(0).toUpperCase() + entity.slice(1).replace(/-/g, ' ')}{' '}
        Details
      </h1>

      <Suspense fallback={<EntityDetailLoading />}>
        <EntityDetailWithData entity={entity} id={id} />
      </Suspense>
    </div>
  )
}

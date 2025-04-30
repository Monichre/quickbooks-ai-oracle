'use client'

import {useState, useEffect} from 'react'
import {
  useForm,
  Controller,
  useWatch,
  type UseFormGetValues,
  type UseFormSetValue,
} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {useRouter} from 'next/navigation'
import type {Customer} from '@/services/intuit/types'
import type {
  Estimate,
  EstimateLine,
} from '@/services/intuit/estimate/estimate.types'
import {
  LineItemsEditor,
  cleanEstimateLineItems,
} from '@/components/estimates/LineItemsEditor'
import {CreateCustomerDialog} from './CreateCustomerDialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

import {Button} from '@/components/ui/button'
import {createEstimate} from '@/services/intuit/estimate/estimate.api'
import {toast} from 'sonner'

const salesItemLineDetailSchema = z.object({
  DetailType: z.literal('SalesItemLineDetail'),
  Amount: z.number().min(0, 'Amount must be a positive number'),
  SalesItemLineDetail: z.object({
    ItemRef: z.object({
      value: z.string(), // Allow any string for now, we'll validate before submission
      name: z.string().optional(),
    }),
    TaxCodeRef: z
      .object({value: z.string().optional(), name: z.string().optional()})
      .optional(),
    UnitPrice: z.number().min(0, 'Unit price must be a positive number'),
    Qty: z.number().min(1, 'Quantity must be at least 1'),
    ServiceDate: z.string().optional(),
  }),
  Description: z.string().optional(),
  id: z.string().optional(),
})

const groupLineDetailSchema = z.object({
  DetailType: z.literal('GroupLineDetail'),
  Amount: z.number().min(0, 'Amount must be a positive number'),
  GroupLineDetail: z.record(z.unknown()).optional(),
  Description: z.string().optional(),
  id: z.string().optional(),
})

const lineSchema = z.discriminatedUnion('DetailType', [
  salesItemLineDetailSchema,
  groupLineDetailSchema,
])

export type EstimateFormData = {
  CustomerRef: {value: string; name?: string}
  Line: z.infer<typeof lineSchema>[]
  DocNumber?: string
  TxnDate?: string
  PrivateNote?: string
  Id?: string
  SyncToken?: string
  BillAddr?: {
    Line1?: string
    Line2?: string
    Line3?: string
    City?: string
    CountrySubDivisionCode?: string
    PostalCode?: string
    Country?: string
  }
  ShipAddr?: {
    Line1?: string
    Line2?: string
    Line3?: string
    City?: string
    CountrySubDivisionCode?: string
    PostalCode?: string
    Country?: string
  }
  BillEmail?: {Address?: string}
  CurrencyRef?: {value: string; name?: string}
  DueDate?: string
  ExpirationDate?: string
  TxnStatus?: 'Pending' | 'Accepted' | 'Closed' | 'Rejected'
  PrintStatus?: 'NotSet' | 'NeedToPrint' | 'PrintComplete'
  EmailStatus?: 'NotSet' | 'NeedToSend' | 'EmailSent'
}

const estimateSchema = z
  .object({
    CustomerRef: z.object({
      value: z.string().min(1, 'Customer is required'),
      name: z.string().optional(),
    }),
    Line: z.array(lineSchema).min(1, 'At least one line item is required'),
    DocNumber: z.string().optional(),
    TxnDate: z.string().optional(),
    PrivateNote: z.string().optional(),
    Id: z.string().optional(),
    SyncToken: z.string().optional(),
    BillAddr: z
      .object({
        Line1: z.string().optional(),
        Line2: z.string().optional(),
        Line3: z.string().optional(),
        City: z.string().optional(),
        CountrySubDivisionCode: z.string().optional(),
        PostalCode: z.string().optional(),
        Country: z.string().optional(),
      })
      .optional(),
    ShipAddr: z
      .object({
        Line1: z.string().optional(),
        Line2: z.string().optional(),
        Line3: z.string().optional(),
        City: z.string().optional(),
        CountrySubDivisionCode: z.string().optional(),
        PostalCode: z.string().optional(),
        Country: z.string().optional(),
      })
      .optional(),
    BillEmail: z
      .object({Address: z.string().email('Invalid email').optional()})
      .optional(),
    CurrencyRef: z
      .object({value: z.string(), name: z.string().optional()})
      .optional(),
    DueDate: z.string().optional(),
    ExpirationDate: z.string().optional(),
    TxnStatus: z.enum(['Pending', 'Accepted', 'Closed', 'Rejected']).optional(),
    PrintStatus: z.enum(['NotSet', 'NeedToPrint', 'PrintComplete']).optional(),
    EmailStatus: z.enum(['NotSet', 'NeedToSend', 'EmailSent']).optional(),
  })
  .refine((data) => data.CustomerRef.value, {message: 'Customer is required'})

type EstimateFormProps = {
  customers: Customer[]
  initialData?: Estimate
}

export function EstimateForm({
  customers: initialCustomers,
  initialData,
}: EstimateFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [isAddressUpdateDialogOpen, setAddressUpdateDialogOpen] =
    useState(false)
  const [shipSameAsBill, setShipSameAsBill] = useState(false)
  const [previousCustomerId, setPreviousCustomerId] = useState<string | null>(
    initialData?.CustomerRef?.value || null
  )
  const [pendingCustomerId, setPendingCustomerId] = useState<string | null>(
    null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    formState: {errors},
    setError: setFormError,
    getValues,
    setValue,
    reset,
    watch,
  } = useForm<EstimateFormData>({
    resolver: zodResolver(estimateSchema),
    defaultValues: initialData
      ? transformEstimateToFormData(initialData)
      : {
          CustomerRef: {value: ''},
          Line: [
            {
              DetailType: 'SalesItemLineDetail',
              Amount: 0,
              SalesItemLineDetail: {
                ItemRef: {value: '', name: ''},
                UnitPrice: 0,
                Qty: 1,
              },
              Description: '',
            },
          ],
          DocNumber: '',
          TxnDate: new Date().toISOString().split('T')[0],
          PrivateNote: '',
          BillAddr: {
            Line1: '',
            Line2: '',
            Line3: '',
            City: '',
            CountrySubDivisionCode: '',
            PostalCode: '',
            Country: '',
          },
          ShipAddr: {
            Line1: '',
            Line2: '',
            Line3: '',
            City: '',
            CountrySubDivisionCode: '',
            PostalCode: '',
            Country: '',
          },
          BillEmail: {Address: ''},
          CurrencyRef: undefined,
          DueDate: '',
          ExpirationDate: '',
          PrintStatus: 'NeedToPrint',
          EmailStatus: 'NotSet',
        },
    mode: 'onSubmit',
  })

  function transformEstimateToFormData(estimate: Estimate): EstimateFormData {
    return {
      Id: estimate.Id,
      SyncToken: estimate.SyncToken,
      CustomerRef: estimate.CustomerRef,
      TxnDate: estimate.TxnDate,
      Line: estimate.Line,
      CurrencyRef: estimate.CurrencyRef,
      ShipAddr: estimate.ShipAddr,
      BillAddr: estimate.BillAddr,
      DueDate: estimate.DueDate,
      ExpirationDate: estimate.ExpirationDate,
      PrintStatus: estimate.PrintStatus,
      EmailStatus: estimate.EmailStatus,
      BillEmail: estimate.BillEmail,
      DocNumber: estimate.DocNumber,
      PrivateNote: estimate.PrivateNote,
      TxnStatus: estimate.TxnStatus,
    }
  }

  function transformFormDataToEstimate(data: EstimateFormData): Estimate {
    console.log('🚀 ~ transformFormDataToEstimate ~ data:', data)

    // Create a deep copy to avoid mutating the original data
    const processedData = JSON.parse(JSON.stringify(data))

    // Process line items to ensure valid ItemRef.value
    if (processedData.Line) {
      processedData.Line.forEach((line: any) => {
        if (
          line.DetailType === 'SalesItemLineDetail' &&
          (!line.SalesItemLineDetail.ItemRef.value ||
            line.SalesItemLineDetail.ItemRef.value === 'manual-entry')
        ) {
          // For manual entries or empty values, use a placeholder ID or generate one
          // You may need to adjust this based on your QuickBooks requirements
          const timestamp = Date.now().toString()
          line.SalesItemLineDetail.ItemRef.value = `0` // Using "0" as a placeholder
        }
      })
    }

    const estimateData: Estimate = {
      CustomerRef: processedData.CustomerRef,
      Line: processedData.Line as EstimateLine[],
    }

    // Only add non-empty optional fields
    if (processedData.DocNumber)
      estimateData.DocNumber = processedData.DocNumber
    if (processedData.TxnDate) estimateData.TxnDate = processedData.TxnDate
    if (processedData.PrivateNote)
      estimateData.PrivateNote = processedData.PrivateNote
    if (processedData.Id) estimateData.Id = processedData.Id
    if (processedData.SyncToken)
      estimateData.SyncToken = processedData.SyncToken

    if (
      processedData.BillAddr &&
      Object.values(processedData.BillAddr).some((v) => v)
    ) {
      estimateData.BillAddr = processedData.BillAddr
    }

    if (
      processedData.ShipAddr &&
      Object.values(processedData.ShipAddr).some((v) => v)
    ) {
      estimateData.ShipAddr = processedData.ShipAddr
    }

    if (processedData.BillEmail?.Address) {
      estimateData.BillEmail = processedData.BillEmail
    }

    if (processedData.CurrencyRef?.value) {
      estimateData.CurrencyRef = processedData.CurrencyRef
    }

    if (processedData.DueDate) estimateData.DueDate = processedData.DueDate
    if (processedData.ExpirationDate)
      estimateData.ExpirationDate = processedData.ExpirationDate
    if (processedData.TxnStatus)
      estimateData.TxnStatus = processedData.TxnStatus
    if (processedData.PrintStatus)
      estimateData.PrintStatus = processedData.PrintStatus
    if (processedData.EmailStatus)
      estimateData.EmailStatus = processedData.EmailStatus

    return estimateData
  }

  function handleCustomerCreated(newCustomer: Customer) {
    setCustomers((prev) => [...prev, newCustomer])
    setValue('CustomerRef.value', newCustomer.Id)
    setPreviousCustomerId(newCustomer.Id)
    setDialogOpen(false)
  }

  function handleCustomerSelectChange(
    e: React.ChangeEvent<HTMLSelectElement>,
    field: {onChange: (value: string) => void}
  ) {
    const newCustomerId = e.target.value
    if (newCustomerId === '__add_new__') {
      setDialogOpen(true)
      return
    }
    if (newCustomerId && newCustomerId !== previousCustomerId) {
      setPendingCustomerId(newCustomerId)
      setAddressUpdateDialogOpen(true)
    } else {
      field.onChange(newCustomerId)
      setPreviousCustomerId(newCustomerId)
    }
  }

  function handleUpdateAddresses() {
    if (!pendingCustomerId) return
    const customer = customers.find((c) => c.Id === pendingCustomerId)
    if (customer) {
      if (customer.BillAddr) setValue('BillAddr', customer.BillAddr)
      if (customer.ShipAddr) setValue('ShipAddr', customer.ShipAddr)
      if (customer.PrimaryEmailAddr?.Address)
        setValue('BillEmail', {Address: customer.PrimaryEmailAddr.Address})
    }
    setValue('CustomerRef.value', pendingCustomerId)
    setPreviousCustomerId(pendingCustomerId)
    setPendingCustomerId(null)
    setAddressUpdateDialogOpen(false)
  }
  function handleKeepAddresses() {
    if (!pendingCustomerId) return
    setValue('CustomerRef.value', pendingCustomerId)
    setPreviousCustomerId(pendingCustomerId)
    setPendingCustomerId(null)
    setAddressUpdateDialogOpen(false)
  }
  function handleCancelDialog() {
    setValue('CustomerRef.value', previousCustomerId || '')
    setPendingCustomerId(null)
    setAddressUpdateDialogOpen(false)
  }

  function handleCopyBillingToShipping() {
    setShipSameAsBill(!shipSameAsBill)
  }

  // Update shipping address whenever billing address changes and shipSameAsBill is true
  useEffect(() => {
    if (shipSameAsBill) {
      // Copy current billing address to shipping address
      const billAddr = getValues('BillAddr') || {}
      setValue('ShipAddr.Line1', billAddr.Line1 || '')
      setValue('ShipAddr.Line2', billAddr.Line2 || '')
      setValue('ShipAddr.Line3', billAddr.Line3 || '')
      setValue('ShipAddr.City', billAddr.City || '')
      setValue(
        'ShipAddr.CountrySubDivisionCode',
        billAddr.CountrySubDivisionCode || ''
      )
      setValue('ShipAddr.PostalCode', billAddr.PostalCode || '')
      setValue('ShipAddr.Country', billAddr.Country || '')

      // Setup watcher for future changes
      const subscription = watch((value, {name}) => {
        if (name && name.startsWith('BillAddr.')) {
          const shipFieldName = name.replace('BillAddr.', 'ShipAddr.')
          setValue(shipFieldName, value[name])
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [shipSameAsBill, watch, setValue, getValues])

  const onSubmit = async (formData: EstimateFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const estimateData = transformFormDataToEstimate(formData)
      console.log('🚀 ~ onSubmit ~ estimateData:', estimateData)

      // Clean up any custom line items before submitting to QuickBooks
      if (estimateData.Line) {
        estimateData.Line = cleanEstimateLineItems(estimateData.Line)
      }

      const response = await createEstimate(estimateData)
      console.log('🚀 ~ API response:', response)

      if (response?.Id) {
        // Show success toast notification
        toast.success('Estimate created successfully!')
        // Redirect to detail page
        router.push(`/dashboard/estimates/${response.Id}`)
        return {success: true, data: response}
      }

      setError('Failed to create estimate - invalid response from API')
      return {success: false, error: 'Invalid API response'}
    } catch (error) {
      console.error('Failed to create estimate:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred'
      setError(`Failed to create estimate: ${errorMessage}`)
      return {success: false, error: errorMessage}
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {error && (
        <div className='bg-red-100 p-4 rounded text-red-700 mb-4'>{error}</div>
      )}

      {isAddressUpdateDialogOpen && (
        <Dialog
          open={isAddressUpdateDialogOpen}
          onOpenChange={setAddressUpdateDialogOpen}
        >
          <DialogHeader>
            <DialogTitle>Update Addresses?</DialogTitle>
            <DialogDescription>
              Do you want to update the billing and shipping address to match
              the selected customer?
            </DialogDescription>
          </DialogHeader>
          <div className='flex gap-2 mt-4'>
            <button
              type='button'
              className='px-4 py-2 bg-blue-600 text-white rounded'
              onClick={handleUpdateAddresses}
            >
              Update addresses
            </button>
            <button
              type='button'
              className='px-4 py-2 bg-gray-200 rounded'
              onClick={handleKeepAddresses}
            >
              Keep current addresses
            </button>
            <button
              type='button'
              className='px-4 py-2 bg-red-200 rounded'
              onClick={handleCancelDialog}
            >
              Cancel
            </button>
          </div>
        </Dialog>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label
            htmlFor='customer-select'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Customer *
          </label>
          <Controller
            control={control}
            name='CustomerRef.value'
            render={({field}) => (
              <div>
                <select
                  id='customer-select'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  value={field.value}
                  onChange={(e) => handleCustomerSelectChange(e, field)}
                >
                  <option value=''>Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.Id} value={customer.Id}>
                      {customer.DisplayName}
                    </option>
                  ))}
                  <option value='__add_new__'>Add new customer...</option>
                </select>
                {errors?.CustomerRef?.value && (
                  <div className='text-red-600 text-sm mt-1'>
                    {errors.CustomerRef.value.message as string}
                  </div>
                )}
                <CreateCustomerDialog
                  open={isDialogOpen}
                  onOpenChange={setDialogOpen}
                  onCustomerCreated={handleCustomerCreated}
                />
              </div>
            )}
          />
        </div>

        <div>
          <label
            htmlFor='doc-number'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Doc Number
          </label>
          <input
            id='doc-number'
            type='text'
            className='w-full px-3 py-2 border border-gray-300 rounded-md'
            {...register('DocNumber')}
          />
          {errors?.DocNumber && (
            <div className='text-red-600 text-sm mt-1'>
              {errors.DocNumber.message as string}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor='txn-date'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Date
          </label>
          <input
            id='txn-date'
            type='date'
            className='w-full px-3 py-2 border border-gray-300 rounded-md'
            {...register('TxnDate')}
          />
          {errors?.TxnDate && (
            <div className='text-red-600 text-sm mt-1'>
              {errors.TxnDate.message as string}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-2'>Line Items</h2>
        <LineItemsEditor
          control={control}
          getValues={getValues as unknown as UseFormGetValues<EstimateFormData>}
          setValue={setValue as unknown as UseFormSetValue<EstimateFormData>}
          errors={errors}
          name='Line'
        />
      </div>

      <div>
        <label
          htmlFor='private-note'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Private Note
        </label>
        <Controller
          control={control}
          name='PrivateNote'
          render={({field}) => (
            <div>
              <textarea
                id='private-note'
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                rows={3}
                {...field}
              />
              {errors?.PrivateNote && (
                <div className='text-red-600 text-sm mt-1'>
                  {errors.PrivateNote.message as string}
                </div>
              )}
            </div>
          )}
        />
      </div>

      {/* Address, Email, Currency, Dates */}
      <details className='mb-4'>
        <summary className='cursor-pointer font-semibold'>
          Billing & Shipping Address (optional)
        </summary>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-2'>
          <div>
            <label
              htmlFor='bill-addr-line1'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Bill Address
            </label>
            <input
              id='bill-addr-line1'
              className='w-full px-3 py-2 border border-gray-300 rounded-md mb-1'
              placeholder='Line 1'
              {...register('BillAddr.Line1')}
            />
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md mb-1'
              placeholder='Line 2'
              {...register('BillAddr.Line2')}
            />
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md mb-1'
              placeholder='Line 3'
              {...register('BillAddr.Line3')}
            />
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md mb-1'
              placeholder='City'
              {...register('BillAddr.City')}
            />
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md mb-1'
              placeholder='State/Province'
              {...register('BillAddr.CountrySubDivisionCode')}
            />
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md mb-1'
              placeholder='Postal Code'
              {...register('BillAddr.PostalCode')}
            />
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
              placeholder='Country'
              {...register('BillAddr.Country')}
            />
          </div>
          <div>
            <div className='flex justify-between items-center mb-1'>
              <label
                htmlFor='ship-addr-line1'
                className='block text-sm font-medium text-gray-700'
              >
                Ship Address
              </label>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='ship-same-as-bill'
                  checked={shipSameAsBill}
                  onChange={handleCopyBillingToShipping}
                  className='mr-2 h-4 w-4'
                />
                <label
                  htmlFor='ship-same-as-bill'
                  className='text-sm text-gray-600'
                >
                  Same as billing
                </label>
              </div>
            </div>
            <input
              id='ship-addr-line1'
              className='w-full px-3 py-2 border border-gray-300 rounded-md mb-1'
              placeholder='Line 1'
              {...register('ShipAddr.Line1')}
              disabled={shipSameAsBill}
            />
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md mb-1'
              placeholder='Line 2'
              {...register('ShipAddr.Line2')}
              disabled={shipSameAsBill}
            />
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md mb-1'
              placeholder='Line 3'
              {...register('ShipAddr.Line3')}
              disabled={shipSameAsBill}
            />
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md mb-1'
              placeholder='City'
              {...register('ShipAddr.City')}
              disabled={shipSameAsBill}
            />
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md mb-1'
              placeholder='State/Province'
              {...register('ShipAddr.CountrySubDivisionCode')}
              disabled={shipSameAsBill}
            />
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md mb-1'
              placeholder='Postal Code'
              {...register('ShipAddr.PostalCode')}
              disabled={shipSameAsBill}
            />
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
              placeholder='Country'
              {...register('ShipAddr.Country')}
              disabled={shipSameAsBill}
            />
          </div>
        </div>
      </details>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Bill Email */}
        <div>
          <label
            htmlFor='bill-email'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Bill Email
          </label>
          <input
            id='bill-email'
            type='email'
            className='w-full px-3 py-2 border border-gray-300 rounded-md'
            {...register('BillEmail.Address')}
          />
          {errors?.BillEmail?.Address && (
            <div className='text-red-600 text-sm mt-1'>
              {errors.BillEmail.Address.message as string}
            </div>
          )}
        </div>
        {/* CurrencyRef */}
        <div>
          <label
            htmlFor='currency-ref'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Currency
          </label>
          <Controller
            control={control}
            name='CurrencyRef.value'
            render={({field}) => (
              <select
                id='currency-ref'
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                {...field}
              >
                <option value=''>Select currency</option>
                {/* TODO: Replace with real currency options from API/config */}
                <option value='USD'>USD - US Dollar</option>
                <option value='EUR'>EUR - Euro</option>
                <option value='GBP'>GBP - British Pound</option>
              </select>
            )}
          />
        </div>
        {/* DueDate */}
        <div>
          <label
            htmlFor='due-date'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Due Date
          </label>
          <input
            id='due-date'
            type='date'
            className='w-full px-3 py-2 border border-gray-300 rounded-md'
            {...register('DueDate')}
          />
        </div>
        {/* ExpirationDate */}
        <div>
          <label
            htmlFor='expiration-date'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Expiration Date
          </label>
          <input
            id='expiration-date'
            type='date'
            className='w-full px-3 py-2 border border-gray-300 rounded-md'
            {...register('ExpirationDate')}
          />
        </div>
        {/* TxnStatus */}
        <div>
          <label
            htmlFor='txn-status'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Transaction Status
          </label>
          <select
            id='txn-status'
            className='w-full px-3 py-2 border border-gray-300 rounded-md'
            {...register('TxnStatus')}
          >
            <option value=''>Select status</option>
            <option value='Pending'>Pending</option>
            <option value='Accepted'>Accepted</option>
            <option value='Closed'>Closed</option>
            <option value='Rejected'>Rejected</option>
          </select>
        </div>
        {/* PrintStatus */}
        <div>
          <label
            htmlFor='print-status'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Print Status
          </label>
          <select
            id='print-status'
            className='w-full px-3 py-2 border border-gray-300 rounded-md'
            {...register('PrintStatus')}
          >
            <option value='NotSet'>Not Set</option>
            <option value='NeedToPrint'>Need To Print</option>
            <option value='PrintComplete'>Print Complete</option>
          </select>
        </div>
      </div>

      <div className='flex justify-end'>
        <Button
          type='submit'
          size='lg'
          disabled={isSubmitting}
          className='w-full md:w-auto'
        >
          {isSubmitting ? 'Saving...' : 'Save Estimate'}
        </Button>
      </div>
    </form>
  )
}

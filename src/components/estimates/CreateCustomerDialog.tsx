import {useState} from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogOverlay,
} from '@/components/ui/dialog' // adjust import path as needed
import {useForm, Controller} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {createCustomerAction} from '@/actions/customerActions' // adjust path as needed
import type {Customer} from '@/services/intuit/types/response-types'

const noColonsTabsNewlines = (val: string | undefined) =>
  !val || (!val.includes(':') && !val.includes('\t') && !val.includes('\n'))

const billAddrSchema = z.object({
  Line1: z.string().optional(),
  City: z.string().optional(),
  CountrySubDivisionCode: z.string().optional(),
  PostalCode: z.string().optional(),
  Country: z.string().optional(),
})

const customerSchema = z
  .object({
    DisplayName: z
      .string()
      .min(1, 'Name is required')
      .refine(noColonsTabsNewlines, {
        message: 'No colons, tabs, or newlines allowed',
      }),
    GivenName: z.string().optional().refine(noColonsTabsNewlines, {
      message: 'No colons, tabs, or newlines allowed',
    }),
    FamilyName: z.string().optional().refine(noColonsTabsNewlines, {
      message: 'No colons, tabs, or newlines allowed',
    }),
    CompanyName: z.string().optional().refine(noColonsTabsNewlines, {
      message: 'No colons, tabs, or newlines allowed',
    }),
    Email: z.string().email('Invalid email').optional().or(z.literal('')),
    Phone: z.string().optional(),
    BillAddr: billAddrSchema.optional(),
  })
  .refine(
    (data) => {
      const addr = data.BillAddr || {}
      const anyFilled = Object.values(addr).some(Boolean)
      return !anyFilled || !!addr.Line1
    },
    {
      message: 'Line1 is required if any billing address field is filled',
      path: ['BillAddr', 'Line1'],
    }
  )

type CustomerFormValues = z.infer<typeof customerSchema>

type CreateCustomerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCustomerCreated: (customer: Customer) => void
}

export function CreateCustomerDialog({
  open,
  onOpenChange,
  onCustomerCreated,
}: CreateCustomerDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      DisplayName: '',
      GivenName: '',
      FamilyName: '',
      CompanyName: '',
      Email: '',
      Phone: '',
      BillAddr: {
        Line1: '',
        City: '',
        CountrySubDivisionCode: '',
        PostalCode: '',
        Country: '',
      },
    },
  })

  const onSubmit = async (values: CustomerFormValues) => {
    setError(null)
    setIsLoading(true)
    try {
      const {
        DisplayName,
        GivenName,
        FamilyName,
        CompanyName,
        Email,
        Phone,
        BillAddr,
      } = values
      const anyBillAddrFieldPresent =
        BillAddr && Object.values(BillAddr).some(Boolean)
      const payload: Partial<Customer> = {
        DisplayName,
        GivenName: GivenName || undefined,
        FamilyName: FamilyName || undefined,
        CompanyName: CompanyName || undefined,
        PrimaryEmailAddr: Email ? {Address: Email} : undefined,
        PrimaryPhone: Phone ? {FreeFormNumber: Phone} : undefined,
        BillAddr: anyBillAddrFieldPresent
          ? {
              Line1: BillAddr?.Line1,
              City: BillAddr?.City,
              CountrySubDivisionCode: BillAddr?.CountrySubDivisionCode,
              PostalCode: BillAddr?.PostalCode,
              Country: BillAddr?.Country,
            }
          : undefined,
      }
      const result = await createCustomerAction(payload)
      if (result.success) {
        onCustomerCreated(result.data.Customer)
        reset()
      } else {
        setError(result.error || 'Failed to create customer')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent className='bg-black text-white'>
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {error && <div className='text-red-600 text-sm mb-2'>{error}</div>}
          <div>
            <label
              htmlFor='customer-displayname'
              className='block text-sm font-medium mb-1'
            >
              Name *
            </label>
            <Controller
              name='DisplayName'
              control={control}
              render={({field}) => (
                <input
                  id='customer-displayname'
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  {...field}
                  disabled={isLoading}
                />
              )}
            />
            {errors.DisplayName && (
              <div className='text-red-600 text-sm mt-1'>
                {errors.DisplayName.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor='customer-givenname'
              className='block text-sm font-medium mb-1'
            >
              Given Name
            </label>
            <Controller
              name='GivenName'
              control={control}
              render={({field}) => (
                <input
                  id='customer-givenname'
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  {...field}
                  disabled={isLoading}
                />
              )}
            />
            {errors.GivenName && (
              <div className='text-red-600 text-sm mt-1'>
                {errors.GivenName.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor='customer-familyname'
              className='block text-sm font-medium mb-1'
            >
              Family Name
            </label>
            <Controller
              name='FamilyName'
              control={control}
              render={({field}) => (
                <input
                  id='customer-familyname'
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  {...field}
                  disabled={isLoading}
                />
              )}
            />
            {errors.FamilyName && (
              <div className='text-red-600 text-sm mt-1'>
                {errors.FamilyName.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor='customer-companyname'
              className='block text-sm font-medium mb-1'
            >
              Company Name
            </label>
            <Controller
              name='CompanyName'
              control={control}
              render={({field}) => (
                <input
                  id='customer-companyname'
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  {...field}
                  disabled={isLoading}
                />
              )}
            />
            {errors.CompanyName && (
              <div className='text-red-600 text-sm mt-1'>
                {errors.CompanyName.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor='customer-email'
              className='block text-sm font-medium mb-1'
            >
              Email
            </label>
            <Controller
              name='Email'
              control={control}
              render={({field}) => (
                <input
                  id='customer-email'
                  type='email'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  {...field}
                  disabled={isLoading}
                />
              )}
            />
            {errors.Email && (
              <div className='text-red-600 text-sm mt-1'>
                {errors.Email.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor='customer-phone'
              className='block text-sm font-medium mb-1'
            >
              Phone
            </label>
            <Controller
              name='Phone'
              control={control}
              render={({field}) => (
                <input
                  id='customer-phone'
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  {...field}
                  disabled={isLoading}
                />
              )}
            />
            {errors.Phone && (
              <div className='text-red-600 text-sm mt-1'>
                {errors.Phone.message}
              </div>
            )}
          </div>
          <fieldset className='border border-gray-200 rounded p-3'>
            <legend className='text-sm font-semibold'>Billing Address</legend>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div>
                <label
                  htmlFor='billaddr-line1'
                  className='block text-sm font-medium mb-1'
                >
                  Line 1
                </label>
                <Controller
                  name='BillAddr.Line1'
                  control={control}
                  render={({field}) => (
                    <input
                      id='billaddr-line1'
                      type='text'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md'
                      {...field}
                      disabled={isLoading}
                    />
                  )}
                />
                {errors.BillAddr?.Line1 && (
                  <div className='text-red-600 text-sm mt-1'>
                    {errors.BillAddr.Line1.message}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor='billaddr-city'
                  className='block text-sm font-medium mb-1'
                >
                  City
                </label>
                <Controller
                  name='BillAddr.City'
                  control={control}
                  render={({field}) => (
                    <input
                      id='billaddr-city'
                      type='text'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md'
                      {...field}
                      disabled={isLoading}
                    />
                  )}
                />
                {errors.BillAddr?.City && (
                  <div className='text-red-600 text-sm mt-1'>
                    {errors.BillAddr.City.message}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor='billaddr-country'
                  className='block text-sm font-medium mb-1'
                >
                  Country
                </label>
                <Controller
                  name='BillAddr.Country'
                  control={control}
                  render={({field}) => (
                    <input
                      id='billaddr-country'
                      type='text'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md'
                      {...field}
                      disabled={isLoading}
                    />
                  )}
                />
                {errors.BillAddr?.Country && (
                  <div className='text-red-600 text-sm mt-1'>
                    {errors.BillAddr.Country.message}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor='billaddr-countrycode'
                  className='block text-sm font-medium mb-1'
                >
                  State/Province Code
                </label>
                <Controller
                  name='BillAddr.CountrySubDivisionCode'
                  control={control}
                  render={({field}) => (
                    <input
                      id='billaddr-countrycode'
                      type='text'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md'
                      {...field}
                      disabled={isLoading}
                    />
                  )}
                />
                {errors.BillAddr?.CountrySubDivisionCode && (
                  <div className='text-red-600 text-sm mt-1'>
                    {errors.BillAddr.CountrySubDivisionCode.message}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor='billaddr-postalcode'
                  className='block text-sm font-medium mb-1'
                >
                  Postal Code
                </label>
                <Controller
                  name='BillAddr.PostalCode'
                  control={control}
                  render={({field}) => (
                    <input
                      id='billaddr-postalcode'
                      type='text'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md'
                      {...field}
                      disabled={isLoading}
                    />
                  )}
                />
                {errors.BillAddr?.PostalCode && (
                  <div className='text-red-600 text-sm mt-1'>
                    {errors.BillAddr.PostalCode.message}
                  </div>
                )}
              </div>
            </div>
          </fieldset>
          <DialogFooter className='flex justify-end gap-2 mt-4'>
            <DialogClose asChild>
              <button
                type='button'
                className='px-4 py-2 rounded bg-gray-200 hover:bg-gray-300'
                disabled={isLoading}
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type='submit'
              className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Customer'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

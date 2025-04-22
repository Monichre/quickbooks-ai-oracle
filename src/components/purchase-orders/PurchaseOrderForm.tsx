'use client'

import {useState} from 'react'
import {useForm, Controller} from '@tanstack/react-form'
import {zodValidator} from '@tanstack/zod-form-adapter'
import {z} from 'zod'
import {useRouter} from 'next/navigation'
import type {Purchase, Vendor} from '@/services/intuit/types'
import {POLineItemsEditor} from '@/components/purchase-orders/POLineItemsEditor'
import {createPurchaseOrderAction} from '@/actions/purchaseOrderActions'

const purchaseOrderSchema = z.object({
  VendorRef: z.object({
    value: z.string().min(1, 'Vendor is required'),
  }),
  Line: z
    .array(
      z.object({
        DetailType: z.literal('ItemBasedExpenseLineDetail'),
        Amount: z.number().min(0),
        ItemBasedExpenseLineDetail: z.object({
          ItemRef: z.object({
            value: z.string().min(1, 'Item is required'),
            name: z.string().optional(),
          }),
          UnitPrice: z.number().min(0),
          Qty: z.number().min(1),
        }),
      })
    )
    .min(1, 'At least one line item is required'),
  DocNumber: z.string().optional(),
  PaymentType: z.enum(['Cash', 'Check', 'CreditCard']),
  PrivateNote: z.string().optional(),
  Id: z.string().optional(),
  SyncToken: z.string().optional(),
})

type PurchaseOrderFormProps = {
  vendors: Vendor[]
  initialData?: Purchase
}

export function PurchaseOrderForm({
  vendors,
  initialData,
}: PurchaseOrderFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: initialData || {
      VendorRef: {value: ''},
      Line: [
        {
          DetailType: 'ItemBasedExpenseLineDetail' as const,
          Amount: 0,
          ItemBasedExpenseLineDetail: {
            ItemRef: {value: '', name: ''},
            UnitPrice: 0,
            Qty: 1,
          },
        },
      ],
      DocNumber: '',
      PaymentType: 'Check' as const,
      PrivateNote: '',
    },
    onSubmit: async ({value}) => {
      setIsSubmitting(true)
      setError(null)

      try {
        const result = await createPurchaseOrderAction(value as Purchase)
        if (result.success) {
          router.push(`/dashboard/purchase-orders/${result.data.Purchase.Id}`)
        } else {
          setError(result.error)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An error occurred')
      } finally {
        setIsSubmitting(false)
      }
    },
    validators: {
      onSubmit: zodValidator(purchaseOrderSchema),
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className='space-y-6'
    >
      {error && (
        <div className='bg-red-100 p-4 rounded text-red-700 mb-4'>{error}</div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Vendor *
          </label>
          <Controller
            control={form.control}
            name='VendorRef.value'
            render={({field, state}) => (
              <div>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value=''>Select a vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.Id} value={vendor.Id}>
                      {vendor.DisplayName}
                    </option>
                  ))}
                </select>
                {state.error && (
                  <div className='text-red-600 text-sm mt-1'>
                    {state.error.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Doc Number
          </label>
          <Controller
            control={form.control}
            name='DocNumber'
            render={({field, state}) => (
              <div>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  {...field}
                />
                {state.error && (
                  <div className='text-red-600 text-sm mt-1'>
                    {state.error.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Payment Type
          </label>
          <Controller
            control={form.control}
            name='PaymentType'
            render={({field, state}) => (
              <div>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value as 'Cash' | 'Check' | 'CreditCard'
                    )
                  }
                >
                  <option value='Cash'>Cash</option>
                  <option value='Check'>Check</option>
                  <option value='CreditCard'>Credit Card</option>
                </select>
                {state.error && (
                  <div className='text-red-600 text-sm mt-1'>
                    {state.error.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-2'>Line Items</h2>
        <POLineItemsEditor form={form} name='Line' />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Private Note
        </label>
        <Controller
          control={form.control}
          name='PrivateNote'
          render={({field, state}) => (
            <div>
              <textarea
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                rows={3}
                {...field}
              />
              {state.error && (
                <div className='text-red-600 text-sm mt-1'>
                  {state.error.message}
                </div>
              )}
            </div>
          )}
        />
      </div>

      <div className='flex justify-end'>
        <button
          type='submit'
          disabled={isSubmitting}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed'
        >
          {isSubmitting
            ? 'Saving...'
            : initialData
            ? 'Update Purchase Order'
            : 'Create Purchase Order'}
        </button>
      </div>
    </form>
  )
}

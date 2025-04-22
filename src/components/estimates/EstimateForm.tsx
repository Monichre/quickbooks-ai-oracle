'use client'

import {useState} from 'react'
import {useForm, Controller} from '@tanstack/react-form'
import {zodValidator} from '@tanstack/zod-form-adapter'
import {z} from 'zod'
import {useRouter} from 'next/navigation'
import type {Customer, Estimate} from '@/services/intuit/types'
import {LineItemsEditor} from '@/components/estimates/LineItemsEditor'
import {createEstimateAction} from '@/actions/estimateActions'

const estimateSchema = z.object({
  CustomerRef: z.object({
    value: z.string().min(1, 'Customer is required'),
  }),
  Line: z
    .array(
      z.object({
        DetailType: z.literal('SalesItemLineDetail'),
        Amount: z.number().min(0),
        SalesItemLineDetail: z.object({
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
  TxnDate: z.string().optional(),
  PrivateNote: z.string().optional(),
  Id: z.string().optional(),
  SyncToken: z.string().optional(),
})

type EstimateFormProps = {
  customers: Customer[]
  initialData?: Estimate
}

export function EstimateForm({customers, initialData}: EstimateFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: initialData || {
      CustomerRef: {value: ''},
      Line: [
        {
          DetailType: 'SalesItemLineDetail' as const,
          Amount: 0,
          SalesItemLineDetail: {
            ItemRef: {value: '', name: ''},
            UnitPrice: 0,
            Qty: 1,
          },
        },
      ],
      DocNumber: '',
      TxnDate: new Date().toISOString().split('T')[0],
      PrivateNote: '',
    },
    onSubmit: async ({value}) => {
      setIsSubmitting(true)
      setError(null)

      try {
        const result = await createEstimateAction(value as Estimate)
        if (result.success) {
          router.push(`/dashboard/estimates/${result.data.Estimate.Id}`)
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
      onSubmit: zodValidator(estimateSchema),
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
            Customer *
          </label>
          <Controller
            control={form.control}
            name='CustomerRef.value'
            render={({field, state}) => (
              <div>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value=''>Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.Id} value={customer.Id}>
                      {customer.DisplayName}
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
            Date
          </label>
          <Controller
            control={form.control}
            name='TxnDate'
            render={({field, state}) => (
              <div>
                <input
                  type='date'
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
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-2'>Line Items</h2>
        <LineItemsEditor form={form} name='Line' />
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
            ? 'Update Estimate'
            : 'Create Estimate'}
        </button>
      </div>
    </form>
  )
}

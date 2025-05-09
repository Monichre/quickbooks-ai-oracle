'use client'

import {useState, useEffect} from 'react'
import {useForm, Controller, useFieldArray, useWatch} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useRouter} from 'next/navigation'
import type {Purchase, Vendor} from '@/services/intuit/types'
import {createPurchaseOrderAction} from '@/app/actions/purchaseOrderActions'
import {POLineItemsEditor} from './POLineItemsEditor'
import {purchaseOrderSchema, type PurchaseOrderFormData} from './types'

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

  const defaultValues: PurchaseOrderFormData = initialData
    ? {
        VendorRef: initialData.VendorRef || {value: ''},
        Line:
          initialData.Line?.map((line) => ({
            DetailType: 'ItemBasedExpenseLineDetail' as const,
            Amount: line.Amount || 0,
            ItemBasedExpenseLineDetail: {
              ItemRef: line.ItemBasedExpenseLineDetail?.ItemRef || {
                value: '',
                name: '',
              },
              UnitPrice: line.ItemBasedExpenseLineDetail?.UnitPrice || 0,
              Qty: line.ItemBasedExpenseLineDetail?.Qty || 1,
            },
          })) || [],
        DocNumber: initialData.DocNumber || '',
        PaymentType:
          (initialData.PaymentType as 'Cash' | 'Check' | 'CreditCard') ||
          'Check',
        PrivateNote: initialData.PrivateNote || '',
        Id: initialData.Id,
        SyncToken: initialData.SyncToken,
      }
    : {
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
      }

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<PurchaseOrderFormData>({
    defaultValues,
    resolver: zodResolver(purchaseOrderSchema),
  })

  const onSubmit = async (data: PurchaseOrderFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createPurchaseOrderAction(data as Purchase)
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
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {error && (
        <div className='bg-red-100 p-4 rounded text-red-700 mb-4'>{error}</div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label
            htmlFor='vendorRef'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Vendor *
          </label>
          <Controller
            control={control}
            name='VendorRef.value'
            render={({field}) => (
              <div>
                <select
                  id='vendorRef'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  value={field.value}
                  onChange={field.onChange}
                  ref={field.ref}
                  onBlur={field.onBlur}
                >
                  <option value=''>Select a vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.Id} value={vendor.Id}>
                      {vendor.DisplayName}
                    </option>
                  ))}
                </select>
                {errors.VendorRef?.value && (
                  <div className='text-red-600 text-sm mt-1'>
                    {errors.VendorRef.value.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <label
            htmlFor='docNumber'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Doc Number
          </label>
          <Controller
            control={control}
            name='DocNumber'
            render={({field}) => (
              <div>
                <input
                  id='docNumber'
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  {...field}
                />
                {errors.DocNumber && (
                  <div className='text-red-600 text-sm mt-1'>
                    {errors.DocNumber.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <label
            htmlFor='paymentType'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Payment Type
          </label>
          <Controller
            control={control}
            name='PaymentType'
            render={({field}) => (
              <div>
                <select
                  id='paymentType'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value as 'Cash' | 'Check' | 'CreditCard'
                    )
                  }
                  ref={field.ref}
                  onBlur={field.onBlur}
                >
                  <option value='Cash'>Cash</option>
                  <option value='Check'>Check</option>
                  <option value='CreditCard'>Credit Card</option>
                </select>
                {errors.PaymentType && (
                  <div className='text-red-600 text-sm mt-1'>
                    {errors.PaymentType.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-2'>Line Items</h2>
        <POLineItemsEditor control={control} name='Line' />
      </div>

      <div>
        <label
          htmlFor='privateNote'
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
                id='privateNote'
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                rows={3}
                {...field}
              />
              {errors.PrivateNote && (
                <div className='text-red-600 text-sm mt-1'>
                  {errors.PrivateNote.message}
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

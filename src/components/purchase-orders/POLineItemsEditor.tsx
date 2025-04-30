'use client'

import {useEffect} from 'react'
import {
  type Control,
  useFieldArray,
  Controller,
  useWatch,
} from 'react-hook-form'
import type {PurchaseOrderFormData} from './types'

type POLineItemsEditorProps = {
  control: Control<PurchaseOrderFormData>
  name: string
}

export function POLineItemsEditor({control, name}: POLineItemsEditorProps) {
  const {fields, append, remove, update} = useFieldArray({
    control,
    name,
  })

  // Watch for changes in UnitPrice and Qty to update Amount
  const lineItems = useWatch({
    control,
    name,
  })

  useEffect(() => {
    if (lineItems) {
      lineItems.forEach((item, index) => {
        const qty = item.ItemBasedExpenseLineDetail.Qty
        const unitPrice = item.ItemBasedExpenseLineDetail.UnitPrice
        const amount = qty * unitPrice

        if (item.Amount !== amount) {
          update(index, {
            ...item,
            Amount: amount,
          })
        }
      })
    }
  }, [lineItems, update])

  const addLineItem = () => {
    append({
      DetailType: 'ItemBasedExpenseLineDetail' as const,
      Amount: 0,
      ItemBasedExpenseLineDetail: {
        ItemRef: {value: '', name: ''},
        UnitPrice: 0,
        Qty: 1,
      },
    })
  }

  return (
    <div className='space-y-4'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Item
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Qty
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Unit Price
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Amount
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td className='px-6 py-4'>
                  <Controller
                    control={control}
                    name={`${name}.${index}.ItemBasedExpenseLineDetail.ItemRef.value`}
                    render={({field}) => (
                      <input
                        type='text'
                        className='w-full px-2 py-1 border border-gray-300 rounded-md'
                        {...field}
                        placeholder='Item code or name'
                      />
                    )}
                  />
                </td>
                <td className='px-6 py-4'>
                  <Controller
                    control={control}
                    name={`${name}.${index}.ItemBasedExpenseLineDetail.Qty`}
                    render={({field}) => (
                      <input
                        type='number'
                        className='w-full px-2 py-1 border border-gray-300 rounded-md'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        min='1'
                      />
                    )}
                  />
                </td>
                <td className='px-6 py-4'>
                  <Controller
                    control={control}
                    name={`${name}.${index}.ItemBasedExpenseLineDetail.UnitPrice`}
                    render={({field}) => (
                      <input
                        type='number'
                        className='w-full px-2 py-1 border border-gray-300 rounded-md'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        min='0'
                        step='0.01'
                      />
                    )}
                  />
                </td>
                <td className='px-6 py-4'>
                  <Controller
                    control={control}
                    name={`${name}.${index}.Amount`}
                    render={({field}) => <div>${field.value.toFixed(2)}</div>}
                  />
                </td>
                <td className='px-6 py-4'>
                  <button
                    type='button'
                    onClick={() => fields.length > 1 && remove(index)}
                    className='text-red-600 hover:text-red-800'
                    disabled={fields.length <= 1}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <button
          type='button'
          onClick={addLineItem}
          className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
        >
          + Add Line Item
        </button>
      </div>
    </div>
  )
}

'use client'

import {useFieldset} from '@tanstack/react-form'
import {useState} from 'react'

export function LineItemsEditor({form, name}: {form: any; name: string}) {
  const {fieldset, update} = useFieldset(form, name)
  const [items, setItems] = useState(fieldset.value)

  const addLineItem = () => {
    const newItems = [
      ...items,
      {
        DetailType: 'SalesItemLineDetail',
        Amount: 0,
        SalesItemLineDetail: {
          ItemRef: {value: '', name: ''},
          UnitPrice: 0,
          Qty: 1,
        },
      },
    ]
    setItems(newItems)
    update(newItems)
  }

  const removeLineItem = (index: number) => {
    if (items.length <= 1) return
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
    update(newItems)
  }

  const updateLineItem = (index: number, field: string, value: any) => {
    const newItems = [...items]

    if (field === 'UnitPrice' || field === 'Qty') {
      newItems[index].SalesItemLineDetail[field] = Number(value)
      // Recalculate Amount based on UnitPrice and Qty
      const {UnitPrice, Qty} = newItems[index].SalesItemLineDetail
      newItems[index].Amount = UnitPrice * Qty
    } else if (field === 'ItemRef') {
      newItems[index].SalesItemLineDetail.ItemRef.value = value
    }

    setItems(newItems)
    update(newItems)
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
            {items.map((item, index) => (
              <tr key={index}>
                <td className='px-6 py-4'>
                  <input
                    type='text'
                    className='w-full px-2 py-1 border border-gray-300 rounded-md'
                    value={item.SalesItemLineDetail.ItemRef.value}
                    onChange={(e) =>
                      updateLineItem(index, 'ItemRef', e.target.value)
                    }
                    placeholder='Item code or name'
                  />
                </td>
                <td className='px-6 py-4'>
                  <input
                    type='number'
                    className='w-full px-2 py-1 border border-gray-300 rounded-md'
                    value={item.SalesItemLineDetail.Qty}
                    onChange={(e) =>
                      updateLineItem(index, 'Qty', e.target.value)
                    }
                    min='1'
                  />
                </td>
                <td className='px-6 py-4'>
                  <input
                    type='number'
                    className='w-full px-2 py-1 border border-gray-300 rounded-md'
                    value={item.SalesItemLineDetail.UnitPrice}
                    onChange={(e) =>
                      updateLineItem(index, 'UnitPrice', e.target.value)
                    }
                    min='0'
                    step='0.01'
                  />
                </td>
                <td className='px-6 py-4'>${item.Amount.toFixed(2)}</td>
                <td className='px-6 py-4'>
                  <button
                    type='button'
                    onClick={() => removeLineItem(index)}
                    className='text-red-600 hover:text-red-800'
                    disabled={items.length <= 1}
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

      {fieldset.state.error && (
        <div className='text-red-600 text-sm mt-1'>
          {fieldset.state.error.message}
        </div>
      )}
    </div>
  )
}

'use client'

import React, {useEffect, useState, useCallback} from 'react'
import {
  useFieldArray,
  Controller,
  type Control,
  type FieldErrors,
  type UseFormGetValues,
  type UseFormSetValue,
} from 'react-hook-form'
import type {
  Estimate,
  EstimateLine,
} from '@/services/intuit/estimate/estimate.types'
import type {EstimateFormData} from '@/components/estimates/EstimateForm'
import type {Item} from '@/services/intuit/item/item.types'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {getItemsByType} from '@/services/intuit/item/item.api'

// Special flag to identify custom items - this should be removed before QuickBooks submission
export const CUSTOM_ITEM_FLAG = 'custom-item-flag'

interface LineItemsEditorProps {
  control: Control<EstimateFormData>
  errors: FieldErrors<EstimateFormData>
  name: string
  getValues: UseFormGetValues<EstimateFormData>
  setValue: UseFormSetValue<EstimateFormData>
}

export function LineItemsEditor({
  control,
  errors,
  name,
  getValues,
  setValue,
}: LineItemsEditorProps) {
  const {fields, append, remove, update} = useFieldArray({control, name})
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customItemIndices, setCustomItemIndices] = useState<number[]>([])
  // Use an array to track each line item's selected type
  const [lineItemTypes, setLineItemTypes] = useState<
    ('Service' | 'Inventory')[]
  >([])

  // Fetch items from QuickBooks API
  useEffect(() => {
    async function fetchItems() {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch both Service and Inventory items
        const serviceResponse = await getItemsByType('Service')
        const inventoryResponse = await getItemsByType('Inventory')

        console.log('🚀 ~ fetchItems ~ serviceResponse:', serviceResponse)
        console.log('🚀 ~ fetchItems ~ inventoryResponse:', inventoryResponse)

        // Extract items from both responses and combine them
        const serviceItems = serviceResponse.QueryResponse?.Item || []
        const inventoryItems = inventoryResponse.QueryResponse?.Item || []

        // Combine both arrays
        const combinedItems = [...serviceItems, ...inventoryItems]

        setItems(combinedItems)
      } catch (err) {
        console.error('Error fetching items:', err)
        setError('Failed to load inventory items. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  // Initialize arrays when fields change
  useEffect(() => {
    if (fields.length !== customItemIndices.length) {
      // Check if we need to add or remove entries from the customItemIndices array
      if (fields.length > customItemIndices.length) {
        // Add new entries initialized to -1 (not custom)
        setCustomItemIndices((prev) => [
          ...prev,
          ...Array(fields.length - prev.length).fill(-1),
        ])
      } else {
        // Remove entries that no longer exist
        setCustomItemIndices((prev) => prev.slice(0, fields.length))
      }
    }

    // Initialize line item types array
    if (fields.length !== lineItemTypes.length) {
      if (fields.length > lineItemTypes.length) {
        // Add new entries with default type "Service"
        setLineItemTypes((prev) => [
          ...prev,
          ...Array(fields.length - prev.length).fill('Service'),
        ])
      } else {
        // Remove entries that no longer exist
        setLineItemTypes((prev) => prev.slice(0, fields.length))
      }
    }
  }, [fields, fields.length, customItemIndices.length, lineItemTypes.length])

  // Expose method to check which line items are custom
  // This can be called by parent component before submission to QuickBooks
  const getCustomItemIndices = useCallback(() => {
    return customItemIndices
      .map((value, index) => (value === index ? index : -1))
      .filter((index) => index !== -1)
  }, [customItemIndices])

  // Helper to reset a line item when type changes
  const getDefaultLine = (type: EstimateLine['DetailType']): EstimateLine => {
    switch (type) {
      case 'SalesItemLineDetail':
        return {
          DetailType: 'SalesItemLineDetail',
          Amount: 0,
          SalesItemLineDetail: {
            ItemRef: {value: '', name: ''},
            UnitPrice: 0,
            Qty: 1,
          },
          Description: '',
        }

      case 'GroupLineDetail':
        return {
          DetailType: 'GroupLineDetail',
          Amount: 0,
          Description: '',
        } as EstimateLine
      default:
        return {
          DetailType: 'SalesItemLineDetail',
          Amount: 0,
          SalesItemLineDetail: {
            ItemRef: {value: '', name: ''},
            UnitPrice: 0,
            Qty: 1,
          },
          Description: '',
        }
    }
  }

  const handleTypeChange = (
    idx: number,
    newType: EstimateLine['DetailType']
  ) => {
    // Reset custom item flag when type changes
    setCustomItemIndices((prev) => {
      const newIndices = [...prev]
      newIndices[idx] = -1
      return newIndices
    })

    update(idx, getDefaultLine(newType))
  }

  const addLineItem = () => {
    append(getDefaultLine('SalesItemLineDetail'))
  }

  const removeLineItem = (idx: number) => {
    if (fields.length <= 1) return
    remove(idx)

    // Update custom item indices array
    setCustomItemIndices((prev) => {
      const newIndices = [...prev]
      newIndices.splice(idx, 1)
      return newIndices
    })

    // Update line item types array
    setLineItemTypes((prev) => {
      const newTypes = [...prev]
      newTypes.splice(idx, 1)
      return newTypes
    })
  }

  // Format amount as currency
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Update amount when quantity or unit price changes for SalesItemLineDetail
  const updateSalesItemAmount = (idx: number) => {
    const type = getValues(`${name}.${idx}.DetailType` as any)
    if (type !== 'SalesItemLineDetail') return

    const unitPrice =
      Number(
        getValues(`${name}.${idx}.SalesItemLineDetail.UnitPrice` as any)
      ) || 0
    const qty =
      Number(getValues(`${name}.${idx}.SalesItemLineDetail.Qty` as any)) || 0
    const amount = unitPrice * qty

    setValue(`${name}.${idx}.Amount` as any, amount)
  }

  // Handle selection of an item from the dropdown
  const handleItemSelect = (idx: number, itemId: string) => {
    // Special case for "custom-item" which indicates user wants to add a custom item
    if (itemId === 'custom-item') {
      // Set this index as a custom item
      setCustomItemIndices((prev) => {
        const newIndices = [...prev]
        newIndices[idx] = idx
        return newIndices
      })

      // Set a special flag value for custom items
      // This will be detected and handled by the form submission process
      setValue(
        `${name}.${idx}.SalesItemLineDetail.ItemRef.value` as any,
        CUSTOM_ITEM_FLAG
      )
      setValue(`${name}.${idx}.SalesItemLineDetail.ItemRef.name` as any, '')
      setValue(`${name}.${idx}.Description` as any, '')
      setValue(`${name}.${idx}.SalesItemLineDetail.UnitPrice` as any, 0)
      return
    }

    // Regular item selection
    const selectedItem = items.find((item) => item.Id === itemId)

    // Reset custom item flag
    setCustomItemIndices((prev) => {
      const newIndices = [...prev]
      newIndices[idx] = -1
      return newIndices
    })

    if (selectedItem) {
      // Update the line item with selected item details
      setValue(
        `${name}.${idx}.SalesItemLineDetail.ItemRef.value` as any,
        selectedItem.Id
      )
      setValue(
        `${name}.${idx}.SalesItemLineDetail.ItemRef.name` as any,
        selectedItem.Name
      )
      setValue(
        `${name}.${idx}.Description` as any,
        selectedItem.Description || selectedItem.Name
      )
      setValue(
        `${name}.${idx}.SalesItemLineDetail.UnitPrice` as any,
        selectedItem.UnitPrice || 0
      )

      // Update amount based on quantity and unit price
      setTimeout(() => updateSalesItemAmount(idx), 0)
    }
  }

  // Handle changing the item type for a specific line item
  const handleItemTypeChange = (idx: number, type: 'Service' | 'Inventory') => {
    setLineItemTypes((prev) => {
      const newTypes = [...prev]
      newTypes[idx] = type
      return newTypes
    })

    // Clear the selected item when changing item type
    setValue(`${name}.${idx}.SalesItemLineDetail.ItemRef.value` as any, '')
    setValue(`${name}.${idx}.SalesItemLineDetail.ItemRef.name` as any, '')
  }

  return (
    <div className='space-y-6'>
      {error && (
        <div className='bg-red-100 p-4 rounded text-red-700 mb-4'>{error}</div>
      )}

      {isLoading && (
        <div className='text-center py-4'>Loading inventory items...</div>
      )}

      {fields.map((field, idx) => (
        <div
          key={field.id}
          className='border rounded-md p-4 mb-2 bg-black text-white shadow-sm relative'
        >
          <div className='flex w-full gap-4 mb-2 justify-evenly'>
            {/* DetailType selection (Sales Item / Group) */}
            {(() => {
              const typeId = `${name}-${idx}-type`
              return (
                <div className='w-auto flex flex-col'>
                  <Label className='mb-2 block text-sm' htmlFor={typeId}>
                    Type
                  </Label>
                  <Controller
                    control={control}
                    name={`${name}.${idx}.DetailType` as any}
                    render={({field: typeField}) => (
                      <select
                        id={typeId}
                        className='px-2 py-1 border border-gray-300 rounded-md'
                        value={typeField.value}
                        onChange={(e) =>
                          handleTypeChange(
                            idx,
                            e.target.value as EstimateLine['DetailType']
                          )
                        }
                      >
                        <option value='SalesItemLineDetail'>Sales Item</option>
                        <option value='GroupLineDetail'>Group</option>
                      </select>
                    )}
                  />
                </div>
              )
            })()}
            {/* Render fields based on type */}
            {(() => {
              const type = field.DetailType
              switch (type) {
                case 'SalesItemLineDetail':
                  return (
                    <div className='grid grid-cols-1 md:grid-cols-5 gap-3'>
                      {/* Item Type Selector (Service/Product) */}
                      <div className='flex flex-col'>
                        <Label className='mb-2 block'>Item Type</Label>
                        <div className='flex'>
                          <button
                            type='button'
                            className={`px-2 py-1 text-xs rounded-l ${
                              lineItemTypes[idx] === 'Service'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                            onClick={() => handleItemTypeChange(idx, 'Service')}
                          >
                            Services
                          </button>
                          <button
                            type='button'
                            className={`px-2 py-1 text-xs rounded-r ${
                              lineItemTypes[idx] === 'Inventory'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                            onClick={() =>
                              handleItemTypeChange(idx, 'Inventory')
                            }
                          >
                            Products
                          </button>
                        </div>
                      </div>

                      {/* Item Selection */}
                      {(() => {
                        const itemId = `${name}-${idx}-item`
                        const isCustomItem = customItemIndices[idx] === idx

                        // Filter items by the selected type for this line item
                        const filteredItems = items.filter((item) =>
                          lineItemTypes[idx] === 'Service'
                            ? item.Type === 'Service'
                            : item.Type === 'Inventory' ||
                              item.Type === 'NonInventory'
                        )

                        return (
                          <div className='flex flex-col'>
                            <Label className='mb-2 block' htmlFor={itemId}>
                              Item
                            </Label>

                            {isCustomItem ? (
                              // Show text inputs for custom item
                              <div className='space-y-2'>
                                <Controller
                                  control={control}
                                  name={
                                    `${name}.${idx}.SalesItemLineDetail.ItemRef.name` as any
                                  }
                                  render={({field}) => (
                                    <Input
                                      id={itemId}
                                      placeholder='Custom Item Name'
                                      className='w-full px-2 py-1 border border-gray-300 rounded-md'
                                      value={field.value || ''}
                                      onChange={field.onChange}
                                    />
                                  )}
                                />
                                <Controller
                                  control={control}
                                  name={`${name}.${idx}.Description` as any}
                                  render={({field}) => (
                                    <Input
                                      placeholder='Item Description'
                                      className='w-full px-2 py-1 border border-gray-300 rounded-md'
                                      value={field.value || ''}
                                      onChange={field.onChange}
                                    />
                                  )}
                                />
                              </div>
                            ) : (
                              // Show dropdown for regular item selection
                              <Controller
                                control={control}
                                name={
                                  `${name}.${idx}.SalesItemLineDetail.ItemRef.value` as any
                                }
                                render={({field}) => (
                                  <select
                                    id={itemId}
                                    className='w-full px-2 py-1 border border-gray-300 rounded-md'
                                    value={field.value ?? ''}
                                    onChange={(e) => {
                                      field.onChange(e.target.value)
                                      handleItemSelect(idx, e.target.value)
                                    }}
                                  >
                                    <option value=''>Select an item</option>
                                    <option value='custom-item'>
                                      + Add custom item
                                    </option>
                                    {filteredItems.map((item) => (
                                      <option key={item.Id} value={item.Id}>
                                        {item.Name}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              />
                            )}

                            {isCustomItem && (
                              <div className='mt-1 text-amber-400 text-xs'>
                                Custom item (will be recognized but not saved in
                                QuickBooks)
                              </div>
                            )}
                          </div>
                        )
                      })()}

                      {/* Quantity */}
                      {(() => {
                        const qtyId = `${name}-${idx}-qty`
                        return (
                          <div className='flex flex-col'>
                            <Label className='mb-2 block ' htmlFor={qtyId}>
                              Qty
                            </Label>
                            <Controller
                              control={control}
                              name={
                                `${name}.${idx}.SalesItemLineDetail.Qty` as any
                              }
                              render={({field}) => (
                                <Input
                                  id={qtyId}
                                  type='number'
                                  className='w-full px-2 py-1 border border-gray-300 rounded-md'
                                  value={field.value ?? 1}
                                  onChange={(e) => {
                                    field.onChange(Number(e.target.value))
                                    // Update Amount when Qty changes
                                    setTimeout(
                                      () => updateSalesItemAmount(idx),
                                      0
                                    )
                                  }}
                                  min={1}
                                  placeholder='Qty'
                                />
                              )}
                            />
                          </div>
                        )
                      })()}

                      {/* Unit Price */}
                      {(() => {
                        const unitPriceId = `${name}-${idx}-unitprice`
                        return (
                          <div className='flex flex-col'>
                            <Label
                              className='mb-2 block '
                              htmlFor={unitPriceId}
                            >
                              Unit Price
                            </Label>
                            <Controller
                              control={control}
                              name={
                                `${name}.${idx}.SalesItemLineDetail.UnitPrice` as any
                              }
                              render={({field}) => (
                                <Input
                                  id={unitPriceId}
                                  type='number'
                                  className='w-full px-2 py-1 border border-gray-300 rounded-md'
                                  value={field.value ?? 0}
                                  onChange={(e) => {
                                    field.onChange(Number(e.target.value))
                                    // Update Amount when UnitPrice changes
                                    setTimeout(
                                      () => updateSalesItemAmount(idx),
                                      0
                                    )
                                  }}
                                  min={0}
                                  step={0.01}
                                  placeholder='Unit Price'
                                />
                              )}
                            />
                          </div>
                        )
                      })()}

                      {/* Amount */}
                      {(() => {
                        const amountId = `${name}-${idx}-amount`
                        return (
                          <div className='flex flex-col'>
                            <Label className='mb-2 block ' htmlFor={amountId}>
                              Amount
                            </Label>
                            <Controller
                              control={control}
                              name={`${name}.${idx}.Amount` as any}
                              render={({field}) => (
                                <Input
                                  id={amountId}
                                  type='number'
                                  className='w-full px-2 py-1 border border-gray-300 rounded-md'
                                  value={field.value ?? 0}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  min={0}
                                  step={0.01}
                                  placeholder='Amount'
                                />
                              )}
                            />
                          </div>
                        )
                      })()}
                    </div>
                  )
                case 'SubTotalLineDetail':
                  return (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      {(() => {
                        const descId = `${name}-${idx}-description`
                        return (
                          <div className='flex flex-col'>
                            <Label className='mb-2 block ' htmlFor={descId}>
                              Description
                            </Label>
                            <Controller
                              control={control}
                              name={`${name}.${idx}.Description` as any}
                              render={({field}) => (
                                <Input
                                  id={descId}
                                  type='text'
                                  className='w-full px-2 py-1 border border-gray-300 rounded-md'
                                  value={field.value ?? ''}
                                  onChange={field.onChange}
                                  placeholder='Description'
                                />
                              )}
                            />
                          </div>
                        )
                      })()}
                      {(() => {
                        const amountId = `${name}-${idx}-amount`
                        return (
                          <div className='flex flex-col'>
                            <Label className='mb-2 block ' htmlFor={amountId}>
                              Amount
                            </Label>
                            <Controller
                              control={control}
                              name={`${name}.${idx}.Amount` as any}
                              render={({field}) => (
                                <Input
                                  id={amountId}
                                  type='number'
                                  className='w-full px-2 py-1 border border-gray-300 rounded-md'
                                  value={field.value ?? 0}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  min={0}
                                  step={0.01}
                                  placeholder='Amount'
                                />
                              )}
                            />
                          </div>
                        )
                      })()}
                    </div>
                  )
                case 'DiscountLineDetail':
                  return (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      {(() => {
                        const discountId = `${name}-${idx}-discountpercent`
                        return (
                          <div className='flex flex-col'>
                            <Label className='mb-2 block ' htmlFor={discountId}>
                              Discount %
                            </Label>
                            <Controller
                              control={control}
                              name={
                                `${name}.${idx}.DiscountLineDetail.DiscountPercent` as any
                              }
                              render={({field}) => (
                                <Input
                                  id={discountId}
                                  type='number'
                                  className='w-full px-2 py-1 border border-gray-300 rounded-md'
                                  value={field.value ?? 0}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  min={0}
                                  max={100}
                                  step={0.01}
                                  placeholder='Discount %'
                                />
                              )}
                            />
                          </div>
                        )
                      })()}
                      {(() => {
                        const amountId = `${name}-${idx}-amount`
                        return (
                          <div className='flex flex-col'>
                            <Label className='mb-2 block ' htmlFor={amountId}>
                              Amount
                            </Label>
                            <Controller
                              control={control}
                              name={`${name}.${idx}.Amount` as any}
                              render={({field}) => (
                                <Input
                                  id={amountId}
                                  type='number'
                                  className='w-full px-2 py-1 border border-gray-300 rounded-md'
                                  value={field.value ?? 0}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  min={0}
                                  step={0.01}
                                  placeholder='Amount'
                                />
                              )}
                            />
                          </div>
                        )
                      })()}
                    </div>
                  )
                case 'GroupLineDetail':
                  return (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      {(() => {
                        const descId = `${name}-${idx}-description`
                        return (
                          <div className='flex flex-col'>
                            <Label className='mb-2 block ' htmlFor={descId}>
                              Description
                            </Label>
                            <Controller
                              control={control}
                              name={`${name}.${idx}.Description` as any}
                              render={({field}) => (
                                <Input
                                  id={descId}
                                  type='text'
                                  className='w-full px-2 py-1 border border-gray-300 rounded-md'
                                  value={field.value ?? ''}
                                  onChange={field.onChange}
                                  placeholder='Description'
                                />
                              )}
                            />
                          </div>
                        )
                      })()}
                      {(() => {
                        const amountId = `${name}-${idx}-amount`
                        return (
                          <div className='flex flex-col'>
                            <Label className='mb-2 block ' htmlFor={amountId}>
                              Amount
                            </Label>
                            <Controller
                              control={control}
                              name={`${name}.${idx}.Amount` as any}
                              render={({field}) => (
                                <Input
                                  id={amountId}
                                  type='number'
                                  className='w-full px-2 py-1 border border-gray-300 rounded-md'
                                  value={field.value ?? 0}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  min={0}
                                  step={0.01}
                                  placeholder='Amount'
                                />
                              )}
                            />
                          </div>
                        )
                      })()}
                    </div>
                  )
                default:
                  return null
              }
            })()}
            <button
              type='button'
              className='ml-auto text-red-600 hover:text-red-800 px-2 py-1'
              onClick={() => removeLineItem(idx)}
              disabled={fields.length <= 1}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div>
        <button
          type='button'
          onClick={addLineItem}
          className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
        >
          + Add Line Item
        </button>
      </div>
      {errors?.[name]?.message && (
        <div className='text-red-600 text-sm mt-1'>
          {String(errors[name]?.message)}
        </div>
      )}
    </div>
  )
}

// Export a helper function to clean up the estimate form data
// before submitting to QuickBooks
export function cleanEstimateLineItems(lineItems: any[]) {
  return lineItems.map((item) => {
    // Create a deep copy to avoid modifying the original
    const cleanedItem = JSON.parse(JSON.stringify(item))

    // Check for custom items (has our special flag)
    if (cleanedItem.SalesItemLineDetail?.ItemRef?.value === CUSTOM_ITEM_FLAG) {
      // For custom items, remove the ItemRef property entirely so QuickBooks
      // doesn't try to validate it as a reference
      delete cleanedItem.SalesItemLineDetail.ItemRef
    }

    return cleanedItem
  })
}

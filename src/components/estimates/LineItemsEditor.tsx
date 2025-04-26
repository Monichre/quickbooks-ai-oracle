'use client'

import React, {useEffect, useState} from 'react'
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
import {findItems} from '@/services/intuit/item/item.api'
import {Switch} from '@/components/ui/switch'

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
  const [manualEntryModes, setManualEntryModes] = useState<boolean[]>([])

  // Fetch items from QuickBooks API
  useEffect(() => {
    async function fetchItems() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await findItems()

        console.log('🚀 ~ fetchItems ~ response:', response)

        if (!response.ok) {
          throw new Error('Failed to fetch items')
        }
        // const data = await response.json()
        setItems(response.Items || [])
      } catch (err) {
        console.error('Error fetching items:', err)
        setError('Failed to load inventory items. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  // Initialize manual entry modes array when fields change
  useEffect(() => {
    if (fields.length !== manualEntryModes.length) {
      setManualEntryModes(fields.map(() => false))
    }
  }, [fields.length, manualEntryModes.length])

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
    update(idx, getDefaultLine(newType))
  }

  const addLineItem = () => {
    append(getDefaultLine('SalesItemLineDetail'))
    setManualEntryModes((prev) => [...prev, false])
  }

  const removeLineItem = (idx: number) => {
    if (fields.length <= 1) return
    remove(idx)
    setManualEntryModes((prev) => prev.filter((_, i) => i !== idx))
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
    const type = getValues(`${name}.${idx}.DetailType`)
    if (type !== 'SalesItemLineDetail') return

    const unitPrice =
      Number(getValues(`${name}.${idx}.SalesItemLineDetail.UnitPrice`)) || 0
    const qty = Number(getValues(`${name}.${idx}.SalesItemLineDetail.Qty`)) || 0
    const amount = unitPrice * qty

    setValue(`${name}.${idx}.Amount` as any, amount)
  }

  // Handle selection of an item from the dropdown
  const handleItemSelect = (idx: number, itemId: string) => {
    const selectedItem = items.find((item) => item.Id === itemId)

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

  // Toggle between manual entry and dropdown selection
  const toggleManualEntry = (idx: number) => {
    setManualEntryModes((prev) => {
      const newModes = [...prev]
      newModes[idx] = !newModes[idx]
      return newModes
    })

    // Clear item reference when switching to manual entry
    if (!manualEntryModes[idx]) {
      setValue(
        `${name}.${idx}.SalesItemLineDetail.ItemRef.value` as any,
        'manual-entry'
      )
      setValue(
        `${name}.${idx}.SalesItemLineDetail.ItemRef.name` as any,
        'Manual Entry'
      )
    } else {
      setValue(`${name}.${idx}.SalesItemLineDetail.ItemRef.value` as any, '')
      setValue(`${name}.${idx}.SalesItemLineDetail.ItemRef.name` as any, '')
    }
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
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-3'>
                      {(() => {
                        const itemId = `${name}-${idx}-item`
                        return (
                          <div className='flex flex-col'>
                            <div className='flex justify-between mb-2'>
                              <Label htmlFor={itemId}>Item</Label>
                              <div className='flex items-center space-x-2'>
                                <Label
                                  htmlFor={`manual-entry-${idx}`}
                                  className='text-sm'
                                >
                                  Manual Entry
                                </Label>
                                <Switch
                                  className='bg-white line-item-toggle'
                                  id={`manual-entry-${idx}`}
                                  checked={manualEntryModes[idx] || false}
                                  onCheckedChange={() => toggleManualEntry(idx)}
                                />
                              </div>
                            </div>

                            {manualEntryModes[idx] ? (
                              <div className='space-y-2'>
                                <Controller
                                  control={control}
                                  name={
                                    `${name}.${idx}.SalesItemLineDetail.ItemRef.name` as any
                                  }
                                  render={({field}) => (
                                    <Input
                                      placeholder='Item Name'
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
                                    {items.map((item) => (
                                      <option key={item.Id} value={item.Id}>
                                        {item.Name}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              />
                            )}
                          </div>
                        )
                      })()}
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

import {render, screen, fireEvent} from '@testing-library/react'
import {vi} from 'vitest'
import EntityTable from '../entity-table'
import type {Estimate} from '@/services/intuit/estimate/estimate.types'

// Mock the next/navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('EntityTable Component', () => {
  // Mock estimate data
  const mockEstimate: Estimate = {
    Id: '123',
    SyncToken: '0',
    CustomerRef: {value: 'customer-id', name: 'Test Customer'},
    Line: [],
    DocNumber: 'EST-001',
    TxnDate: '2023-01-01',
    TotalAmt: 1000,
    TxnStatus: 'Pending',
  }

  const mockEstimatesData = {
    QueryResponse: {
      Estimate: [mockEstimate],
    },
  }

  // Column config for estimates
  const columnConfig = {
    selectedColumns: [
      'DocNumber',
      'TxnDate',
      'CustomerRef.name',
      'TotalAmt',
      'TxnStatus',
    ],
    columnLabels: {
      DocNumber: 'Number',
      TxnDate: 'Date',
      'CustomerRef.name': 'Customer',
      TotalAmt: 'Amount',
      TxnStatus: 'Status',
    },
  }

  it('renders estimates table with action dropdown for estimates', () => {
    const onCreatePurchaseOrder = vi.fn()
    const onCreateInvoice = vi.fn()

    render(
      <EntityTable
        entity='estimates'
        initialData={mockEstimatesData}
        columnConfig={columnConfig}
        onCreatePurchaseOrder={onCreatePurchaseOrder}
        onCreateInvoice={onCreateInvoice}
      />
    )

    // Check if the table renders with correct data
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Test Customer')).toBeInTheDocument()
    expect(screen.getByText('EST-001')).toBeInTheDocument()

    // Check if the actions dropdown is present
    const actionButton = screen.getByRole('button', {name: /more horizontal/i})
    expect(actionButton).toBeInTheDocument()

    // Click the dropdown to open it
    fireEvent.click(actionButton)

    // Check if dropdown menu items are present
    expect(screen.getByText('Create Purchase Order')).toBeInTheDocument()
    expect(screen.getByText('Create Invoice')).toBeInTheDocument()

    // Click on the "Create Purchase Order" option and verify the callback is called
    fireEvent.click(screen.getByText('Create Purchase Order'))
    expect(onCreatePurchaseOrder).toHaveBeenCalledWith(mockEstimate)

    // Click to open dropdown again
    fireEvent.click(actionButton)

    // Click on the "Create Invoice" option and verify the callback is called
    fireEvent.click(screen.getByText('Create Invoice'))
    expect(onCreateInvoice).toHaveBeenCalledWith(mockEstimate)
  })

  it('does not render action dropdown for non-estimate entities', () => {
    // Mock purchase order data
    const mockPurchaseOrderData = {
      QueryResponse: {
        PurchaseOrder: [
          {
            Id: '456',
            DocNumber: 'PO-001',
          },
        ],
      },
    }

    render(
      <EntityTable
        entity='purchase-orders'
        initialData={mockPurchaseOrderData}
      />
    )

    // Check if the table renders with correct data
    expect(screen.getByText('PO-001')).toBeInTheDocument()

    // The actions dropdown should not be present for non-estimate entities
    const actionButtons = screen.queryAllByRole('button', {
      name: /more horizontal/i,
    })
    expect(actionButtons.length).toBe(0)
  })
})

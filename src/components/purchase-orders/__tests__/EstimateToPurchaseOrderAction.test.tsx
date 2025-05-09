import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {EstimateToPurchaseOrderAction} from '../../estimates/EstimateToPurchaseOrderAction'
import {getEstimate} from '@/services/intuit/estimate'
import {mapEstimateToPurchaseOrder} from '@/services/intuit/purchase-order/map-estimate-to-purchase-order'
import {Vendor} from '@/services/intuit/types'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('@/services/intuit/estimate', () => ({
  getEstimate: jest.fn(),
}))

jest.mock(
  '@/services/intuit/purchase-order/map-estimate-to-purchase-order',
  () => ({
    mapEstimateToPurchaseOrder: jest.fn(),
  })
)

describe('EstimateToPurchaseOrderAction', () => {
  // Sample test data
  const mockVendors: Vendor[] = [
    {Id: 'vendor1', DisplayName: 'Vendor 1'},
    {Id: 'vendor2', DisplayName: 'Vendor 2'},
  ]

  const mockEstimateId = '123'
  const mockOnSuccess = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders create purchase order button', () => {
    render(
      <EstimateToPurchaseOrderAction
        estimateId={mockEstimateId}
        vendors={mockVendors}
        onSuccess={mockOnSuccess}
      />
    )

    const button = screen.getByRole('button', {name: /create purchase order/i})
    expect(button).toBeInTheDocument()
  })

  test('navigates directly to create page when estimate has one vendor', async () => {
    // Mock single vendor PO
    const mockPurchaseOrder = {
      VendorRef: {value: 'vendor1', name: 'Vendor 1'},
      Line: [{Amount: 100}],
    }

    // Setup mocks
    ;(getEstimate as jest.Mock).mockResolvedValue({Id: mockEstimateId})
    ;(mapEstimateToPurchaseOrder as jest.Mock).mockReturnValue([
      mockPurchaseOrder,
    ])

    // Create a spy for router.push
    const mockPush = jest.fn()
    jest
      .spyOn(require('next/navigation'), 'useRouter')
      .mockImplementation(() => ({
        push: mockPush,
      }))

    // Render component
    render(
      <EstimateToPurchaseOrderAction
        estimateId={mockEstimateId}
        vendors={mockVendors}
        onSuccess={mockOnSuccess}
      />
    )

    // Click button
    const button = screen.getByRole('button', {name: /create purchase order/i})
    fireEvent.click(button)

    // Wait for async operations
    await waitFor(() => {
      expect(getEstimate).toHaveBeenCalledWith(mockEstimateId)
      expect(mapEstimateToPurchaseOrder).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith(
        `/dashboard/purchase-orders/create?estimate=${mockEstimateId}`
      )
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  test('opens vendor selection dialog when estimate has multiple vendors', async () => {
    // Mock multiple vendor POs
    const mockPurchaseOrders = [
      {
        VendorRef: {value: 'vendor1', name: 'Vendor 1'},
        Line: [{Amount: 100}],
      },
      {
        VendorRef: {value: 'vendor2', name: 'Vendor 2'},
        Line: [{Amount: 200}],
      },
    ]

    // Setup mocks
    ;(getEstimate as jest.Mock).mockResolvedValue({Id: mockEstimateId})
    ;(mapEstimateToPurchaseOrder as jest.Mock).mockReturnValue(
      mockPurchaseOrders
    )

    // Render component
    render(
      <EstimateToPurchaseOrderAction
        estimateId={mockEstimateId}
        vendors={mockVendors}
        onSuccess={mockOnSuccess}
      />
    )

    // Click button
    const button = screen.getByRole('button', {name: /create purchase order/i})
    fireEvent.click(button)

    // Wait for dialog to appear
    await waitFor(() => {
      expect(getEstimate).toHaveBeenCalledWith(mockEstimateId)
      expect(mapEstimateToPurchaseOrder).toHaveBeenCalled()
      expect(screen.getByText('Select Vendor')).toBeInTheDocument()
    })

    // Verify vendor options are displayed
    expect(screen.getByText('Select a vendor')).toBeInTheDocument()
  })
})

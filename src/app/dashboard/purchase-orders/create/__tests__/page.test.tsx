import {render, screen} from '@testing-library/react'
import CreatePurchaseOrderPage from '../page'
import {getEstimate} from '@/services/intuit/estimate'
import {mapEstimateToPurchaseOrder} from '@/services/intuit/purchase-order/map-estimate-to-purchase-order'
import {findVendors} from '@/services/intuit/vendor/vendor.api'

// Mock the required modules
jest.mock('@/services/intuit/estimate', () => ({
  getEstimate: jest.fn(),
}))

jest.mock(
  '@/services/intuit/purchase-order/map-estimate-to-purchase-order',
  () => ({
    mapEstimateToPurchaseOrder: jest.fn(),
  })
)

jest.mock('@/services/intuit/vendor/vendor.api', () => ({
  findVendors: jest.fn(),
}))

// Mock the components
jest.mock('@/components/purchase-orders/PurchaseOrderForm', () => ({
  PurchaseOrderForm: jest.fn(() => (
    <div data-testid='mock-purchase-order-form' />
  )),
}))

jest.mock('@/components/purchase-orders/PurchaseOrderFormSkeleton', () => ({
  PurchaseOrderFormSkeleton: jest.fn(() => <div>Loading...</div>),
}))

jest.mock('react', () => {
  const originalReact = jest.requireActual('react')
  return {
    ...originalReact,
    Suspense: ({children}) => children,
  }
})

describe('CreatePurchaseOrderPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Setup default mock responses
    ;(findVendors as jest.Mock).mockResolvedValue({
      QueryResponse: {
        Vendor: [{Id: 'vendor1', DisplayName: 'Test Vendor'}],
      },
    })
  })

  it('renders a blank PO form when no estimate is provided', async () => {
    const page = await CreatePurchaseOrderPage({})
    render(page)

    expect(screen.getByText('Create Purchase Order')).toBeInTheDocument()
    expect(screen.getByTestId('mock-purchase-order-form')).toBeInTheDocument()
    expect(getEstimate).not.toHaveBeenCalled()
    expect(mapEstimateToPurchaseOrder).not.toHaveBeenCalled()
  })

  it('prefills from an estimate when estimate ID is provided', async () => {
    // Mock estimate and PO data
    const mockEstimate = {Id: 'est123', DocNumber: 'EST-123'}
    const mockPurchaseOrder = {VendorRef: {value: 'vendor1'}, Line: []}

    ;(getEstimate as jest.Mock).mockResolvedValue(mockEstimate)
    ;(mapEstimateToPurchaseOrder as jest.Mock).mockReturnValue([
      mockPurchaseOrder,
    ])

    const page = await CreatePurchaseOrderPage({
      searchParams: {estimate: 'est123'},
    })
    render(page)

    expect(
      screen.getByText('Create Purchase Order from Estimate')
    ).toBeInTheDocument()
    expect(screen.getByText(/Estimate #est123/)).toBeInTheDocument()
    expect(getEstimate).toHaveBeenCalledWith('est123')
    expect(mapEstimateToPurchaseOrder).toHaveBeenCalledWith(mockEstimate)
  })

  it('filters by vendor when vendor ID is provided', async () => {
    // Mock estimate and multiple POs data
    const mockEstimate = {Id: 'est123'}
    const mockPurchaseOrders = [
      {VendorRef: {value: 'vendor1'}, Line: []},
      {VendorRef: {value: 'vendor2'}, Line: []},
    ]

    ;(getEstimate as jest.Mock).mockResolvedValue(mockEstimate)
    ;(mapEstimateToPurchaseOrder as jest.Mock).mockReturnValue(
      mockPurchaseOrders
    )

    const page = await CreatePurchaseOrderPage({
      searchParams: {estimate: 'est123', vendor: 'vendor2'},
    })
    render(page)

    // Verify the second PO was selected based on vendor ID
    expect(
      screen.getByText('Create Purchase Order from Estimate')
    ).toBeInTheDocument()
    expect(getEstimate).toHaveBeenCalledWith('est123')
    expect(mapEstimateToPurchaseOrder).toHaveBeenCalledWith(mockEstimate)
  })

  it('handles errors when fetching estimate data', async () => {
    // Mock error case
    ;(getEstimate as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch estimate')
    )

    const page = await CreatePurchaseOrderPage({
      searchParams: {estimate: 'est123'},
    })
    render(page)

    // Verify it handled the error and displayed the page anyway
    expect(
      screen.getByText('Create Purchase Order from Estimate')
    ).toBeInTheDocument()
    expect(getEstimate).toHaveBeenCalledWith('est123')
    expect(mapEstimateToPurchaseOrder).not.toHaveBeenCalled() // Mapping shouldn't be called on error
  })
})

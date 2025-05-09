import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import {CopyToPurchaseOrderAction} from '../CopyToPurchaseOrderAction'
import {useRouter} from 'next/navigation'

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock the window.gtag for analytics testing
const mockGtag = jest.fn()
Object.defineProperty(window, 'gtag', {
  writable: true,
  value: mockGtag,
})

describe('CopyToPurchaseOrderAction', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('renders the dropdown trigger button', () => {
    render(<CopyToPurchaseOrderAction estimateId='EST123' />)

    // Find the button by its accessible name
    const button = screen.getByRole('button', {name: /more actions/i})
    expect(button).toBeInTheDocument()
  })

  it('shows the dropdown content when clicked', () => {
    render(<CopyToPurchaseOrderAction estimateId='EST123' />)

    // Click the trigger button
    const button = screen.getByRole('button', {name: /more actions/i})
    fireEvent.click(button)

    // Check that the dropdown item is shown
    const menuItem = screen.getByText(/copy to purchase order/i)
    expect(menuItem).toBeInTheDocument()
  })

  it('navigates to the create PO page with the estimate ID when dropdown item is clicked', () => {
    render(<CopyToPurchaseOrderAction estimateId='EST123' />)

    // Open dropdown and click the menu item
    const button = screen.getByRole('button', {name: /more actions/i})
    fireEvent.click(button)

    const menuItem = screen.getByText(/copy to purchase order/i)
    fireEvent.click(menuItem)

    // Check that router.push was called with the correct path
    expect(mockRouter.push).toHaveBeenCalledWith(
      '/dashboard/purchase-orders/create?fromEstimate=EST123'
    )
  })

  it('fires an analytics event when dropdown item is clicked', () => {
    render(<CopyToPurchaseOrderAction estimateId='EST123' />)

    // Open dropdown and click the menu item
    const button = screen.getByRole('button', {name: /more actions/i})
    fireEvent.click(button)

    const menuItem = screen.getByText(/copy to purchase order/i)
    fireEvent.click(menuItem)

    // Check that analytics event was fired
    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      'estimate.copy_to_po_clicked',
      {
        estimateId: 'EST123',
      }
    )
  })
})

# Dropdown Action Column for Estimates

This documentation covers the implementation of Ticket #01 - UI: Add Dropdown Action Column for Estimates.

## Overview

The feature adds a pinned right-hand dropdown menu to each row of the Estimates table. This dropdown provides actions that can be performed on an estimate, specifically:

- Create Purchase Order (vendor-facing)
- Create Invoice (customer-facing)

## Implementation Details

### Components Modified

1. **EntityTable Component** (`/src/app/dashboard/[entity]/entity-table.tsx`)
   - Added dropdown menu component using shadcn's `DropdownMenu` components
   - Implemented conditional rendering for estimates only
   - Refactored callbacks with `useCallback` to avoid unnecessary re-renders
   - Added prop types for callback handlers

2. **EstimatesPage Component** (`/src/app/dashboard/estimates/page.tsx`)
   - Converted to client component to handle routing
   - Added callback handlers for dropdown actions
   - Updated data fetching to work in a client component

### New Props Added to EntityTable

```typescript
type EntityTableProps = {
  // ... existing props
  onCreatePurchaseOrder?: (estimate: Estimate) => void
  onCreateInvoice?: (estimate: Estimate) => void
}
```

### Callback Implementation

Both action callbacks in the `EstimatesPage` component currently navigate to their respective creation pages with the estimate ID as a query parameter:

```typescript
// Example: Create Purchase Order callback
const handleCreatePurchaseOrder = useCallback((estimate: Estimate) => {
  router.push(`/dashboard/purchase-orders/create?fromEstimateId=${estimate.Id}`)
}, [router])
```

The actual creation logic will be implemented in later tickets (#06 and #07).

### Testing

A test file was created at `/src/app/dashboard/[entity]/__tests__/entity-table.test.tsx` to verify:

1. The dropdown appears only for estimates
2. Both actions trigger their respective callbacks
3. The callbacks receive the full estimate object

## Performance Considerations

1. **Callbacks**: All callback functions are wrapped with `useCallback` to prevent unnecessary re-renders.
2. **Columns Memo**: The columns configuration is memoized with `useMemo` to prevent recalculation on each render.
3. **Dependency Arrays**: Properly specified to avoid ESLint warnings about unstable dependencies.

## Styling

The dropdown menu follows shadcn UI styling, consistent with other action buttons in the table. It uses the `MoreHorizontal` icon from Lucide React, matching the application's design language.

## Next Steps

This implementation fulfills the requirements for Ticket #01. Future tickets will implement:

- Ticket #02/#03: Utilities to map Estimates to Purchase Orders/Invoices
- Ticket #06/#07: Pre-filled creation pages for both document types

## Screenshots

[To be added when deployed]

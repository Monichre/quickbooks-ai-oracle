# 16 – UI : Copy to Purchase Order Action (Detail Page)

**Status:** ✅ done

**Depends on:** 01 – UI Dropdown Action Column

## Goal

Add a **Copy to Purchase Order** option inside `EstimateDetailPage()` so users can initiate a PO directly while viewing a single estimate. The UX should mirror QuickBooks' kebab-menu (•••) action shown in `copy-to-purchase-order.png`.

## Acceptance Criteria

- [x] A kebab / dropdown button appears in the top-right actions bar of `EstimateDetailPage()`.
- [x] Menu item **Copy to purchase order** is visually consistent with shadcn `DropdownMenu` patterns.
- [x] Clicking the item routes to `/dashboard/purchase-orders/create?fromEstimate={estimateId}` (or preferred route alias) **without a full page reload** (Next.js `router.push`).
- [x] The route pre-fetches the estimate JSON via existing `getEstimate()` service to hydrate the PO form.
- [x] Existing *Edit Estimate* button and page layout remain unchanged.
- [x] No new ESLint or TypeScript errors.

## Implementation Notes

1. **Page Header Refactor**
   - Wrap the two existing action buttons (`Edit Estimate`, `CreatePOForm`) into a flex container.
   - Replace `CreatePOForm` placeholder with a `DropdownMenu` containing one item *(for now)*.
2. **Routing Strategy**
   - Use `router.push('/dashboard/purchase-orders/create', { query: { fromEstimate: estimate.Id } })`.
   - Alternatively, use intercepting routes: `app/@modal/create-purchase-order` if inline modal is preferred.
3. **Prefetch Data**
   - Trigger SWR mutate or call `getEstimate` in the destination page to avoid double fetch.
4. **Analytics** (stretch)
   - Fire a custom event `estimate.copy_to_po_clicked` with estimateId.

## Out of Scope

- Rendering the actual Create Purchase Order form (ticket 17).
- Backend QuickBooks mutations.

## Test Strategy

- **Unit**: Render `EstimateDetailPage` with mock data, click dropdown, assert `router.push`.
- **Integration**: Navigate in Cypress from detail ➜ create PO page; ensure query param passes.
- **Visual**: Storybook story for action menu with dark/light modes.

## Documentation

### Module Structure

- **Components**:
  - `src/components/estimates/EstimateActions.tsx` - Actions toolbar component
  - `src/components/estimates/CopyToPurchaseOrderAction.tsx` - Dropdown menu component
- **Integration**:
  - `src/app/dashboard/estimates/[id]/page.tsx` - Updated detail page with the action menu
  - `src/app/dashboard/purchase-orders/create/page.tsx` - Enhanced to support fromEstimate param 
- **Tests**:
  - `src/components/estimates/__tests__/CopyToPurchaseOrderAction.test.tsx`
  - `src/app/dashboard/purchase-orders/create/__tests__/page.test.tsx`

### Key Features

1. **Estimate to PO Workflow**:
   - Clean UX with a kebab menu for accessing additional estimate actions
   - Direct navigation from estimate to pre-populated PO form
   - Utilizes `mapEstimateToPurchaseOrder` utility for data transformation

2. **Data Integration**:
   - Passes estimate ID via query parameter
   - Pre-fetches estimate data for the target page
   - Maintains consistent state during navigation

3. **UI Consistency**:
   - Follows shadcn patterns for dropdown menus
   - Maintains existing page layout and button placement
   - Uses appropriate icons and text labels for actions

### Data Flow

1. **User Interaction**:
   - User views an estimate detail page
   - User clicks the kebab menu icon
   - User selects "Copy to purchase order" option

2. **Navigation Process**:
   - Client-side navigation triggered via Next.js router
   - Query parameter appended with estimate ID
   - Target page loads with context of source estimate

3. **Data Transformation**:
   - Target page retrieves estimate data
   - `mapEstimateToPurchaseOrder` utility converts estimate to PO format
   - Form initialized with transformed data

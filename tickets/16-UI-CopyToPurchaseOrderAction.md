# 16 – UI : Copy to Purchase Order Action (Detail Page)

**Status:** ⏳ pending

**Depends on:** 01 – UI Dropdown Action Column

## Goal

Add a **Copy to Purchase Order** option inside `EstimateDetailPage()` so users can initiate a PO directly while viewing a single estimate. The UX should mirror QuickBooks' kebab-menu (•••) action shown in `copy-to-purchase-order.png`.

## Acceptance Criteria

- [ ] A kebab / dropdown button appears in the top-right actions bar of `EstimateDetailPage()`.
- [ ] Menu item **Copy to purchase order** is visually consistent with shadcn `DropdownMenu` patterns.
- [ ] Clicking the item routes to `/dashboard/purchase-orders/create?fromEstimate={estimateId}` (or preferred route alias) **without a full page reload** (Next.js `router.push`).
- [ ] The route pre-fetches the estimate JSON via existing `getEstimate()` service to hydrate the PO form.
- [ ] Existing *Edit Estimate* button and page layout remain unchanged.
- [ ] No new ESLint or TypeScript errors.

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

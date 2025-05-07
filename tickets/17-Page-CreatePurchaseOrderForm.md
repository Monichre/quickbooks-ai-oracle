# 17 – Page : Create Purchase Order Form

**Status:** ⏳ pending

**Depends on:** 16 – UI Copy ➜ PO Action, 02 – Utility Map Estimate ➜ PO, 05 – API Bulk PurchaseOrder Support

## Goal

Build a dedicated **Create Purchase Order** page (`/dashboard/purchase-orders/create`) that can operate in two modes:

1. **Prefilled** – when `fromEstimate` query param is provided, auto-hydrate fields & line items based on the selected estimate.
2. **Blank** – when accessed directly from the Purchase Orders nav, render an empty form.

The form should replicate the QuickBooks Online layout shown in `create-purchase-order.png`, including Category Details & Item Details tables.

## Acceptance Criteria

- [ ] Page is implemented as a **React Server Component** (`app/dashboard/purchase-orders/create/page.tsx`) with selective client sub-components for interactive parts.
- [ ] Supports the following primary fields (grouped visually similar to QBO):
  1. **Header**
     - Vendor (autocomplete)
     - Email (optional, multi)
     - Status select (Open / Closed)
  2. **Dates & Shipping**
     - PO Date (defaults today)
     - Ship To (customer select)
     - Shipping Address (textarea)
     - Ship Via (text)
  3. **Tags** (multiselect input)
  4. **Category Details** table
     - Columns: Category, Description, Amount, Customer
     - Add/Clear line buttons
  5. **Item Details** table
     - Columns: Product/Service, Description, Qty, Rate, Amount, Customer
     - Supports inline edit of Qty & Rate
  6. **Totals Sidebar** – live calculated `$0.00` sum
  7. Footer actions: `Cancel`, `Save as Draft`, `Save & Send`.
- [ ] Form validation powered by `zod`; inline errors rendered below inputs.
- [ ] Saving triggers **server action** `createPurchaseOrder(formData)` which:
  - Maps form -> `PurchaseOrder` type (`src/services/intuit/types.ts`)
  - Calls QuickBooks `purchaseOrder.create`
  - Redirects to `/dashboard/purchase-orders/[id]` on success.
- [ ] Accessible via keyboard navigation and passes axe-core audit (no critical issues).
- [ ] Loading & error states follow shadcn UI patterns.

## Implementation Notes

1. **Data Fetch**
   - Use `getEstimate(id, { includeLines: true })` when `fromEstimate` set.
   - Reuse mapping utility (ticket 02) to transform estimate lines ➜ PO line format.
2. **Form State Management**
   - Use `react-hook-form` + `@hookform/resolvers/zod` in a Client Component wrapper.
   - Use `Controller` for table row inputs.
3. **Dynamic Tables**
   - Build reusable `EditableTable` component that can toggle between read & edit states.
   - Prefill Category vs Item tables based on line `DetailType`.
4. **Server Action** (`createPO.ts`)
   - `'use server'` function, accepts `Schema.parse(formData)`.
   - Calls `services/intuit/purchase-order/create.ts` wrapper (ticket 05 adds bulk support).
5. **UX Polishing**
   - Sticky header with Save actions.
   - Auto-calc row `Amount = Qty * Rate`.
   - Debounced vendor search hitting `/api/vendors?q=`.

## Out of Scope

- Multi-vendor estimate split (handled by earlier confirmation modal, ticket 05).
- Linking ItemReceipts or Bills (docs ticket 19).

## Test Strategy

- **Unit**: Field validation schema; mapping util snapshot.
- **Integration**: Cypress flow – open estimate detail ➜ copy ➜ form prefilled ➜ save ➜ PO detail.
- **Visual**: Percy snapshot of blank vs prefilled states.

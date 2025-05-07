# 02 – Utility : Map Estimate ➜ PurchaseOrder

**Status:** ⏳ pending

**Depends on:** none

## Goal

Provide a deterministic function that converts an **Estimate** object into one or more QuickBooks-compatible **PurchaseOrder** objects.

## Acceptance Criteria

- [ ] Function exported as `mapEstimateToPurchaseOrder(est: Estimate): PurchaseOrder[]`.
- [ ] Returns **one PO per distinct Vendor** present in the Estimate's line items.
- [ ] Output complies with `PurchaseOrder` TypeScript type and required QuickBooks fields (Id excluded).
- [ ] Handles empty or missing VendorRef by throwing a descriptive error.
- [ ] Jest tests cover:
  - Single-vendor estimate ➜ 1 PO
  - Multi-vendor estimate ➜ n POs
  - Missing vendor ➜ error path
  - Currency / TxnDate propagation
- [ ] No `any` used; full type coverage.

## Implementation Hints

1. Group `Estimate.Line` items by `VendorRef.value`.
2. For each group:
   - Build PO `VendorRef` & `Line` array (copy relevant fields only).
   - Set `APAccountRef` using company default (can inject via env or config helper).
   - Derive `DocNumber` as `${Estimate.DocNumber}-${VendorRef.name}` unless overridden.
3. Unit tests in `__tests__/mapEstimateToPurchaseOrder.test.ts`.

## Test Strategy

Run `bun test` or `npm test`. Aim for ≥90 % statement coverage for the mapping util.

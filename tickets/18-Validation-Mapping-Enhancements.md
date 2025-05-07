# 18 – Validation & Mapping Enhancements

**Status:** ⏳ pending

**Depends on:** 17 – Create Purchase Order Form

## Goal

Strengthen data validation and mapping logic between the Purchase Order form and Intuit API payload to guarantee data integrity, support edge cases, and pave the way for future features (ItemReceipt/Bill linking).

## Acceptance Criteria

- [ ] `PurchaseOrderSchema` (zod) covers all required & optional fields listed in [purchase-order.mdc](mdc:.cursor/rules/apis/intuit/purchase-order.mdc).
- [ ] Line-level schema validates numerical fields (`Qty`, `UnitPrice`, `Amount`) with min/max.
- [ ] Unit tests achieve ≥90% branch coverage for mapping utils.
- [ ] Server action fails fast with meaningful error if schema parse fails, surfaces toast in UI.
- [ ] Mapping util handles:
  - Empty Category or Item tables
  - Mixed tax codes (default NON)
  - Multi-currency placeholder (warn-only)
- [ ] Function signatures use named exports, no default.

## Implementation Notes

1. **Schema Declaration**
   - Place in `src/services/intuit/purchase-order/validation.ts`.
   - Export `purchaseOrderSchema` and re-use in both form resolver & server action.
2. **Mapping Refactor**
   - Move logic from ticket 02 util into `src/services/intuit/purchase-order/mapFormToPO.ts`.
   - Accept typed form data, return `PurchaseOrder` ready for API.
3. **Error Handling**
   - Throw `BadRequestError` (custom) with path + issue; catch in server action and revalidate `fieldErrors`.
4. **Testing**
   - Use `vitest` + `@vitest/coverage-c8`.
   - Snapshot expected PO JSON for complex estimate sample.
5. **Docs**
   - Update `/docs/intuit/purchase-order-validation.md` with field table.

## Out of Scope

- Linking logic itself (docs ticket 19).

## Test Strategy

- **Unit**: All happy path & failure cases for schema & map.
- **Integration**: End-to-end saving of PO with invalid rate -> error toast.

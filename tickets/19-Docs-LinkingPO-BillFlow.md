# 19 – Docs : Linking Flow – PO ➜ ItemReceipt / Bill

**Status:** ⏳ pending

**Depends on:** none

## Goal

Produce technical documentation summarizing how Purchase Orders flow into Item Receipts, Bills, and Expenses inside QuickBooks, referencing [linking-itemreciept-bill-to-purchase-order-invoice-to-sales-order.mdc](mdc:.cursor/rules/apis/intuit/linking-itemreciept-bill-to-purchase-order-invoice-to-sales-order.mdc) and [purchase-order-vendor-expense-bill-flow.mdc](mdc:.cursor/rules/purchase-order-vendor-expense-bill-flow.mdc).

This will guide future development when implementing PO receipt and bill conversion features.

## Acceptance Criteria

- [ ] New markdown doc at `docs/intuit/po-linking-flow.md` containing:
  - High-level sequence diagram (mermaid) of PO ➜ ItemReceipt ➜ Bill ➜ Payment.
  - Key API fields required for linking (`LinkedTxn`, `TxnID`, `TxnLineID`).
  - Table mapping UI actions ➜ API requests.
  - Edge-case notes (multicurrency, split lines, manual close).
- [ ] Added to Docusaurus sidebar (if docs site) or README index.
- [ ] PR reviewer can follow steps to replicate linking in sandbox QBO.

## Implementation Notes

1. Extract critical rules, validation, and limitations from the two `.mdc` source docs.
2. Encourage use of QuickBooks sandbox screenshots for clarity.
3. Include FAQ section (Why PO lines closed? How to partially receive?).
4. Link to Intuit official docs for canonical reference IDs.

## Out of Scope

- Actual code implementation for linking (future ticket).

## Test Strategy

- **Documentation**: Manual review for completeness & technical accuracy by domain SME.

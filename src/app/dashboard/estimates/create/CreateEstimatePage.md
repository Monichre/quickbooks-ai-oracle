# CreateEstimatePage Review Against Intuit Estimate Spec

## Overview

This document reviews the implementation of `CreateEstimatePage` and its dependencies against the requirements in `@intuit-estimate.mdc` and `@intuit-estimate-api.mdc`.

## Key Findings

- The current implementation supports the minimum required fields for creating a QuickBooks estimate: `CustomerRef`, at least one `SalesItemLine`, optional `DocNumber`, `TxnDate`, and `PrivateNote`.
- The form and UI do **not** support addresses, email, multicurrency, or advanced line types as described in the Intuit spec.
- Only `SalesItemLineDetail` is supported for line items; other types (Group, Discount, SubTotal, Description) are not available in the UI.

## Spec vs. Implementation Table

| Spec Field/Feature         | Supported in UI/Form? | Supported in API Types? | Notes/Comments |
|---------------------------|-----------------------|------------------------|----------------|
| CustomerRef               | Yes                   | Yes                    | Required, present |
| Line (SalesItemLine)      | Yes                   | Yes                    | Only this type supported in UI |
| Line (GroupLine, etc.)    | No                    | Yes                    | Not supported in UI/schema |
| CurrencyRef               | No                    | Yes                    | Not in form, not handled |
| TxnDate                   | Yes (optional)        | Yes                    | Defaults to today |
| DueDate                   | No                    | Yes                    | Not in form |
| DocNumber                 | Yes (optional)        | Yes                    | Optional |
| TotalAmt                  | No (calculated)       | Yes                    | Not in form, calculated by API |
| BillEmail                 | No                    | Yes                    | Not in form |
| BillAddr, ShipAddr        | No                    | Yes                    | Not in form |
| EmailStatus, PrintStatus  | No                    | Yes                    | Not in form |
| ExpirationDate, Accepted* | No                    | Yes                    | Not in form |
| CustomField               | No                    | Yes                    | Not in form |
| Status                    | No                    | Yes                    | Not in form |
| Line: Discount, SubTotal  | No                    | Yes                    | Not in form |
| Multicurrency             | No                    | Yes                    | Not in form |
| Validation: min 1 line    | Yes                   | Yes                    | Enforced in schema |

## Gaps and Recommendations

### Gaps

- No support for: addresses, email, multicurrency, advanced line types, or custom fields.
- Only `SalesItemLineDetail` is supported for line items.
- No UI for addresses, email, or custom fields.
- No handling of multicurrency.
- No way to set or view status fields.

### Recommendations

- Add UI fields for `BillAddr`, `ShipAddr`, `BillEmail`, `DueDate`, `ExpirationDate`, `CustomField`, etc.
- Add support for all line item types (at least as an advanced/optional feature).
- Add `CurrencyRef` field and logic for multicurrency.
- Add status fields if you want to allow setting them at creation.
- Consider adding validation for locale-specific requirements (e.g., France and DocNumber).

## Next Steps

- If full spec compliance is required, follow the pseudocode in `CreateEstimatePage_PSEUDOCODE.md` to extend the form and logic.
- If only minimum viable estimate creation is needed, the current implementation is sufficient for US/standard use cases.

---

**Reviewed by:** [Your Name/AI]
**Date:** [Today]

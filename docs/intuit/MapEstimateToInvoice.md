# MapEstimateToInvoice Utility

## Overview

The `mapEstimateToInvoice` utility function transforms QuickBooks Estimate objects into QuickBooks-compatible Invoice objects. This utility supports the "Copy Estimate to Invoice" workflow, allowing users to easily generate customer-facing invoices from existing estimates.

## Implementation Details

- **Location**: `src/services/intuit/invoice/map-estimate-to-invoice.ts`
- **Tests**: `src/services/intuit/invoice/__tests__/map-estimate-to-invoice.test.ts`
- **Exported Via**: `src/services/intuit/invoice/index.ts`

## Function Signature

```typescript
function mapEstimateToInvoice(est: Estimate): Invoice
```

### Input

- `est`: A QuickBooks Estimate object with all required fields

### Output

- Returns an Invoice object ready for API submission to QuickBooks

### Behavior

- Maps customer details from estimate to invoice
- Maps line items (products/services) preserving details
- Preserves tax information and settings
- Sets invoice number based on estimate number with "-INV" suffix
- Sets due date to 30 days from the current date if not specified

### Error Handling

- Throws error if the estimate has no line items
- Validates and transforms line items based on their type
- Throws detailed errors for unsupported line item types

## Usage Example

```typescript
import { mapEstimateToInvoice } from "@/services/intuit/invoice";
import { getEstimate } from "@/services/intuit/estimate/estimate.api";

// Get an estimate from QuickBooks
const estimateResponse = await getEstimate("123");
const estimate = estimateResponse.Estimate;

// Transform it to an invoice
const invoice = mapEstimateToInvoice(estimate);

// Now the invoice can be created in QuickBooks
const result = await createInvoice(invoice);
```

## Design Decisions

1. **1:1 Mapping**: Unlike purchase orders that can generate multiple POs per vendor, one estimate maps to exactly one invoice.

2. **Field Preservation**: Customer information, line items, and tax settings are preserved, making the invoice consistent with the original estimate.

3. **Due Date Assignment**: Automatically sets a due date 30 days from the current date, following standard invoicing practices.

4. **Error Validation**: Provides clear error messages for missing data or unsupported configurations.

## Related Files

- `src/services/intuit/invoice/invoice.api.ts` - API service for invoice operations
- `src/services/intuit/types.ts` - Type definitions for Invoice objects 
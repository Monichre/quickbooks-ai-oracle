# MapEstimateToPurchaseOrder Utility

## Overview

The `mapEstimateToPurchaseOrder` utility function transforms QuickBooks Estimate objects into one or more QuickBooks-compatible PurchaseOrder objects. This utility supports the "Copy Estimate to Purchase Order" feature by providing a deterministic mapping from estimate data to purchase order data.

## Architecture

### Module Structure

- **Location**: `src/services/intuit/purchase-order/mapEstimateToPurchaseOrder.ts`
- **Tests**: `src/services/intuit/purchase-order/__tests__/mapEstimateToPurchaseOrder.test.ts`
- **Dependencies**:
  - `../estimate/estimate.types` - For Estimate and EstimateLine types
  - `../types` - For PurchaseOrder and ReferenceType interfaces
  - `./config` - For default AP Account reference

### Function Signature

```typescript
function mapEstimateToPurchaseOrder(est: Estimate): PurchaseOrder[]
```

## Key Features

1. **Vendor-Based Grouping**:
   - Creates one PurchaseOrder per distinct vendor found in the Estimate line items
   - Groups Estimate line items by VendorRef.value
   - Skips non-SalesItemLineDetail line items (e.g., subtotals)

2. **Data Mapping**:
   - Maps Estimate fields to PurchaseOrder fields maintaining data integrity
   - Includes VendorRef, Line items, TxnDate, and CurrencyRef
   - Derives DocNumber as `${Estimate.DocNumber}-${VendorRef.name}`
   - Uses default APAccountRef from configuration

3. **Error Handling**:
   - Throws detailed errors for missing or invalid data
   - Validates VendorRef presence on each line item
   - Handles empty Estimates

## Data Flow

1. **Input**: Estimate object with multiple line items
2. **Processing**:
   - Group line items by vendor
   - For each vendor group, create a new PurchaseOrder
   - Map appropriate fields from Estimate to PurchaseOrder
   - Transform SalesItemLineDetail to ItemBasedExpenseLineDetail
3. **Output**: Array of PurchaseOrder objects (one per vendor)

## Usage Example

```typescript
import { mapEstimateToPurchaseOrder } from "../purchase-order/mapEstimateToPurchaseOrder";

// In a controller or service
try {
  // Fetch estimate
  const estimate = await getEstimate(estimateId);
  
  // Map to purchase orders (one per vendor)
  const purchaseOrders = mapEstimateToPurchaseOrder(estimate);
  
  // Create purchase orders in QuickBooks
  const results = await Promise.all(
    purchaseOrders.map(po => createPurchaseOrder(po))
  );
  
  return results;
} catch (error) {
  // Handle errors (e.g., missing vendor references)
  console.error("Error mapping estimate to purchase order:", error);
  throw error;
}
```

## Testing

The utility has comprehensive test coverage including:
- Single-vendor estimate → 1 PO
- Multi-vendor estimate → n POs
- Missing vendor → error path
- Currency/TxnDate propagation
- Handling of different line item types

## Future Enhancements

Potential improvements could include:
- Support for additional PurchaseOrder fields
- More flexible DocNumber generation
- Custom grouping strategies beyond vendor-based grouping 
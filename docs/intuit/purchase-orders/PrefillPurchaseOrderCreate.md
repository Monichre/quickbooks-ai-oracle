# Prefill Purchase Order Create

## Overview

The Prefill Purchase Order Create feature enables users to create a QuickBooks Purchase Order (PO) pre-populated with data from an existing Estimate. This streamlines the purchase order creation process by automatically mapping Estimate line items to the corresponding PO fields.

## Architecture

### Key Components

1. **Page Routes**:
   - `/dashboard/purchase-orders/create?estimate=<id>&vendor=<id>` - Main prefill route
   - `/dashboard/purchase-orders/create/vendor-select?estimate=<id>` - Vendor selection when an estimate has multiple vendors

2. **UI Components**:
   - `EstimateToPurchaseOrderAction` - Button component for creating a PO from an estimate
   - `CopyToPurchaseOrderAction` - Dropdown menu action for estimates

3. **Data Flow**:
   - Estimate data is fetched via `getEstimate()`
   - Mapping is performed via `mapEstimateToPurchaseOrder()`
   - The form is prefilled with mapped data
   - User can review and modify before saving

4. **Actions**:
   - PO creation is handled via server action `createPurchaseOrderAction()`

## Usage

### Creating a Purchase Order from Estimate

1. **From Estimate List**:
   - Click the "..." menu on any Estimate row
   - Select "Copy to Purchase Order"

2. **From Estimate Detail**:
   - Click the "Create Purchase Order" button in the actions toolbar

3. **Vendor Selection**:
   - If the Estimate contains items from multiple vendors:
     - A selection screen appears allowing choice of which vendor to create a PO for
   - If only one vendor is present:
     - The PO creation form is displayed directly with prefilled data

4. **Form Review**:
   - Review prefilled data including:
     - Vendor information
     - Line items (amounts, quantities, etc.)
     - Document numbers
   - Make any necessary modifications
   - Click "Create Purchase Order" to save

## Implementation Details

### Query Parameters

The create page accepts the following query parameters:
- `estimate`: ID of the Estimate to prefill from
- `vendor`: (Optional) ID of the vendor to filter line items for
- `fromEstimate`: Legacy parameter (maintained for backward compatibility)

### PO Mapping Logic

The mapping from Estimate to PO handles:
- Vendor-specific filtering when a vendor ID is provided
- Creation of one PO per vendor when no vendor ID is specified
- Preserving line item details (quantities, amounts, item references)
- Generating appropriate document numbers

### Multi-Vendor Handling

When an Estimate contains items from multiple vendors:
1. The system creates one PO per vendor
2. Users can select which vendor's PO to create
3. The vendor selection UI displays:
   - Vendor name
   - Item count
   - Total amount per vendor

## Error Handling

- Invalid Estimate IDs: Show appropriate error messages
- Missing Vendor References: Provide helpful error guidance
- API Failures: Surface QuickBooks API errors in the UI

## Related Documents

- [MapEstimateToPurchaseOrder.md](MapEstimateToPurchaseOrder.md) - Documentation for the mapping utility
- [PurchaseOrderCreationProcess.md](PurchaseOrderCreationProcess.md) - Overall PO creation flow 
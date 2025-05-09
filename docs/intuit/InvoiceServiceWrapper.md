# Invoice Service Wrapper API

## Overview

The Invoice Service Wrapper provides a clean interface for interacting with the QuickBooks Online API to manage customer-facing invoices. It handles all CRUD operations and additional invoice-specific functionalities like PDF generation and email sending.

## Implementation Details

- **Location**: `src/services/intuit/invoice/invoice.api.ts`
- **Tests**: `src/services/intuit/invoice/__tests__/invoice.test.ts`
- **Exported Via**: `src/services/intuit/invoice/index.ts`

## API Functions

### Basic CRUD Operations

```typescript
function createInvoice(invoiceData: Invoice): Promise<{ Invoice: Invoice }>

function getInvoice(invoiceId: string): Promise<{ Invoice: Invoice }>

function findInvoices(params: QueryParams = {}): Promise<{ 
  QueryResponse: { Invoice: Invoice[] } 
}>

function updateInvoice(
  invoiceData: Invoice & { Id: string; SyncToken: string }
): Promise<{ Invoice: Invoice }>

function deleteInvoice(
  invoiceId: string, 
  syncToken: string
): Promise<{ Invoice: Invoice }>
```

### Invoice-Specific Operations

```typescript
function getInvoicePdf(invoiceId: string): Promise<Blob>

function sendInvoicePdf(
  invoiceId: string, 
  email?: string
): Promise<{ Invoice: Invoice }>
```

## Usage Examples

### Creating an Invoice

```typescript
import { createInvoice } from "@/services/intuit/invoice";

const newInvoice = {
  CustomerRef: { value: "123" },
  Line: [
    {
      DetailType: "SalesItemLineDetail",
      Amount: 100,
      SalesItemLineDetail: {
        ItemRef: { value: "456" },
        UnitPrice: 100,
        Qty: 1
      }
    }
  ]
};

const result = await createInvoice(newInvoice);
// result.Invoice contains the created invoice with ID and other fields
```

### Downloading Invoice PDF

```typescript
import { getInvoicePdf } from "@/services/intuit/invoice";

const pdfBlob = await getInvoicePdf("123");
// Use the Blob for download, preview, etc.
```

### Finding Invoices

```typescript
import { findInvoices } from "@/services/intuit/invoice";

// Find invoices for a specific customer
const customerInvoices = await findInvoices({ 
  CustomerRef: "123",
  limit: 10
});

// Find recent invoices
const recentInvoices = await findInvoices({
  TxnDate: ">2023-01-01",
  limit: 25
});
```

## Error Handling

All API functions handle QuickBooks API errors by letting them propagate to the caller. The consuming code should implement try/catch blocks to handle these errors appropriately:

```typescript
try {
  const result = await createInvoice(newInvoice);
  // Process result
} catch (error) {
  // Handle API errors
  console.error("QuickBooks API error:", error);
}
```

## Related Files

- `src/services/intuit/invoice/map-estimate-to-invoice.ts` - Utility for converting estimates to invoices
- `src/services/intuit/api.ts` - Core API utilities used by this service
- `src/services/intuit/types.ts` - Type definitions for Invoice objects 
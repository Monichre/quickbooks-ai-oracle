# Intuit QuickBooks API Integration

This directory contains a structured organization of QuickBooks API client modules.

## Directory Structure

The codebase is organized by entity type, with each entity having its own directory and API file:

```
src/lib/intuit/
├── account/
│   └── account.api.ts
├── company-info/
│   └── company-info.api.ts
├── customer/
│   └── customer.api.ts
├── invoice/
│   └── invoice.api.ts
├── item/
│   └── item.api.ts
├── product/
│   └── product.api.ts
├── purchase/
│   └── purchase.api.ts
├── purchase-order/
│   └── purchase-order.api.ts
├── vendor/
│   └── vendor.api.ts
├── api.ts
├── auth.ts
├── client.ts
├── encryption.ts
├── index.ts
└── types.ts
```

## Usage

All API functions are exported from the main QuickBooks client at:

```typescript
import * from "src/lib/quickbooks/client";
```

## Available APIs

### Account

- `createAccount`
- `getAccount`
- `updateAccount`
- `findAccounts`
- `deleteAccount`

### Company Info

- `getCompanyInfo`
- `getCompanyInfoById`
- `findCompanyInfos`
- `updateCompanyInfo`

### Customer

- `createCustomer`
- `getCustomer`
- `updateCustomer`
- `findCustomers`
- `deleteCustomer`

### Invoice

- `createInvoice`
- `getInvoice`
- `updateInvoice`
- `findInvoices`
- `deleteInvoice`
- `getInvoicePdf`
- `sendInvoicePdf`

### Item

- `createItem`
- `getItem`
- `updateItem`
- `findItems`
- `deleteItem`

### Product (alias for Item)

- `createProduct`
- `getProduct`
- `updateProduct`
- `findProducts`
- `deleteProduct`

### Purchase

- `createPurchase`
- `getPurchase`
- `updatePurchase`
- `findPurchases`
- `deletePurchase`

### Purchase Order

- `createPurchaseOrder`
- `getPurchaseOrder`
- `updatePurchaseOrder`
- `findPurchaseOrders`
- `deletePurchaseOrder`

### Vendor

- `createVendor`
- `getVendor`
- `updateVendor`
- `findVendors`
- `deleteVendor`

## Authentication

Authentication is handled via the `auth.ts` module which includes functions for refreshing tokens and maintaining the authentication state with QuickBooks.

## Core Utilities

- `quickbooksRequest`: The core function for making authenticated requests to the QuickBooks API
- `buildQueryString`: Helper function to build query strings for filtering entities

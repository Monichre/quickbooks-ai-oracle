# Ticket: Copy Estimate to Purchase Order / Invoice

## Overview

Enable users to generate a QuickBooks **Purchase Order** (vendor-facing) or **Invoice** (customer-facing) directly from any existing **Estimate** entry in the dashboard.  The feature starts at step 2 of the "Purchase Order Creation Process" and builds on the already-completed Estimate creation flow.

## Objectives

- Add an action dropdown to each Estimate row that offers:
  1. **Create Purchase Order**
  2. **Create Invoice**
- When triggered, pre-fill and display the corresponding creation page with data mapped from the Estimate.
- Persist the new Purchase Order via `createPurchaseOrder()` (QuickBooks API wrapper) and the new Invoice via a matching invoice API wrapper (to be implemented).
- (Stretch) Provide an **AI-Assist** option that converts an uploaded Estimate document or the in-memory Estimate object into one or more valid PurchaseOrder payloads.

## Clarifying Questions

1. Does a single Estimate that references multiple vendors require **one PO per vendor** (recommended) or a single combined PO?
2. Confirm the route to launch after the dropdown click:
   - `/dashboard/purchase-orders/create`  
   - `/dashboard/invoices/create`
3. Is there already an Invoice-creation service analogous to `purchase-order.api.ts`, or should we author a new one?
4. Where should the AI-Assist UI live (modal, separate page, or within create screen)?
5. Approved LLM provider & model for AI-Assist?  (OpenAI, Anthropic, etc.)
6. Supported file types for AI upload (PDF, EML, plain text)?
7. Should we block PO creation if Vendor data is missing on the Estimate lines?

## Sub-Tasks

1. **UI – Dropdown Action Column**  
   • Extend `EntityTable` to inject a pinned right-hand `DropdownMenu` (shadcn) when `entity === 'estimates'`.  
   • Options: *Create Purchase Order*, *Create Invoice*.  
   • Fix existing ESLint deps (`navigateToEntityDetail`, `openQuickView`).

2. **Data-Mapping Utilities**  
   • `mapEstimateToPurchaseOrder(est: Estimate): PurchaseOrder[]` (one PO per vendor).  
   • `mapEstimateToInvoice(est: Estimate): Invoice`.  
   • Jest unit tests with fixture data.

3. **API Layer Enhancements**  
   • Ensure `createPurchaseOrder()` can handle bulk creation.  
   • Add `invoice.api.ts` with `createInvoice()` wrapper.

4. **Route & Prefill Pages**  
   • `/dashboard/purchase-orders/create?estimate=<id>&vendor=<id>`  
   • `/dashboard/invoices/create?estimate=<id>`  
   • Show read-only preview, "Save" (POST) & "Edit" actions.

5. **AI-Assist (Stretch)**  
   • API route `POST /api/ai/estimate-to-po`.  
   • Prompt LLM to output PurchaseOrder JSON.  
   • Validate JSON schema before POST.  
   • Feature-flag via `NEXT_PUBLIC_AI_ASSIST`.

6. **Validation & Error Handling**  
   • Surface QuickBooks validation errors via toast notifications.  
   • Log backend errors to Sentry.

7. **Docs & Demo**  
   • Author `PurchaseOrderCreationProcess.md` (PascalCase) documenting flow.  
   • (Optional) Record Loom demo.

## Technical Notes

- UI stack: React 18 + Next.js (RSC where possible) + shadcn/tailwind.
- Follow SOLID, functional utilities, descriptive names, no `any`.
- Re-use `apis/intuit/purchase-order.mdc` & `linking-itemreceipt-bill-to-purchase-order-invoice-to-sales-order.mdc` for compliance.
- Ensure new API wrappers honour QuickBooks *minorversion* query param.

## Success Criteria

- Dropdown renders without significant performance loss (<50 ms additional render time).
- Creating a PO from an Estimate with two vendors produces **two** POs in QuickBooks and shows success toast.
- Mapping utilities reach ≥90 % unit-test coverage.
- AI-Assist returns schema-valid payload in ≥3 manual tests.

## Integrate Midday Components

### Overview
Integrate open-source invoice components from Midday (https://midday.ai/components/) to enhance our invoice creation, preview, and PDF generation capabilities.

### Components to Integrate
1. **Invoice PDF Template** - React PDF template supporting Tiptap JSON for invoice generation
2. **Invoice React Template** - React template for invoices supporting Tiptap JSON format
3. **Invoice Open Graph Template** - Next.js Open Graph template for invoice sharing
4. **Invoice Toolbar** - Toolbar with comments and avatars for invoice collaboration

### Sub-Tasks
1. **Evaluate Component Compatibility**
   • Review the components' API and documentation on GitHub
   • Assess compatibility with our existing invoice data model
   • Identify any dependencies or modifications needed

2. **Implement Core Templates**
   • Integrate the Invoice PDF Template for PDF generation
   • Implement Invoice React Template for preview screens
   • Configure Open Graph Template for invoice sharing features

3. **UI Enhancements**
   • Add Invoice Toolbar to invoice edit screens
   • Ensure consistent styling with our existing UI
   • Test responsive behavior across devices

4. **Integration with Existing Flow**
   • Connect components to our `mapEstimateToInvoice()` utility
   • Update invoice creation pages to utilize new templates
   • Ensure QuickBooks API compatibility is maintained

### Dependencies
- Requires completion of Invoice Service Wrapper (Ticket #04)
- Should be implemented after Invoice Create page (Ticket #07)
- May require updates to the Invoice data model

---
*Last updated: {{DATE}}*

[Copy an estimate to a purchase order](https://quickbooks.intuit.com/learn-support/en-us/help-article/new-subscriptions/copy-estimate-purchase-order/L7Z08es7a_US_en_US)

**QuickBooksHelp**Intuit

# **Copy an estimate to a purchase order**

**by Intuit•207•Updated about 21 hours ago**

Learn how to copy an estimate onto a purchase order in QuickBooks Online.

 Purchase orders are only available in QuickBooks Online Plus and QuickBooks Online Advanced. If you need to, you can [**upgrade your plan**](https://app.qbo.intuit.com/app/login?pagereq=billing/?cid=OHH-CS_SDR-US-QBO-QBOAV-NA-XSLL-EDU-NA-PB-SDR_IAPers_Unknown).

To streamline your process once a customer approves your estimate you can easily copy it to a purchase order. In this article, we'll show you how.

**Note**: This option isn't available yet for the new estimate and invoice layout. [**Find out which layout you have**](https://community.intuit.com/oicms/L9jVVT2GY_US_en_US).

## **Step 1: Turn on the purchase order feature**

1. Go to **Settings** , then select **Account and settings**.
2. Go to **Expenses**.
3. Select the **pencil**✎ icon in the **Purchase orders** section.
4. Turn on the **Use purchase orders** switch.
5. Select **Save**, then **Done**.

## **Step 2: Copy estimate to a purchase order**

1. Select **+ New**.
2. Select Estimate.
3. Enter customer and product or service details. Then select **Save**.
4. A dropdown choice of **Create invoice** or**Copy to purchase order** will appear next to the amount.
5. Select **Copy to purchase order**.
6. Select a **Vendor**.
7. In the Item details section, select the same customer mentioned on the purchase order.
8. Select **Save and close**.

## **Why didn't some of my items copy over to the purchase order?**

Only items marked as purchased from vendors get copied over to purchase orders. Verify that your products or services are marked accordingly.

1. Go to **Settings**⚙, then select **Products & services** ([**Take me there**](https://c1.qbo.intuit.com/qbo1/login?pagereq=items)).
2. Find the product or service. Then select **Edit**.
3. In the **Purchasing information** section, select the **I purchase this product/service from a vendor** checkbox.
4. Select **Save and close**.

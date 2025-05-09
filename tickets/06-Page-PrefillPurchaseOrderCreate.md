# 06 – Page – Prefill Purchase Order Create

## Overview

Implement a page to prefill the Purchase Order creation form using data mapped from an Estimate. This streamlines the user experience and reduces manual entry.

## Objectives

- Create `/dashboard/purchase-orders/create?estimate=<id>&vendor=<id>` route
- Prefill form fields using mapped Estimate data
- Allow user to review, edit, and save the PO
- Show read-only preview and handle navigation

## Sub-Tasks

1. Implement route and page structure in Next.js App Router
2. Fetch and map Estimate data using utility
3. Prefill form fields and handle validation
4. Add preview, edit, and save actions
5. Write UI and integration tests

## Technical Notes

- Use shadcn UI components and Tailwind for styling
- Ensure accessibility and responsive design
- Reference mapping utility and API wrapper

## Success Criteria

- Page loads with prefilled data for valid Estimate/vendor
- User can edit and save PO successfully
- All validation and error states are handled

## Dependencies

- 01 (UI – Add Dropdown Action Column)
- 02 (Utility – Map Estimate ➜ PurchaseOrder)
- 05 (API – Bulk PurchaseOrder Support) 
# 07 – Page – Prefill Invoice Create

## Overview

Implement a page to prefill the Invoice creation form using data mapped from an Estimate, supporting rapid customer-facing invoice generation.

## Objectives

- Create `/dashboard/invoices/create?estimate=<id>` route
- Prefill form fields using mapped Estimate data
- Allow user to review, edit, and save the Invoice
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
- Reference mapping utility and Invoice API wrapper

## Success Criteria

- Page loads with prefilled data for valid Estimate
- User can edit and save Invoice successfully
- All validation and error states are handled

## Dependencies

- 01 (UI – Add Dropdown Action Column)
- 03 (Utility – Map Estimate ➜ Invoice)
- 04 (API – Invoice Service Wrapper) 
# 04 – API – Invoice Service Wrapper

## Overview

Create a service wrapper for QuickBooks Invoice API operations, analogous to the existing Purchase Order service. This will enable programmatic creation, retrieval, and management of invoices.

## Objectives

- Implement `createInvoice(invoice: Invoice): Promise<Invoice>`
- Add support for fetching and updating invoices as needed
- Handle API errors and validation gracefully
- Ensure type safety and schema compliance

## Sub-Tasks

1. Review QuickBooks Invoice API documentation
2. Define service interface and implementation in `/services/intuit/invoice/`
3. Add error handling and logging (e.g., Sentry)
4. Write unit and integration tests
5. Document API usage and edge cases

## Technical Notes

- Use existing API patterns and error handling conventions
- Ensure minorversion query param is honored
- Reference `.mdc` files for schema

## Success Criteria

- Service wrapper passes all tests
- Integrates with Invoice creation flow
- Handles API errors robustly

## Dependencies

- None 
# QuickBooks Online API Documentation - Table of Contents

## Overview

This directory contains comprehensive documentation for the QuickBooks Online API, covering various aspects including authentication, endpoints, entity models, and integration patterns. The documentation is structured to provide developers with the information needed to integrate with QuickBooks Online effectively.

## Documentation Files

1. **[QuickBooks API Overview](01-quickbooks-api-overview.md)**
   - Introduction to the QuickBooks Online API
   - Key features and capabilities
   - API architecture and design principles

2. **[Authentication and Authorization](02-quickbooks-api-auth.md)**
   - OAuth 2.0 implementation
   - Authorization endpoints
   - Token management and refresh patterns
   - User authentication flows

3. **[API Endpoints and Base URLs](03-quickbooks-api-endpoints.md)**
   - Production and Sandbox environments
   - Base URL structures
   - Version information
   - Rate limits and quotas

4. **[Common Request and Response Patterns](04-quickbooks-api-request-response.md)**
   - Standard request formats
   - Response handling
   - Error codes and troubleshooting
   - Pagination and filtering

5. **[Entity: Company Information](05-quickbooks-api-company-info.md)**
   - Company data structure
   - Retrieving company details
   - Updating company information
   - Company preferences

6. **[Entity: Account](06-quickbooks-api-account.md)**
   - Account data model
   - Creating and retrieving accounts
   - Chart of accounts management
   - Account classification and types

7. **[Entity: Customer](07-quickbooks-api-customer.md)**
   - Customer data model
   - CRUD operations for customers
   - Customer relationships
   - Best practices for customer management

8. **[Entity: Vendor](08-quickbooks-api-vendor.md)**
   - Vendor data model
   - Creating and managing vendors
   - Vendor-specific business rules
   - 1099 vendor configurations

9. **[Entity: Item and Product](09-quickbooks-api-item.md)**
   - Item data model
   - Product and service items
   - Inventory management
   - Pricing and tax information

10. **[Entity: Invoice](10-quickbooks-api-invoice.md)**
    - Invoice data structure
    - Creating and sending invoices
    - Payment application
    - Invoice attachments and PDF generation

11. **[Entity: Payment](11-quickbooks-api-payment.md)**
    - Payment data model
    - Recording and processing payments
    - Payment methods
    - Linking payments to invoices

12. **[Entity: Bill](12-quickbooks-api-bill.md)**
    - Bill data structure
    - Creating and managing bills
    - Bill payment workflows
    - Vendor credits

13. **[Entity: Purchase Order](13-quickbooks-api-purchase-order.md)**
    - Purchase order data model
    - PO lifecycle management
    - Converting POs to bills
    - Status tracking

14. **[Entity: Estimate](14-quickbooks-api-estimate.md)**
    - Estimate data structure
    - Creating and managing estimates
    - Converting estimates to invoices
    - Status management

15. **[Reports and Queries](15-quickbooks-api-reports.md)**
    - Available report types
    - Query language
    - Filtering and customization
    - Report generation and formats

16. **[Webhooks and Events](16-quickbooks-api-webhooks.md)**
    - Event notifications
    - Webhook configuration
    - Security considerations
    - Event handling patterns

17. **[Integration Best Practices](17-quickbooks-api-best-practices.md)**
    - Performance optimization
    - Error handling strategies
    - Sync strategies and conflict resolution
    - Testing and troubleshooting

## Data Model

The QuickBooks Online API follows a comprehensive data model with relationships between various entities. The [Entity Relationship Diagram](../quickbooks-erd.svg) provides a visual representation of these relationships and can be used as a reference for understanding the data structure.

## API References

- **Base URLs**:
  - **Production**: <https://quickbooks.api.intuit.com>
  - **Sandbox**: <https://sandbox-quickbooks.api.intuit.com>

- **OAuth Endpoints**:
  - **Authorization**: <https://appcenter.intuit.com/connect/oauth2>
  - **Token**: <https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer>
  - **Revocation**: <https://developer.api.intuit.com/v2/oauth2/tokens/revoke>

- **API Version**: The latest stable version is v3

## Additional Resources

- [Official Intuit Developer Documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/most-commonly-used/account)
- [API Explorer](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account)
- [Sample Code and SDKs](https://developer.intuit.com/app/developer/qbo/docs/develop/sdks-and-samples-collections/samples)

## Notes

- This documentation is maintained as a reference guide for internal development.
- For the most up-to-date and comprehensive information, always refer to the official Intuit Developer documentation.
- API behavior may vary slightly between different regional versions of QuickBooks Online.

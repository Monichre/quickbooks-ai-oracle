---
description: 
globs: 
alwaysApply: false
---
# QuickBooks Online API - Customer Entity Documentation

This is a comprehensive guide to the Customer entity in the QuickBooks Online API, covering all aspects of working with customer data.

## Overview

A customer is a consumer of services or products offered by a business. The Customer object in QuickBooks Online can have a hierarchical structure with parent customers, sub-customers, and jobs.

### Hierarchy Structure
- **Parent Customer**: Top-level customer object
- **Sub-Customer**: Customers nested under a parent (e.g., properties managed by a property company)
- **Job**: Specific projects or tasks associated with a parent customer (e.g., kitchen remodel for a homeowner)

Up to four levels of nesting can be defined under a top-level parent Customer object.

## Business Rules

- DisplayName, Title, GivenName, MiddleName, FamilyName, Suffix, and PrintOnCheckName must not contain colons (:), tabs (\t), or newlines (\n)
- DisplayName must be unique across all customers, employees, and vendors
- PrimaryEmailAddress must contain @ and . characters
- During creation, either DisplayName or at least one of Title, GivenName, MiddleName, FamilyName, or Suffix is required

## API Operations

### Create a Customer
```
POST /v3/company/<realmID>/customer
Content-Type: application/json
```

Minimum required fields for creation:
- DisplayName (or at least one name component: Title, GivenName, MiddleName, FamilyName, Suffix)

### Read a Customer
```
GET /v3/company/<realmID>/customer/<customerId>
```

### Query Customers
```
GET /v3/company/<realmID>/query?query=<selectStatement>
```

Example query:
```
select * from Customer Where Metadata.LastUpdatedTime > '2015-03-01'
```

### Update a Customer (Full)
```
POST /v3/company/<realmID>/customer
Content-Type: application/json
```
Requires all fields, including the Id and SyncToken.

### Update a Customer (Sparse)
```
POST /v3/company/<realmID>/customer
Content-Type: application/json
```
Use `sparse: true` to update only specified fields.

## Key Attributes

### Required for Updates
- Id: Unique identifier
- SyncToken: Version number for concurrency control

### Conditionally Required
- DisplayName: Displayed name (must be unique)
- Title, GivenName, MiddleName, FamilyName, Suffix: Name components

### Common Attributes
- PrimaryEmailAddr: Main email address
- PrimaryPhone: Main phone number
- BillAddr: Billing address
- ShipAddr: Shipping address
- CompanyName: Associated company
- Active: Whether the customer is active
- Taxable: Whether transactions for this customer are taxable
- Balance: Open balance amount
- Notes: Free-form text description

### Relationships and References
- ParentRef: Reference to parent customer (for sub-customers/jobs)
- DefaultTaxCodeRef: Default tax code
- SalesTermRef: Sales terms reference
- PaymentMethodRef: Payment method reference
- ARAccountRef: Accounts receivable account (for France)

### Hierarchical Information
- Job: Boolean indicating if this is a job/sub-customer
- BillWithParent: Whether the customer is billed with parent
- FullyQualifiedName: Fully qualified hierarchical name
- Level: Position in the hierarchy

## Special Fields for Different Countries
- PrimaryTaxIdentifier: Tax ID for UK, CA, IN, AU
- SecondaryTaxIdentifier: Secondary tax ID (UK, IN)
- GSTIN: GST registration number (India)
- GSTRegistrationType: GST registration type (India)
- BusinessNumber: PAN code (India)

## Sample Usage

### Creating a Basic Customer
```json
{
  "DisplayName": "King's Groceries",
  "GivenName": "James",
  "FamilyName": "King",
  "CompanyName": "King Groceries",
  "PrimaryPhone": {
    "FreeFormNumber": "(555) 555-5555"
  },
  "PrimaryEmailAddr": {
    "Address": "jdrew@myemail.com"
  },
  "BillAddr": {
    "Line1": "123 Main Street",
    "City": "Mountain View",
    "CountrySubDivisionCode": "CA",
    "PostalCode": "94042",
    "Country": "USA"
  }
}
```

### Creating a Sub-Customer/Job
Must include:
- Job: true
- ParentRef: Reference to the parent customer

## Status Codes and Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad request (validation errors)
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 429: Too many requests
- 500: Server error

## Additional Notes

1. The PrintOnCheckName is populated from DisplayName if not provided
2. When updating physical addresses, components flow differently into Line elements
3. When setting a Customer to inactive, a CreditMemo balancing transaction may be created if there's a balance
4. For minor version 10+, Taxable defaults to true if DefaultTaxCodeRef is defined, or false if TaxExemptionReasonId is set

This documentation covers all operations, attributes, and business rules for working with Customer entities in the QuickBooks Online API.
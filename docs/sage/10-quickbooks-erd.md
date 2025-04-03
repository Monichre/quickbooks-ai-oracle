# QuickBooks Entity Relationship Diagram

## Source

This documentation is based on an SVG file located at:
`/docs/quickbooks-erd.svg`

## Description

This file contains an Entity Relationship Diagram (ERD) for QuickBooks, showing the data model structure and relationships between entities.

## File Details

- **Filename**: quickbooks-erd.svg
- **File Type**: Scalable Vector Graphics (SVG)
- **File Size**: 12691 bytes

## Content Overview

The QuickBooks ERD visualizes the database schema for QuickBooks, including:

### Entities

- **Company (CompanyInfo)**
  - Id (PK)
  - CompanyName
  - LegalName
  - CompanyAddr
  - Country
  - FiscalYearStartMonth
  - TaxIdentifiers

- **Account**
  - Id (PK)
  - Name
  - AccountType
  - AccountSubType
  - Classification
  - CurrentBalance
  - Active

- **Customer**
  - Id (PK)
  - DisplayName
  - GivenName, FamilyName
  - CompanyName
  - BillAddr, ShipAddr
  - PrimaryEmailAddr
  - Balance
  - ParentRef (FK)

- **Vendor**
  - Id (PK)
  - DisplayName
  - GivenName, FamilyName
  - CompanyName
  - BillAddr
  - PrimaryEmailAddr
  - Balance, TaxIdentifier

- **Item**
  - Id (PK)
  - Name
  - Description
  - Type
  - UnitPrice
  - QtyOnHand
  - IncomeAccountRef (FK)
  - ExpenseAccountRef (FK)

- **Invoice**
  - Id (PK)
  - DocNumber
  - TxnDate
  - DueDate
  - TotalAmt
  - Balance
  - CustomerRef (FK)

- **Payment**
  - Id (PK)
  - TotalAmt
  - TxnDate
  - PaymentMethodRef (FK)
  - DepositToAccountRef (FK)
  - UnappliedAmt
  - CustomerRef (FK)

- **Bill**
  - Id (PK)
  - DocNumber
  - TxnDate
  - DueDate
  - TotalAmt
  - Balance
  - VendorRef (FK)

- **Estimate**
  - Id (PK)
  - DocNumber
  - TxnDate
  - ExpirationDate
  - TotalAmt
  - Status
  - CustomerRef (FK)

- **PurchaseOrder**
  - Id (PK)
  - DocNumber
  - TxnDate
  - POStatus
  - TotalAmt
  - VendorRef (FK)

- **TaxAgency**
  - Id (PK)
  - DisplayName
  - TaxTrackedOnSales
  - TaxTrackedOnPurchases

### Relationships

The diagram illustrates the following relationships:

- Company to Account (1:*)
- Company to Customer (1:*)
- Company to Vendor (1:*)
- Company to Item (1:*)
- Company to TaxAgency (1:*)
- Customer to Invoice (1:*)
- Customer to Payment (1:*)
- Customer to Estimate (1:*)
- Vendor to Bill (1:*)
- Vendor to PurchaseOrder (1:*)

## Related Documentation

For complete documentation, refer to the other QuickBooks and SAGE API documentation files in this directory.

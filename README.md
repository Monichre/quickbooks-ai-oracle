# Quickbooks/Intuit + Sage AI Oracle

## Intuit

[Product Requirements Doc](docs/PRD.md)

**Intuit Data Model**

The Quickbooks integration provides access to the following data model:

![Quickbooks Entity Relationship Diagram](docs/quickbooks-erd.svg)

The diagram shows the relationships between key Quickbooks entities including:

- Company (CompanyInfo)
- Accounts
- Customers
- Vendors
- Items
- Transactions (Invoices, Payments, Bills)
- Estimates and Purchase Orders

## Automated Email Processing

- Email received from customer triggers an Agentic Workflow routine
- Process email content from the user
- Generate all appropriate Intuit form completions
- Prepare forms for "Human in the Loop" check prior to next juncture:
  - Finalization
  - Return correspondence

## System Integration Notes

- **Quickbooks is made for accounting, SAGE is made for order taking**
- Need to review SAGE work order form structure

## Security Requirements

- **Obfuscate all potentially sensitive or permission-based financial data**

**IMPORTANT**
*July 1st*

Workflow that creates Purchases Orders for all Estimates that have reached a certain status.

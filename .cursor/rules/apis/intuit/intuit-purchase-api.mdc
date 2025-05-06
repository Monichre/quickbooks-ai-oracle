---
description: 
globs: 
alwaysApply: false
---

# Document 1: QuickBooks Online API - Purchase Entity Documentation

# Purchase

A Purchase object represents an expense, such as a purchase made from a vendor. Of note,

- You must specify an AccountRef for all purchases.
- The TotalAmt attribute must add up to sum of Line.Amount attributes.

There are three types of purchases: Cash, Check, and Credit Card.

- **Cash Purchase**: Contains information regarding a payment made in cash.
- **Check Purchase**: Contains information regarding a payment made by check.
- **Credit Card Purchase**: Contains information regarding a payment made by credit card or refunded/credited back to a credit card.

For example, to create a transaction that sends a check to a vendor, create a Purchase object with PaymentType set to Check.

## The Purchase Object

### Required Attributes

- **Id**: Unique identifier for this object (required for update, read-only, system defined)
- **Line [0..n]**: Individual line items of a transaction. Valid Line types include ItemBasedExpenseLine and AccountBasedExpenseLine
- **PaymentType**: Type can be Cash, Check, or CreditCard
- **AccountRef**: Specifies the account reference to which this purchase is applied based on the PaymentType
- **SyncToken**: Version number of the object (required for update, read-only, system defined)

### Conditionally Required

- **CurrencyRef**: Reference to the currency in which all amounts are expressed. Required if multicurrency is enabled.

### Optional Attributes

- **TxnDate**: The transaction date (defaults to current date if not supplied)
- **PrintStatus**: Applicable only for Check payments. Valid values: NotSet, NeedToPrint, PrintComplete
- **RemitToAddr**: Address to which the payment should be sent (applicable only for Check)
- **TxnSource**: Used internally to specify originating source of a credit card transaction
- **LinkedTxn [0..n]**: Zero or more transactions linked to this object
- **GlobalTaxCalculation**: Method in which tax is applied (TaxExcluded, TaxInclusive, NotApplicable)
- **TransactionLocationType**: The account location (WithinFrance, FranceOverseas, OutsideFranceWithEU, OutsideEU)
- **MetaData**: Descriptive information about the object (read-only)
- **DocNumber**: Reference number for the transaction
- **PrivateNote**: User-entered, organization-private note about the transaction
- **Credit**: False—it represents a charge. True—it represents a refund. Valid only for CreditCard payment type
- **TxnTaxDetail**: Information for taxes charged on the transaction as a whole
- **PaymentMethodRef**: Reference to a PaymentMethod associated with this transaction
- **PurchaseEx**: For internal use
- **ExchangeRate**: The number of home currency units it takes to equal one unit of currency specified by CurrencyRef
- **DepartmentRef**: A reference to a Department object specifying the location of the transaction
- **EntityRef**: Specifies the party with whom an expense is associated (Customer, Vendor, or Employee)
- **IncludeInAnnualTPAR**: Include the supplier in the annual TPAR
- **TotalAmt**: Indicates the total amount of the transaction (read-only, system defined)
- **RecurDataRef**: A reference to the Recurring Transaction (read-only)

## API Operations

### Create a Purchase

```
POST /v3/company/<realmID>/purchase
Content-Type: application/json
```

Minimum required fields:
- PaymentType
- AccountRef
- Line (with at least one line item)
- CurrencyRef (if multicurrency is enabled)

### Delete a Purchase

```
POST /v3/company/<realmID>/purchase?operation=delete
Content-Type: application/json
```

Required fields:
- Id
- SyncToken

### Query Purchases

```
GET /v3/company/<realmID>/query?query=<selectStatement>
Content-Type: application/text
```

Example query:
```
select * from Purchase where TotalAmt < '100.00'
```

### Read a Purchase

```
GET /v3/company/<realmID>/purchase/<purchaseId>
```

### Full Update a Purchase

```
POST /v3/company/<realmID>/purchase
Content-Type: application/json
```

All writable fields must be included in the request body. Fields omitted will be set to NULL.

## Sample Purchase Object

```json
{
  "Purchase": {
    "SyncToken": "0",
    "domain": "QBO",
    "PurchaseEx": {
      "any": [
        {
          "name": "{http://schema.intuit.com/finance/v3}NameValue",
          "nil": false,
          "value": {
            "Name": "TxnType",
            "Value": "54"
          },
          "declaredType": "com.intuit.schema.finance.v3.NameValue",
          "scope": "javax.xml.bind.JAXBElement$GlobalScope",
          "globalScope": true,
          "typeSubstituted": false
        }
      ]
    },
    "TxnDate": "2015-07-27",
    "TotalAmt": 10.0,
    "PaymentType": "Cash",
    "sparse": false,
    "Line": [
      {
        "DetailType": "AccountBasedExpenseLineDetail",
        "Amount": 10.0,
        "ProjectRef": {
          "value": "39298034"
        },
        "Id": "1",
        "AccountBasedExpenseLineDetail": {
          "TaxCodeRef": {
            "value": "NON"
          },
          "AccountRef": {
            "name": "Meals and Entertainment",
            "value": "13"
          },
          "BillableStatus": "NotBillable"
        }
      }
    ],
    "AccountRef": {
      "name": "Checking",
      "value": "35"
    },
    "CustomField": [],
    "Id": "252",
    "MetaData": {
      "CreateTime": "2015-07-27T10:37:26-07:00",
      "LastUpdatedTime": "2015-07-27T10:37:26-07:00"
    }
  }
}
```

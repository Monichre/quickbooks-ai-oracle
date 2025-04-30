---
description: 
globs: 
alwaysApply: false
---
# Intuit Estimate API Docs

**IMPORTANT:** Line Items on the estimate are instances ofc and has one of the following values:

- **Inventory**
- **Group**
- **Service**
- **NonInventory**

### Key Attributes

| Attribute      | Type                         | Description                                                 |
| -------------- | ---------------------------- | ----------------------------------------------------------- |
| Id             | String, filterable, sortable | Unique identifier for this object                           |
| CustomerRef    | ReferenceType, filterable    | Reference to a customer or job                              |
| SyncToken      | String                       | Version number of the object used for concurrency control   |
| TxnDate        | Date, filterable, sortable   | Transaction date                                            |
| DueDate        | Date, filterable, sortable   | Due date for the estimate                                   |
| DocNumber      | String, filterable, sortable | Reference number for the transaction                        |
| TotalAmt       | BigDecimal                   | Total amount of the transaction                             |
| Line           | Line                         | Individual line items of a transaction                      |
| BillEmail      | EmailAddress                 | Email address where the estimate is sent                    |
| BillAddr       | PhysicalAddress              | Bill-to address of the Invoice                              |
| ShipAddr       | PhysicalAddress              | Shipping address for the goods                              |
| EmailStatus    | String                       | Email status (NotSet, NeedToSend, EmailSent)                |
| PrintStatus    | String                       | Printing status (NotSet, NeedToPrint, PrintComplete)        |
| ExpirationDate | Date                         | Date by which estimate must be accepted before invalidation |
| AcceptedDate   | Date                         | Date estimate was accepted                                  |
| AcceptedBy     | String                       | Name of customer who accepted the estimate                  |
| CustomField    | CustomField                  | Up to three custom fields for the transaction               |
| Status         | String                       | Status (Accepted, Closed, Pending, Rejected, Converted)     |

## API Operations

### Create an Estimate

POST /v3/company/9341454347743701/estimate?minorversion=75

Content type:application/json
Production Base URL:https://quickbooks.api.intuit.com
Sandbox Base URL:https://sandbox-quickbooks.api.intuit.com

- An Estimate must have at least one line that describes an item
- An Estimate must have a reference to a customer
- If shipping and billing addresses aren't provided, the address from the referenced Customer object is used

#### Minimum Required Fields

- CustomerRef
- Line (SalesItemLine or GroupLine)
- CurrencyRef (if multicurrency is enabled)

### Read an Estimate

Retrieves the details of a previously created estimate.

### Query an Estimate

Returns the results of a query against estimates.

### Update an Estimate

Two update methods are available:

- **Sparse Update**: Updates only specified fields, leaving others unchanged
- **Full Update**: Requires all writable fields to be included in the request

### Delete an Estimate

Deletes the specified estimate. Requires at minimum:

- Id
- SyncToken

### Send an Estimate

Sends the estimate to the customer via email. When sent:

- EmailStatus is set to "EmailSent"
- DeliveryInfo is populated with sending information
- BillEmail.Address is updated if specified in the sendTo parameter

### Get an Estimate as PDF

Returns the specified estimate as an Adobe PDF file, formatted according to custom form styles in company settings.

## Line Item Types

Estimates can include various line item types:

- SalesItemLine
- GroupLine
- DescriptionOnlyLine
- DiscountLine
- SubTotalLine

## Notes

- If the transaction is taxable, there is a limit of 750 lines per transaction
- For international addresses, countries should be passed as 3 ISO alpha-3 characters or the full name of the country
- DocNumber is an optional field for all locales except France, where it's required if CustomTxnNumber is enabled

An estimate represents a proposal for a financial transaction. It is a document that customers can review and approve before ordering services or goods. After a customer accepts an estimate, you can convert it to an invoice.

## The estimate object

```json
{
  "DocNumber": "1001",
  "TxnDate": "2023-02-08",
  "Line": [
    {
      "LineNum": 1,
      "Description": "Professional Services",
      "Amount": 75.0,
      "DetailType": "SalesItemLineDetail",
      "SalesItemLineDetail": {
        "ItemRef": {
          "value": "1",
          "name": "Services"
        },
        "UnitPrice": 75.0,
        "Qty": 1,
        "TaxCodeRef": {
          "value": "NON"
        }
      }
    },
    {
      "Amount": 75.0,
      "DetailType": "SubTotalLineDetail",
      "SubTotalLineDetail": {}
    }
  ],
  "CustomerRef": {
    "value": "1",
    "name": "Cool Cars"
  },
  "CustomerMemo": {
    "value": "Thank you for your business and have a great day!"
  },
  "BillEmail": {
    "Address": "Cool_Cars@intuit.com"
  },
  "ShipAddr": {
    "City": "Mountain View",
    "Line1": "123 Main Street",
    "PostalCode": "94043",
    "CountrySubDivisionCode": "CA",
    "Country": "US"
  },
  "BillAddr": {
    "City": "Mountain View",
    "Line1": "123 Main Street",
    "PostalCode": "94043",
    "CountrySubDivisionCode": "CA",
    "Country": "US"
  },
  "TotalAmt": 75.0,
  "ApplyTaxAfterDiscount": false,
  "PrintStatus": "NeedToPrint",
  "EmailStatus": "NotSet",
  "ExpirationDate": "2023-03-10",
  "AcceptedBy": "John Smith",
  "AcceptedDate": "2023-02-15",
  "Id": "507",
  "SyncToken": "0",
  "MetaData": {
    "CreateTime": "2023-02-08T10:44:38-08:00",
    "LastUpdatedTime": "2023-02-08T10:44:38-08:00"
  }
}
```

## **Create an estimate**

- An Estimate must have at least one line that describes an item.
- An Estimate must have a reference to a customer.
- If shipping address and billing address are not provided, the address from the referenced Customer object is used.

### **Request Body**

The minimum elements to create an estimate are listed here.
ATTRIBUTES

- **Line**

# Line Item Format

## Required Fields

### Estimate Line Object

The minimum line item required for the request is one of the following:

- Sales item line type
- Group item line type

**SalesItemLine**

| Field                   | Requirement           | Type                | Description                                                                                                                                                                                                                                                                                       |
| :---------------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Id**                  | _Required for update_ | String              | The Id of the line item. System defined, read only. Usage in requests:<br>- If Id > 0 and exists for the company: update operation<br>- If no Id provided, Id ≤ 0, or Id > 0 but doesn't exist: create operation<br><br>Available in all objects that use lines and support the update operation. |
| **DetailType**          | _Required_            | LineDetailTypeEnum  | Set to `SalesItemLineDetail` for this type of line.                                                                                                                                                                                                                                               |
| **SalesItemLineDetail** | _Required_            | SalesItemLineDetail | Contains details specific to sales item lines.                                                                                                                                                                                                                                                    |
| **Amount**              | _Required_            | Decimal             | The amount of the line item. Max 15 digits in 10.5 format.<br>For Invoice objects in global locales: when updating Amount, remove the TxnTaxDetail element in the object before submitting it in the update request payload.                                                                      |
| **Description**         | Optional              | String              | Free form text description of the line item that appears in the printed record. Max 4000 characters.                                                                                                                                                                                              |
| **LineNum**             | Optional              | Decimal             | Specifies the position of the line in the collection of transaction lines. Positive integer.                                                                                                                                                                                                      |

**Line**

**\* Required**

**Estimate line object**

The minimum line item required for the request is one of the following. Sales item line type Group item line type

SalesItemLine

Hide child attributes

- **Id**

  **\* Required for update**

  read only

  system defined

  **String**

  The Id of the line item. Its use in requests is as folllows:

- If Idis greater than zero and exists for the company, the request is considered an update operation for a line item.
- If no Idis provided, the Idprovided is less than or equal to zero, or the Idprovided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.

Available in all objects that use lines and support the update operation.

**DetailType**

**\* Required**

**LineDetailTypeEnum**

Set to SalesItemLineDetailfor this type of line.

**SalesItemLineDetail**

**\* Required**

**SalesItemLineDetail**

Hide child attributes

- **TaxInclusiveAmt**

  Optional

  minorVersion: 1

  **Decimal**

  The total amount of the line item including tax. Constraints: Available when endpoint is evoked with the minorversion=1query parameter.

- **DiscountAmt**

  Optional

  minorVersion: 4

  **Decimal**

  The discount amount applied to this line. If both DiscountAmt and DiscountRate are supplied, DiscountRate takes precedence and DiscountAmt is recalculated by QuickBooks services based on amount of DiscountRate.

- **ItemRef**

  Optional

  **ReferenceType**

  Reference to an Item object.

- Query the Item name list resource to determine the appropriate Item object for this reference. Use Item.Id and Item.Name from that object for ItemRef.value and ItemRef.name, respectively.
- Set ItemRef.value to SHIPPING_ITEM_ID when Line.amount represents transaction-wide shipping charges. Valid when Preferences.SalesFormsPrefs.AllowShipping is set to true.
- Set ItemRef.value to GRATUITY_ITEM_ID when Line.amount represents transaction-wide gratuity amount. Valid when Preferences.OtherPrefs.Name.SalesFormsPrefs.AllowGratuity is set to true.
- When a line lacks an ItemRef it is treated as documentation and the Line.Amountattribute is ignored.
- Applicable to invoice objects, only, and when linktxn specifies a ReimburseCharge. When Item.Id is set to 1, ItemAccountRef refers to reimburse expense account Id.

For France locales: The account associated with the referenced Item object is looked up in the account category list.

- If this account has same location as specified in the transaction by the TransactionLocationType attribute and the same VAT as in the line item TaxCodeRef attribute, then the item account is used.
- If there is a mismatch, then the account from the account category list that matches the transaction location and VAT is used.
- If this account is not present in the account category list, then a new account is created with the new location, new VAT code, and all other attributes as in the default account.

Hide child attributes

- **value**

  **\* Required**

  **string**

  The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.

- **name**

  Optional

  **string**

  An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.

---

- **GroupLineDetail**

  **\* Required**

  **GroupLineDetail**

  Show child attributes

- **DetailType**

  **\* Required**

  **LineDetailTypeEnum**

  Set to GroupLineDetailfor this type of line.

- **LineNum**

  Optional

  **Decimal**

  Specifies the position of the line in the collection of transaction lines. Positive integer

- **Description**

  Optional

  max character: Max 4000 chars

  **String**

  Free form text description of the line item that appears in the printed record.

**CustomerRef**

**\* Required**

**ReferenceType** *, filterable*

Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use Customer.Id and Customer.DisplayName from that object for CustomerRef.value and CustomerRef.name, respectively.

Hide child attributes

- **value**

  **\* Required**

  **string**

  The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.

- **name**

  Optional

  **string**

  An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.

  -
  - **ProjectRef**

    **\* Conditionally required**

    minorVersion: 69

    **ReferenceType** *, filterable*

    Reference to the Project ID associated with this transaction. Available with Minor Version 69 and above

    Hide child attributes

    - **value**

      **\* Required**

      **string**

      The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.

    - **name**

      Optional

      **string**

      An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.

  - **CurrencyRef**

        *** Conditionally required**

        **CurrencyRefType**

        Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
        Multicurrency is enabled for the company if Preferences.MultiCurrencyEnabled is set to true. Read more about multicurrency support @here. Required if multicurrency is enabled for the company

        Hide child attributes 
        - **value**

          *** Required**

          **String**

          A three letter string representing the ISO 4217 code for the currency. For example, USD, AUD, EUR, and so on.
        - **name**

          Optional

          **String**

          The full name of the currency.

    **demo request body for Create**

```json
{
  "TotalAmt": 31.5,
  "BillEmail": {
    "Address": "Cool_Cars@intuit.com"
  },
  "CustomerMemo": {
    "value": "Thank you for your business and have a great day!"
  },
  "ShipAddr": {
    "City": "Half Moon Bay",
    "Line1": "65 Ocean Dr.",
    "PostalCode": "94213",
    "Lat": "37.4300318",
    "Long": "-122.4336537",
    "CountrySubDivisionCode": "CA",
    "Id": "4"
  },
  "PrintStatus": "NeedToPrint",
  "EmailStatus": "NotSet",
  "BillAddr": {
    "City": "Half Moon Bay",
    "Line1": "65 Ocean Dr.",
    "PostalCode": "94213",
    "Lat": "37.4300318",
    "Long": "-122.4336537",
    "CountrySubDivisionCode": "CA",
    "Id": "4"
  },
  "Line": [
    {
      "Description": "Pest Control Services",
      "DetailType": "SalesItemLineDetail",
      "SalesItemLineDetail": {
        "TaxCodeRef": {
          "value": "NON"
        },
        "Qty": 1,
        "UnitPrice": 35,
        "ItemRef": {
          "name": "Pest Control",
          "value": "10"
        }
      },
      "LineNum": 1,
      "Amount": 35.0,
      "Id": "1"
    },
    {
      "DetailType": "SubTotalLineDetail",
      "Amount": 35.0,
      "SubTotalLineDetail": {}
    },
    {
      "DetailType": "DiscountLineDetail",
      "Amount": 3.5,
      "DiscountLineDetail": {
        "DiscountAccountRef": {
          "name": "Discounts given",
          "value": "86"
        },
        "PercentBased": true,
        "DiscountPercent": 10
      }
    }
  ],
  "CustomerRef": {
    "name": "Cool Cars",
    "value": "3"
  },
  "TxnTaxDetail": {
    "TotalTax": 0
  },
  "ApplyTaxAfterDiscount": false
}
```

## Query an estimate

### Request

```
GET /v3/company/<realmId>/query?query=select * from Estimate where Id = '507'
```

## Read an estimate

### Request

```
GET /v3/company/<realmId>/estimate/<id>
```

### Response

```json
{
  "Estimate": {
    "DocNumber": "1001",
    "TxnDate": "2023-02-08",
    "Line": [
      {
        "LineNum": 1,
        "Description": "Professional Services",
        "Amount": 75.0,
        "DetailType": "SalesItemLineDetail",
        "SalesItemLineDetail": {
          "ItemRef": {
            "value": "1",
            "name": "Services"
          },
          "UnitPrice": 75.0,
          "Qty": 1,
          "TaxCodeRef": {
            "value": "NON"
          }
        }
      },
      {
        "Amount": 75.0,
        "DetailType": "SubTotalLineDetail",
        "SubTotalLineDetail": {}
      }
    ],
    "CustomerRef": {
      "value": "1",
      "name": "Cool Cars"
    },
    "CustomerMemo": {
      "value": "Thank you for your business and have a great day!"
    },
    "BillEmail": {
      "Address": "Cool_Cars@intuit.com"
    },
    "ShipAddr": {
      "City": "Mountain View",
      "Line1": "123 Main Street",
      "PostalCode": "94043",
      "CountrySubDivisionCode": "CA",
      "Country": "US"
    },
    "BillAddr": {
      "City": "Mountain View",
      "Line1": "123 Main Street",
      "PostalCode": "94043",
      "CountrySubDivisionCode": "CA",
      "Country": "US"
    },
    "TotalAmt": 75.0,
    "ApplyTaxAfterDiscount": false,
    "PrintStatus": "NeedToPrint",
    "EmailStatus": "NotSet",
    "ExpirationDate": "2023-03-10",
    "AcceptedBy": "John Smith",
    "AcceptedDate": "2023-02-15",
    "domain": "QBO",
    "Id": "507",
    "SyncToken": "0",
    "MetaData": {
      "CreateTime": "2023-02-08T10:44:38-08:00",
      "LastUpdatedTime": "2023-02-08T10:44:38-08:00"
    }
  },
  "time": "2023-02-08T10:44:38-08:00"
}
```

## Full update an estimate

### Request Body

```json
{
  "Id": "507",
  "SyncToken": "0",
  "Line": [
    {
      "LineNum": 1,
      "Description": "Professional Services",
      "Amount": 100.0,
      "DetailType": "SalesItemLineDetail",
      "SalesItemLineDetail": {
        "ItemRef": {
          "value": "1",
          "name": "Services"
        },
        "UnitPrice": 100.0,
        "Qty": 1,
        "TaxCodeRef": {
          "value": "NON"
        }
      }
    },
    {
      "Amount": 100.0,
      "DetailType": "SubTotalLineDetail",
      "SubTotalLineDetail": {}
    }
  ],
  "CustomerRef": {
    "value": "1",
    "name": "Cool Cars"
  },
  "ExpirationDate": "2023-04-10",
  "CustomerMemo": {
    "value": "Updated estimate for services"
  }
}
```

## Delete an estimate

### Request

```
POST /v3/company/<realmId>/estimate?operation=delete
```

### Request Body

```json
{
  "Id": "507",
  "SyncToken": "0"
}
```

```markdown
# API Explorer

## Estimate

The Estimate represents a proposal for a financial transaction from a business to a customer for goods or services proposed to be sold, including proposed pricing.

## The estimate object

**ATTRIBUTES**

-ing`, `filterable`, `sortable`

  Unique identifier for this object. Sort order is ASC by default.

- `ReferenceType`, `filterable`

  Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use `Customer.Id` and `Customer.DisplayName` from that object for `CustomerRef.value` and `CustomerRef.name`, respectively.

  Hide child attributes

  **ATTRIBUTES**

  - `string`

    The ID for the referenced object as found in the `Id` field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.

  - `string`

    An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use `Customer.DisplayName` to populate this field. Optionally returned in responses, implementation dependent.

- `String`

  Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its `SyncToken` is incremented. Attempts to modify an object specifying an older `SyncToken` fails. Only the latest version of the object is maintained by QuickBooks Online.

- `PhysicalAddress`

  Identifies the address where the goods are shipped from. For transactions without shipping, it represents the address where the sale took place.
  If automated sales tax is enabled (`Preferences.TaxPrefs.PartnerTaxEnabled` is set to true) and automated tax calculations are being used, this field is required for an acc tax calculation.
  For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.
  If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the `Line` elements of the transaction response then when the transaction was first created:

  - `Line1` and `Line2` elements are populated with the customer name and company name.
  - Original `Line1` through `Line 5` contents, `City`, `SubDivisionCode`, and `PostalCode` flow into `Line3` through `Line5` as a free format strings.

- `CurrencyRefType`

  Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company. Multicurrency is enabled for the company if `Preferences.MultiCurrencyEnabled` is set to true. Read more about multicurrency support @here. Required if multicurrency is enabled for the company.

- `GlobalTaxCalculationEnum`

  TaxExcluded Method in which tax is applied. Allowed values are: `TaxExcluded`, `TaxInclusive`, and `NotApplicable`. Not applicable to US companies; required for non-US companies.

- `ReferenceType`, `filterable`

  Reference to the Project ID associated with this transaction. Available with Minor Version 69 and above

- `EmailAddress`

  Identifies the e-mail address where the estimate is sent. If `EmailStatus=NeedToSend`, `BillEmail` is a required input.

- `Date`, `filterable`, `sortable`

  The date entered by the user when this transaction occurred. For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
  Sort order is ASC by default.

- `Date`

  Date for delivery of goods or services.

- `ReferenceType`

  Reference to the Class associated with the transaction. Available if `Preferences.AccountingInfoPrefs.ClassTrackingPerTxn` is set to true. Query the Class name list resource to determine the appropriate Class object for this reference. Use `Class.Id` and `Class.Name` from that object for `ClassRef.value` and `ClassRef.name`, respectively.

- `String`

  Printing status of the invoice. Valid values: `NotSet`, `NeedToPrint`, `PrintComplete`.

- `CustomField`

  One of, up to three custom fields for the transaction. Available for custom fields so configured for the company. Check `Preferences.SalesFormsPrefs.CustomField` and `Preferences.VendorAndPurchasesPrefs.POCustomField` for custom fields currenly configured. @Click here to learn about managing custom fields.

- `ReferenceType`

  Reference to the sales term associated with the transaction. Query the Term name list resource to determine the appropriate Term object for this reference. Use `Term.Id` and `Term.Name` from that object for `SalesTermRef.value` and `SalesTermRef.name`, respectively.

- `String`

  One of the following status settings: `Accepted`, `Closed`, `Pending`, `Rejected`, `Converted`

- `LinkedTxn`

  Zero or more Invoice objects related to this transaction. Use `LinkedTxn.TxnId` as the ID in a separate Invoice read request to retrieve details of the linked object.

- `Date`

  Date estimate was accepted.

- `Date`

  Date by which estimate must be accepted before invalidation.

- `String`

  The account location. Valid values include:

  - `WithinFrance`
  - `FranceOverseas`
  - `OutsideFranceWithEU`
  - `OutsideEU`

  For France locales, only.

- `Date`, `filterable`, `sortable`

  Date when the payment of the transaction is due.rovided, the number of days specified in `SalesTermRef` added the transaction date will be used.

- `ModificationMetaData`

  Descriptive information about the object. The `MetaData` values are set by Data Services and are read only for all applications.

- `String`, `filterable`, `sortable`

  Reference number for the transaction. If not explicitly provided at create time, this field is populated based on the setting of `Preferences:CustomTxnNumber` as follows:

  - If `Preferences:CustomTxnNumber` is true a custom value can be provided. If no value is supplied, the resulting `DocNumber` is null.
  - If `Preferences:CustomTxnNumber` is false, resulting `DocNumber` is system generated by incrementing the last number by 1.

  If `Preferences:CustomTxnNumber` is false then do not send a value as it can lead to unwanted duplicates. If a `DocNumber` value is sent for an Update operation, then it just updates that particular invoice and does not alter the internal system `DocNumber`.
  _Note:_ `DocNumber` is an optional field for all locales except France. For France locale if `Preferences:CustomTxnNumber` is enabled it will **not** be automatically generated and is a required field.

- `String`

  User entered, organization-private note about the transaction. This note does not appear on the invoice to the customer. This field maps to the Memo field on the Invoice form.

- `Line`

  Individual line items of a transaction. Valid `Line` types include: `SalesItemLine`, `GroupLine`, `DescriptionOnlyLine` (also used for inline Subtotal lines), `DiscountLine` and `SubTotalLine` (used for the overall transaction). If the transaction is taxable there is a limit of 750 lines per transaction.

  `SalesItemLine`

  Show child attributes

  `GroupLine`

  Show child attributes

  `DescriptionOnlyLine`

  Show child attributes

  `DiscountLine`

  Show child attributes

  `SubTotalLine`

  Show child attributes

- `MemoRef`

  User-entered message to the customer; this message is visible to end user on their transactions.

- `String`

  Email status of the invoice. Valid values: `NotSet`, `NeedToSend`, `EmailSent`

- `TxnTaxDetail`

  This data type provides information for taxes charged on the transaction as a whole. It captures the details sales taxes calculated for the transaction based on the tax codes referenced by the transaction. This can be calculated by QuickBooks business logic or you may supply it when adding a transaction. See @Global tax model for more information about this element. If sales tax is disabled (`Preferences.TaxPrefs.UsingSalesTax` is set to false) then `TxnTaxDetail` is ignored and not stored.

- `String`

  Name of customer who accepted the estimate.

- `Decimal`

  The number of home currency units it takes to equal one unit of currency specified by `CurrencyRef`. Applicable if multicurrency is enabled for the company.

- `PhysicalAddress`

  Identifies the address where the goods must be shipped. If `ShipAddr` is not specified, and a default `Customer:ShippingAddr` is specified in QuickBooks for this customer, the default ship-to address will be used by QuickBooks.
  For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.
  If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the `Line` elements of the transaction response then when the transaction was first created:

  - `Line1` and `Line2` elements are populated with the customer name and company name.
  - Original `Line1` through `Line 5` contents, `City`, `SubDivisionCode`, and `PostalCode` flow into `Line3` through `Line5` as a free format strings.

  **AFTER CREATE**

  - Customer name

    determine from `CustomerRef` element

  - Company name

    determine from `CustomerRef`

  **ALine3..5`

    address 1..5, city, subdivision code, postal code

  - Customer name

    determine from `CustomerRef` element

  - Company name

    determine from `CustomerRef` element

- `ReferenceType`

  A reference to a Department object specifying the location of the transaction. Available if `Preferences.AccountingInfoPrefs.TrackDepartments` is set to true. Query the Department name list resource to determine the appropriate department object for this reference. Use `Department.Id` and `Department.Name` from that object for `DepartmentRef.value` and `DepartmentRef.name`, respectively.

- `ReferenceType`

  Reference to the ShipMethod associated with the transaction. There is no shipping method list. Reference resolves to a string. Reference to the ShipMethod associated with the transaction. There is no shipping method list. Reference resolves to a string.

- `PhysicalAddress`

  Bill-to address of the Invoice. If `BillAddr` is not specified, and a default `Customer:BillingAddr` is specified in QuickBooks for this customer, the default bill-to address is used by QuickBooks.
  For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.
  If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the `Line` elements of the transaction response then when the transaction was first created:

  - `Line1` and `Line2` elements are populated with the customer name and company name.
  - Original `Line1` through `Line 5` contents, `City`, `SubDivisionCode`, and `PostalCode` flow into `Line3` through `Line5` as a free format strings.

- `Boolean`

  If false or null, calculate the sales tax first, and then apply the discount. If true, subtract the discount first and then calculate the sales tax.

- `BigDecimal`

  Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.

- `ReferenceType`

  A reference to the Recurring Transaction. It captures what recurring transaction template the Estimate was created from.

- `ReferenceType`

  Reference to the `TaxExepmtion` ID associated with this object. Available for companies that @automated sales tax enabled.

  - `TaxExemptionRef.Name`: The Tax Exemption Id for the customer to which this object is associated. This Id is typically issued by the state.
  - `TaxExemptionRef.value`: The system-generated Id of the exemption type.

  For internal use only.

- `Decimal`

  Total amount of the transaction in the home currency. Includes the total of all the charges, allowances and taxes. Calculated by QuickBooks business logic. Value is valid only when `CurrencyRef` is specified. Applicable if multicurrency is enabled for the company.

- `Boolean`

  Denotes how `ShipAddr` is stored: formatted or unformatted. The value of this flag is system defined based on format of shipping address at object create time.

  - If set to false, shipping address is returned in a formatted style using City, Country, `CountrySubDivisionCode`, Postal code.
  - If set to true, shipping address is returned in an unformatted style using `Line1` through `Line5` attributes.

## Create an estimate

- An Estimate must have at least one line that describes an item.
- An Estimate must have a reference to a customer.
- If shipping address and billing address are not provided, the address from the referenced Customer object is used.

### Request Body

The minimum elements to create an estimate are listed here.

**ATTRIBUTES**

- Estimate line object

  The minimum line item required for the request is one of the following. Sales item line type Group item line type

  `SalesItemLine`

  Show child attributes

  `GroupLine`

  Show child attributes

- `ReferenceType`, `filterable`

  Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use `Customer.Id` and `Customer.DisplayName` from that object for `CustomerRef.value` and `CustomerRef.name`, respectively.

- `ReferenceType`, `filterable`


    Reference to the Project ID associated with this transaction. Available with Minor Version 69 and above

- `CurrencyRefType`

  Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
  Multicurrency is enabled for the company if `Preferences.MultiCurrencyEnabled` is set to true. Read more about multicurrency support @here. Required if multicurrency is enabled for the company

### Returns

The estimate response body.

**Request URL**

Select the **sandbox company and minor version** from the dropdowns at the top of the page, **modify the request body** sample and hit the **Try It button** to try the API against a particular company/minor version .

;

## Delete an estimate

This operation deletes the estimate object specified in the request body. Include a minimum of `Estimate.Id` and `Estimate.SyncToken` in the request body.

### Request Body

**ATTRIBUTES**

- `String`

  Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its `SyncToken` is incremented. Attempts to modify an object specifying an older `SyncToken` fails. Only the latest version of the object is maintained by QuickBooks Online.

- `String`, `filterable`, `sortable`

  Unique identifier for this object.

### Returns

Returns the delete response.

Copied!

**Request URL**

Select the **sandbox company and minor version** from the dropdowns at the top of the page, **modify the request body** sample and hit the **Try It button** to try the API against a particular company/minor version .

;

## Get an estimate as PDF

### Returns

This resource returns the specified object in the response body as an Adobe Portable Document Format (PDF) file. The resulting PDF file is formatted according to custom form styles in the company settings.

Copied!

**Request URL**

Select the **sandbox company and minor version** from the dropdowns at the top of the page, **modify the request body** sample and hit the **Try It button** to try the API against a particular company/minor version .

;

## Query an estimate

### Returns

Returns the results of the query.

Copied!

**Request URL**

Select the **sandbox company and minor version** from the dropdowns at the top of the page, **modify the request body** sample and hit the **Try It button** to try the API against a particular company/minor version .

;

## Read an estimate

Retrieves the details of an estimate that has been previously created.

### Returns

The estimate response body.

## Send an estimate

- The `Estimate.EmailStatus` parameter is set to `EmailSent`.
- The `Estimate.DeliveryInfo` element is populated with sending information.
- The `Estimate.BillEmail.Address` parameter is updated to the address specified with the value of the sendTo query parameter, if specified.

### Returns

The estimate response body.

Copied!

**Request URL**

Select the **sandbox company and minor version** from the dropdowns at the top of the page, **modify the request body** sample and hit the **Try It button** to try the API against a particular company/minor version .

;

## Sparse update an estimate

Sparse updating provide ability to update a subset of properties for a given object; only elements specified in the request are updated. Missing elements are left untouched. The ID of the object to update is specified in the request body.

### Request Body

**ATTRIBUTES**

- `String`, `filterable`, `sortable`

  Unique identifier for this object. Sort order is ASC by default.

- `ReferenceType`, `filterable`

  Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use `Customer.Id` and `Customer.DisplayName` from that object for `CustomerRef.value` and `CustomerRef.name`, respectively.

- `String`

  Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its `SyncToken` is incremented. Attempts to modify an object specifying an older `SyncToken` fails. Only the latest version of the object is maintained by QuickBooks Online.

- `PhysicalAddress`

  Identifies the address where the goods are shipped from. For transactions without shipping, it represents the address where the sale took place.
  If automated sales tax is enabled (`Preferences.TaxPrefs.PartnerTaxEnabled` is set to true) and automated tax calculations are being used, this field is required for an accurate sales tax calculation.
  For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.
  If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the `Line` elements of the transaction response then wnsaction was first created:

  - `Line1` and `Line2` elements are populated with the customer name and company name.
  - Original `Line1` through `Line 5` contents, `City`, `SubDivisionCode`, and `PostalCode` flow into `Line3` through `Line5` as a free format strings.

- `CurrencyRefType`

  Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company. Multicurrency is enabled for the company if `Preferences.MultiCurrencyEnabled` is set to true. Read more about multicurrency support @here. Required if multicurrency is enabled for the company.

- `GlobalTaxCalculationEnum`

  TaxExcluded Method in which tax is applied. Allowed values are: `TaxExcluded`, `TaxInclusive`, and `NotApplicable`. Not applicable to US companies; required for non-US companies.

- `ReferenceType`, `filterable`


    Reference to the Project ID associated with this transaction. Available with Minor Version 69 and above

- `EmailAddress`

  Identifies the e-mail address where the estimate is sent. If `EmailStatus=NeedToSend`, `BillEmail` is a required input.

- `Date`, `filterable`, `sortable`

  The date entered by the user when this transaction occurred. For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
  Sort order is ASC by default.

- `Date`

  Date for delivery of goods or services.

- `ReferenceType`

  Reference to the Class associated with the transaction. Available if `Preferences.AccountingInfoPrefs.ClassTrackingPerTxn` is set to true. Query the Class name list resource to determine the appropriate Class object for this reference. Use `Class.Id` and `Class.Name` from that object for `ClassRef.value` and `ClassRef.name`, respectively.

- `String`

  Printing status of the invoice. Valid values: `NotSet`, `NeedToPrint`, `PrintComplete`.

- `CustomField`

  One of, up to three custom fields for the transaction. Available for custom fields so configured for the company. Check `Preferences.SalesFormsPrefs.CustomField` and `Preferences.VendorAndPurchasesPrefs.POCustomField` for custom fields currenly configured. @Click here to learn about managing custom fields.

- `ReferenceType`

  Reference to the sales term associated with the transaction. Query the Term name list resource to determine the appropriate Term object for this reference. Use `Term.Id` and `Term.Name` from that object for `SalesTermRef.value` and `SalesTermRef.name`, respectively.

- `String`

  One of the following status settings: `Accepted`, `Closed`, `Pending`, `Rejected`, `Converted`

- `LinkedTxn`

  Zero or more Invoice objects related to this transaction. Use `LinkedTxn.TxnId` as the ID in a separate Invoice read request to retrieve details of the linked object.

- `Date`

  Date estimate was accepted.

- `Date`

  Date by which estimate must be accepted before invalidation.

- `String`

  The account location. Valid values include:

  - `WithinFrance`
  - `FranceOverseas`
  - `OutsideFranceWithEU`
  - `OutsideEU`

  For France locales, only.

- `Date`, `filterable`, `sortable`

  Date when the payment of the transaction is due. If date is not provided, the number of days specified in `SalesTermRef` added the transaction date will be used.

- `ModificationMetaData`

  Descriptive information about the object. The `MetaData` values are set by Data Services and are read only for all applications.

- `String`, `filterable`, `sortable`

  Reference number for the transaction.y provided at create time, this field is populated based on the setting of `Preferences:CustomTxnNumber` as follows:

  - If `Preferences:CustomTxnNumber` is true a custom value can be provided. If no value is supplied, the resulting `DocNumber` is null.
  - If `Preferences:CustomTxnNumber` is false, resulting `DocNumber` is system generated by incrementing the last number by 1.

  If `Preferences:CustomTxnNumber` is false then do not send a value as it can lead to unwanted duplicates. If a `DocNumber` value is sent for an Update operation, then it just updates that particular invoice and does not alter the internal system `DocNumber`.
  _Note:_ `DocNumber` is an optional field for all locales except France. For France locale if `Preferences:CustomTxnNumber` is enabled it will **not** be automatically generated and is a required field.

- `String`

  User entered, organization-private note about the transaction. This note does not appear on the invoice to the customer. This field maps to the Memo field on the Invoice form.

- `Line`

  Individual line items of a transaction. Valid `Line` types include: `SalesItemLine`, `GroupLine`, `DescriptionOnlyLine` (also used for inline Subtotal lines), `DiscountLine` and `SubTotalLine` (used for the overall transaction). If the transaction is taxable there is a limit of 750 lines per transaction.

  `SalesItemLine`

  Show child attributes

  `GroupLine`

  Show child attributes

  `DescriptionOnlyLine`

  Show child attributes

  `DiscountLine`

  Show child attributes

  `SubTotalLine`

  Show child attributes

- `MemoRef`

  User-entered message to the customer; this message is visible to end user on their transactions.

- `String`

  Email status of the invoice. Valid values: `NotSet`, `NeedToSend`, `EmailSent`

- `TxnTaxDetail`

  This data type provides information for taxes charged on the transaction as a whole. It captures the details sales taxes calculated for the transaction based on the tax codes referenced by the transaction. This can be calculated by QuickBooks business logic or you may supply it when adding a transaction. See @Global tax model for more information about this element. If sales tax is disabled (`Preferences.TaxPrefs.UsingSalesTax` is set to false) then `TxnTaxDetail` is ignored and not stored.

- `String`

  Name of customer who accepted the estimate.

- `Decimal`

  The number of home currency units it takes to equal one unit of currency specified by `CurrencyRef`. Applicable if multicurrency is enabled for the company.

- `PhysicalAddress`

  Identifies the address where the goods must be shipped. If `ShipAddr` is not specified, and a default `Customer:ShippingAddr` is specified in QuickBooks for this customer, the default ship-to address will be used by QuickBooks.
  For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.
  If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the `Line` elements of the transaction response then when the transaction was first created:

  - `Line1` and `Line2` elements are populated with the customer name and company name.
  - Original `Line1` through `Line 5` contents, `City`, `SubDivisionCode`, and `PostalCode` flow into `Line3` through `Line5` as a free format strings.

- `ReferenceType`

  A reference to a Department object specifying the location of the transaction.rences.AccountingInfoPrefs.TrackDepartments` is set to true. Query the Department name list resource to determine the appropriate department object for this reference. Use `Department.Id` and `Department.Name` from that object for `DepartmentRef.value` and `DepartmentRef.name`, respectively.

- `ReferenceType`

  Reference to the ShipMethod associated with the transaction. There is no shipping method list. Reference resolves to a string. Reference to the ShipMethod associated with the transaction. There is no shipping method list. Reference resolves to a string.

- `PhysicalAddress`

  Bill-to address of the Invoice. If `BillAddr` is not specified, and a default `Customer:BillingAddr` is specified in QuickBooks for this customer, the default bill-to address is used by QuickBooks.
  For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.
  If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the `Line` elements of the transaction response then when the transaction was first created:

  - `Line1` and `Line2` elements are populated with the customer name and company name.
  - Original `Line1` through `Line 5` contents, `City`, `SubDivisionCode`, and `PostalCode` flow into `Line3` through `Line5` as a free format strings.

- `Boolean`

  If false or null, calculate the sales tax first, and then apply the discount. If true, subtract the discount first and then calculate the sales tax.

- `BigDecimal`

  Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.

- `ReferenceType`

  A reference to the Recurring Transaction. It captures what recurring transaction template the Estimate was created from.

- `ReferenceType`

  Reference to the `TaxExepmtion` ID associated with this object. Available for companies that have @automated sales tax enabled.

  - `TaxExemptionRef.Name`: The Tax Exemption Id for the customer to which this object is associated. This Id is typically issued by the state.
  - `TaxExemptionRef.value`: The system-generated Id of the exemption type.

  For internal use only.

- `Decimal`

  Total amount of the transaction in the home currency. Includes the total of all the charges, allowances and taxes. Calculated by QuickBooks business logic. Value is valid only when `CurrencyRef` is specified. Applicable if multicurrency is enabled for the company.

- `Boolean`

  Denotes how `ShipAddr` is stored: formatted or unformatted. The value of this flag is system defined based on format of shipping address at object create time.

  - If set to false, shipping address is returned in a formatted style using City, Country, `CountrySubDivisionCode`, Postal code.
  - If set to true, shipping address is returned in an unformatted style using `Line1` through `Line5` attributes.

### Returns

The estimate response body.

Copied!

**Request URL**

Select the **sandbox company and minor version** from the dropdowns at the top of the page, **modify the request body** sample and hit the **Try It button** to try the API against a particular company/minor version .

;

## Full update an estimate

Use this operation to update any of the writable fields of an existing estimate object. The request body must include all writable fields of the existing object as returned in a read response. Writable fields omitted from the request body are set to NULL. The ID of the object to update is specified in the request body.

### Request Body

**ATTRIBUTES**

- `Str `filterable`, `sortable`

  Unique identifier for this object. Sort order is ASC by default.

- `ReferenceType`, `filterable`

  Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use `Customer.Id` and `Customer.DisplayName` from that object for `CustomerRef.value` and `CustomerRef.name`, respectively.

- `String`

  Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its `SyncToken` is incremented. Attempts to modify an object specifying an older `SyncToken` fails. Only the latest version of the object is maintained by QuickBooks Online.

- `PhysicalAddress`

  Identifies the address where the goods are shipped from. For transactions without shipping, it represents the address where the sale took place.
  If automated sales tax is enabled (`Preferences.TaxPrefs.PartnerTaxEnabled` is set to true) and automated tax calculations are being used, this field is required for an accurate sales tax calculation.
  For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.
  If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the `Line` elements of the transaction response then when the transaction was first created:

  - `Line1` and `Line2` elements are populated with the customer name and company name.
  - Original `Line1` through `Line 5` contents, `City`, `SubDivisionCode`, and `PostalCode` flow into `Line3` through `Line5` as a frerings.

- `CurrencyRefType`

  Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company. Multicurrency is enabled for the company if `Preferences.MultiCurrencyEnabled` is set to true. Read more about multicurrency support @here. Required if multicurrency is enabled for the company.

- `GlobalTaxCalculationEnum`

  TaxExcluded Method in which tax is applied. Allowed values are: `TaxExcluded`, `TaxInclusive`, and `NotApplicable`. Not applicable to US companies; required for non-US companies.

- `ReferenceType`, `filterable`


    Reference to the Project ID associated with this transaction. Available with Minor Version 69 and above

- `EmailAddress`

  Identifies the e-mail address where the estimate is sent. If `EmailStatus=NeedToSend`, `BillEmail` is a required input.

- `Date`, `filterable`, `sortable`

  The date entered by the user when this transaction occurred. For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
  Sort order is ASC by default.

- `Date`

  Date for delivery of goods or services.

- `ReferenceType`

  Reference to the Class associated with the transaction. Available if `Preferences.AccountingInfoPrefs.ClassTrackingPerTxn` is set to true. Query the Class name list resource to determine the appropriate Class object for this reference. Use `Class.Id` and `Class.Name` from that object for `ClassRef.value` and `ClassRef.name`, respectively.

- `String`

  Printing status of the invoice. Valid values: `NotSet`, `NeedToPrint`, `PrintComplete`.

- `CustomField`

  One of, up to three custom fields for the transaction. Available for custom fields so configured for the company. Check `Preferences.SalesFormsPrefs.CustomField` and `Preferences.VendorAndPurchasesPrefs.POCustomField` for custom fields currenly configured. @Click here to learn about managing custom fields.

- `ReferenceType`

  Reference to the sales term associated with the transaction. Query the Term name list resource to determine the appropriate Term object for this reference. Use `Term.Id` and `Term.Name` from that object for `SalesTermRef.value` and `SalesTermRef.name`, respectively.

- `String`

  One of the following status settings: `
```

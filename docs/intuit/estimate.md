# Estimate

The Estimate represents a proposal for a financial transaction from a business to a customer for goods or services proposed to be sold, including proposed pricing.

## The Estimate Object

### ATTRIBUTES

- **Id** (*Required for update, read only, system defined*)
  - String, filterable, sortable
  - Unique identifier for this object. Sort order is ASC by default.

- **CustomerRef** (*Required*)
  - ReferenceType, filterable
  - Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use Customer.Id and Customer.DisplayName from that object for CustomerRef.value and CustomerRef.name, respectively.

- **SyncToken** (*Required for update, read only, system defined*)
  - String
  - Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its SyncToken is incremented. Attempts to modify an object specifying an older SyncToken fails. Only the latest version of the object is maintained by QuickBooks Online.

- **ShipFromAddr** (*Conditionally required, minorVersion: 35*)
  - PhysicalAddress
  - Identifies the address where the goods are shipped from. For transactions without shipping, it represents the address where the sale took place.
  - If automated sales tax is enabled (Preferences.TaxPrefs.PartnerTaxEnabled is set to true) and automated tax calculations are being used, this field is required for an accurate sales tax calculation.
  - For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.
  - If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:
    - Line1 and Line2 elements are populated with the customer name and company name.
    - Original Line1 through Line 5 contents, City, SubDivisionCode, and PostalCode flow into Line3 through Line5 as free format strings.

- **CurrencyRef** (*Conditionally required*)
  - CurrencyRefType
  - Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
  - Multicurrency is enabled for the company if Preferences.MultiCurrencyEnabled is set to true. Read more about multicurrency support [here](https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies "Currency"). Required if multicurrency is enabled for the company.

- **GlobalTaxCalculation** (*Conditionally required*)
  - GlobalTaxCalculationEnum
  - TaxExcluded Method in which tax is applied. Allowed values are: TaxExcluded, TaxInclusive, and NotApplicable. Not applicable to US companies; required for non-US companies.

- **ProjectRef** (*Conditionally required, minorVersion: 69*)
  - ReferenceType, filterable
  - Reference to the Project ID associated with this transaction. Available with Minor Version 69 and above

- **BillEmail** (*Conditionally required*)
  - EmailAddress
  - Identifies the e-mail address where the estimate is sent. If EmailStatus=NeedToSend, BillEmail is a required input.

- **TxnDate** (Optional)
  - Date, filterable, sortable
  - The date entered by the user when this transaction occurred. For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used. Sort order is ASC by default.

- **ShipDate** (Optional)
  - Date
  - Date for delivery of goods or services.

- **ClassRef** (Optional)
  - ReferenceType
  - Reference to the Class associated with the transaction. Available if Preferences.AccountingInfoPrefs.ClassTrackingPerTxn is set to true. Query the Class name list resource to determine the appropriate Class object for this reference. Use Class.Id and Class.Name from that object for ClassRef.value and ClassRef.name, respectively.

- **PrintStatus** (Optional)
  - String
  - Printing status of the invoice. Valid values: NotSet, NeedToPrint, PrintComplete.

- **CustomField** (Optional)
  - CustomField
  - One of, up to three custom fields for the transaction. Available for custom fields so configured for the company. Check Preferences.SalesFormsPrefs.CustomField and Preferences.VendorAndPurchasesPrefs.POCustomField for custom fields currently configured. [Click here](https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/create-custom-fields "Custom Fields") to learn about managing custom fields.

- **SalesTermRef** (Optional)
  - ReferenceType
  - Reference to the sales term associated with the transaction. Query the Term name list resource to determine the appropriate Term object for this reference. Use Term.Id and Term.Name from that object for SalesTermRef.value and SalesTermRef.name, respectively.

- **TxnStatus** (Optional)
  - String
  - One of the following status settings: Accepted, Closed, Pending, Rejected, Converted

- **LinkedTxn [0..n]** (Optional)
  - LinkedTxn
  - Zero or more Invoice objects related to this transaction. Use LinkedTxn.TxnId as the ID in a separate Invoice read request to retrieve details of the linked object.

- **AcceptedDate** (Optional)
  - Date
  - Date estimate was accepted.

- **ExpirationDate** (Optional)
  - Date
  - Date by which estimate must be accepted before invalidation.

- **TransactionLocationType** (Optional, minorVersion: 4)
  - String
  - The account location. Valid values include:
    - WithinFrance
    - FranceOverseas
    - OutsideFranceWithEU
    - OutsideEU
  - For France locales, only.

- **DueDate** (Optional)
  - Date, filterable, sortable
  - Date when the payment of the transaction is due. If date is not provided, the number of days specified in SalesTermRef added the transaction date will be used.

- **MetaData** (Optional)
  - ModificationMetaData
  - Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.

- **DocNumber** (Optional)
  - String, filterable, sortable (maximum of 21 chars)
  - Reference number for the transaction. If not explicitly provided at create time, this field is populated based on the setting of Preferences:CustomTxnNumber as follows:
    - If Preferences:CustomTxnNumber is true a custom value can be provided. If no value is supplied, the resulting DocNumber is null.
    - If Preferences:CustomTxnNumber is false, resulting DocNumber is system generated by incrementing the last number by 1.
  - If Preferences:CustomTxnNumber is false then do not send a value as it can lead to unwanted duplicates. If a DocNumber value is sent for an Update operation, then it just updates that particular invoice and does not alter the internal system DocNumber.
  - *Note:* DocNumber is an optional field for all locales except France. For France locale if Preferences:CustomTxnNumber is enabled it will **not** be automatically generated and is a required field.

- **PrivateNote** (Optional)
  - String (Max of 4000 chars)
  - User entered, organization-private note about the transaction. This note does not appear on the invoice to the customer. This field maps to the Memo field on the Invoice form.

- **Line [0..n]** (Optional)
  - Line
  - Individual line items of a transaction. Valid Line types include: SalesItemLine, GroupLine, DescriptionOnlyLine (also used for inline Subtotal lines), DiscountLine and SubTotalLine (used for the overall transaction). If the transaction is taxable there is a limit of 750 lines per transaction.

- **CustomerMemo** (Optional)
  - MemoRef
  - User-entered message to the customer; this message is visible to end user on their transactions.

- **EmailStatus** (Optional)
  - String
  - Email status of the invoice. Valid values: NotSet, NeedToSend, EmailSent

- **TxnTaxDetail** (Optional)
  - TxnTaxDetail
  - This data type provides information for taxes charged on the transaction as a whole. It captures the details sales taxes calculated for the transaction based on the tax codes referenced by the transaction. This can be calculated by QuickBooks business logic or you may supply it when adding a transaction. See [Global tax model](https://developer.intuit.com/app/developer/qbo/docs/workflows/manage-sales-tax-for-non-us-locales "Global Tax Model") for more information about this element. If sales tax is disabled (Preferences.TaxPrefs.UsingSalesTax is set to false) then TxnTaxDetail is ignored and not stored.

- **AcceptedBy** (Optional)
  - String
  - Name of customer who accepted the estimate.

- **ExchangeRate** (Optional)
  - Decimal
  - The number of home currency units it takes to equal one unit of currency specified by CurrencyRef. Applicable if multicurrency is enabled for the company.

- **ShipAddr** (Optional)
  - PhysicalAddress
  - Identifies the address where the goods must be shipped. If ShipAddr is not specified, and a default Customer:ShippingAddr is specified in QuickBooks for this customer, the default ship-to address will be used by QuickBooks.
  - For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.
  - If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:
    - Line1 and Line2 elements are populated with the customer name and company name.
    - Original Line1 through Line 5 contents, City, SubDivisionCode, and PostalCode flow into Line3 through Line5 as free format strings.

- **DepartmentRef** (Optional)
  - ReferenceType
  - A reference to a Department object specifying the location of the transaction. Available if Preferences.AccountingInfoPrefs.TrackDepartments is set to true. Query the Department name list resource to determine the appropriate department object for this reference. Use Department.Id and Department.Name from that object for DepartmentRef.value and DepartmentRef.name, respectively.

- **ShipMethodRef** (Optional)
  - ReferenceType
  - Reference to the ShipMethod associated with the transaction. There is no shipping method list. Reference resolves to a string. Reference to the ShipMethod associated with the transaction. There is no shipping method list. Reference resolves to a string.

- **BillAddr** (Optional)
  - PhysicalAddress
  - Bill-to address of the Invoice. If BillAddr is not specified, and a default Customer:BillingAddr is specified in QuickBooks for this customer, the default bill-to address is used by QuickBooks.
  - For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.
  - If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:
    - Line1 and Line2 elements are populated with the customer name and company name.
    - Original Line1 through Line 5 contents, City, SubDivisionCode, and PostalCode flow into Line3 through Line5 as free format strings.

- **ApplyTaxAfterDiscount** (Optional)
  - Boolean
  - If false or null, calculate the sales tax first, and then apply the discount. If true, subtract the discount first and then calculate the sales tax.

- **TotalAmt** (read only, system defined)
  - BigDecimal
  - Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.

- **RecurDataRef** (read only, minorVersion: 52)
  - ReferenceType
  - A reference to the Recurring Transaction. It captures what recurring transaction template the Estimate was created from.

- **TaxExemptionRef** (read only, minorVersion: 21, system defined)
  - ReferenceType
  - Reference to the TaxExemption ID associated with this object. Available for companies that have [automated sales tax](https://developer.intuit.com/hub/blog/2017/12/11/using-quickbooks-online-api-automated-sales-tax "Automatic Sales Tax") enabled.
  - TaxExemptionRef.Name: The Tax Exemption Id for the customer to which this object is associated. This Id is typically issued by the state.
  - TaxExemptionRef.value: The system-generated Id of the exemption type.
  - For internal use only.

- **HomeTotalAmt** (read only, system defined)
  - Decimal
  - Total amount of the transaction in the home currency. Includes the total of all the charges, allowances and taxes. Calculated by QuickBooks business logic. Value is valid only when CurrencyRef is specified. Applicable if multicurrency is enabled for the company.

- **FreeFormAddress** (system defined)
  - Boolean
  - Denotes how ShipAddr is stored: formatted or unformatted. The value of this flag is system defined based on format of shipping address at object create time.
    - If set to false, shipping address is returned in a formatted style using City, Country, CountrySubDivisionCode, Postal code.
    - If set to true, shipping address is returned in an unformatted style using Line1 through Line5 attributes.

### SAMPLE OBJECT

```json
{
  "Estimate": {
    "DocNumber": "1001",
    "SyncToken": "0",
    "domain": "QBO",
    "TxnStatus": "Pending",
    "BillEmail": {
      "Address": "Cool_Cars@intuit.com"
    },
    "TxnDate": "2015-03-26",
    "TotalAmt": 31.5,
    "CustomerRef": {
      "name": "Cool Cars",
      "value": "3"
    },
    "CustomerMemo": {
      "value": "Thank you for your business and have a great day!"
    },
    "ShipAddr": {
      "CountrySubDivisionCode": "CA",
      "City": "Half Moon Bay",
      "PostalCode": "94213",
      "Id": "104",
      "Line1": "65 Ocean Dr."
    },
    "ProjectRef": {
      "value": "39298034"
    },
    "PrintStatus": "NeedToPrint",
    "BillAddr": {
      "CountrySubDivisionCode": "CA",
      "City": "Half Moon Bay",
      "PostalCode": "94213",
      "Id": "103",
      "Line1": "65 Ocean Dr."
    },
    "sparse": false,
    "EmailStatus": "NotSet",
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
    "ApplyTaxAfterDiscount": false,
    "CustomField": [
      {
        "DefinitionId": "1",
        "Type": "StringType",
        "Name": "Crew #"
      }
    ],
    "Id": "177",
    "TxnTaxDetail": {
      "TotalTax": 0
    },
    "MetaData": {
      "CreateTime": "2015-03-26T13:25:05-07:00",
      "LastUpdatedTime": "2015-03-26T13:25:05-07:00"
    }
  },
  "time": "2015-03-26T13:25:05.473-07:00"
}
```

## Create an Estimate

- An Estimate must have at least one line that describes an item.
- An Estimate must have a reference to a customer.
- If shipping address and billing address are not provided, the address from the referenced Customer object is used.

### Request Body

The minimum elements to create an estimate are listed here.

#### ATTRIBUTES

- **Line** (*Required*)
  - Estimate line object
  - The minimum line item required for the request is one of the following:
    - Sales item line type
    - Group item line type

- **CustomerRef** (*Required*)
  - ReferenceType, filterable
  - Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use Customer.Id and Customer.DisplayName from that object for CustomerRef.value and CustomerRef.name, respectively.

- **ProjectRef** (*Conditionally required, minorVersion: 69*)
  - ReferenceType, filterable
  - Reference to the Project ID associated with this transaction. Available with Minor Version 69 and above

- **CurrencyRef** (*Conditionally required*)
  - CurrencyRefType
  - Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
  - Multicurrency is enabled for the company if Preferences.MultiCurrencyEnabled is set to true. Read more about multicurrency support [here](https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies "Currency"). Required if multicurrency is enabled for the company

### Returns

The estimate response body.

#### Request URL

```
POST /v3/company/<realmID>/estimate
Contenttype:application/json
ProductionBaseURL:https://quickbooks.api.intuit.com
SandboxBaseURL:https://sandbox-quickbooks.api.intuit.com
```

#### Request Body

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

#### Returns

```json
{
  "Estimate": {
    "DocNumber": "1001",
    "SyncToken": "0",
    "domain": "QBO",
    "TxnStatus": "Pending",
    "BillEmail": {
      "Address": "Cool_Cars@intuit.com"
    },
    "TxnDate": "2015-03-26",
    "TotalAmt": 31.5,
    "CustomerRef": {
      "name": "Cool Cars",
      "value": "3"
    },
    "CustomerMemo": {
      "value": "Thank you for your business and have a great day!"
    },
    "ShipAddr": {
      "CountrySubDivisionCode": "CA",
      "City": "Half Moon Bay",
      "PostalCode": "94213",
      "Id": "104",
      "Line1": "65 Ocean Dr."
    },
    "ProjectRef": {
      "value": "39298034"
    },
    "PrintStatus": "NeedToPrint",
    "BillAddr": {
      "CountrySubDivisionCode": "CA",
      "City": "Half Moon Bay",
      "PostalCode": "94213",
      "Id": "103",
      "Line1": "65 Ocean Dr."
    },
    "sparse": false,
    "EmailStatus": "NotSet",
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
    "ApplyTaxAfterDiscount": false,
    "CustomField": [
      {
        "DefinitionId": "1",
        "Type": "StringType",
        "Name": "Crew #"
      }
    ],
    "Id": "177",
    "TxnTaxDetail": {
      "TotalTax": 0
    },
    "MetaData": {
      "CreateTime": "2015-03-26T13:25:05-07:00",
      "LastUpdatedTime": "2015-03-26T13:25:05-07:00"
    }
  },
  "time": "2015-03-26T13:25:05.473-07:00"
}
```

## Delete an Estimate

This operation deletes the estimate object specified in the request body. Include a minimum of Estimate.Id and Estimate.SyncToken in the request body.

### Request Body

#### ATTRIBUTES

- **SyncToken** (*Required, read only, system defined*)
  - String
  - Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its SyncToken is incremented. Attempts to modify an object specifying an older SyncToken fails. Only the latest version of the object is maintained by QuickBooks Online.

- **id** (*Required, read only, system defined*)
  - String, filterable, sortable
  - Unique identifier for this object.

### Returns

Returns the delete response.

#### Request URL

```
POST /v3/company/<realmID>/estimate?operation=delete
Contenttype:application/jsonorapplication/xml
ProductionBaseURL:https://quickbooks.api.intuit.com
SandboxBaseURL:https://sandbox-quickbooks.api.intuit.com
```

#### Request Body

```json
{
  "SyncToken": "3",
  "Id": "96"
}
```

#### Returns

```json
{
  "Estimate": {
    "status": "Deleted",
    "domain": "QBO",
    "Id": "96"
  },
  "time": "2013-03-14T15:05:14.981-07:00"
}
```

## Get an Estimate as PDF

### Returns

This resource returns the specified object in the response body as an Adobe Portable Document Format (PDF) file. The resulting PDF file is formatted according to custom form styles in the company settings.

#### Request URL

```
GET /v3/company/<realmID>/estimate/<estimateId>/pdf
Contenttype:application/pdf
ProductionBaseURL:https://quickbooks.api.intuit.com
SandboxBaseURL:https://sandbox-quickbooks.api.intuit.com
```

#### Returns

```
"%PDF-1.4\r\n...\r\n%%EOF"
```

## Query an Estimate

### Returns

Returns the results of the query.

#### Request URL

```
GET /v3/company/<realmID>/query?query=<selectStatement>
Contenttype:application/text
ProductionBaseURL:https://quickbooks.api.intuit.com
SandboxBaseURL:https://sandbox-quickbooks.api.intuit.com
```

#### Sample Query

```
select * from estimate where TxnDate < '2014-09-15'
```

#### Returns

```json
{
  "QueryResponse": {
    "startPosition": 1,
    "Estimate": [
      {
        "TxnDate": "2014-09-07",
        "domain": "QBO",
        "PrintStatus": "NeedToPrint",
        "TxnStatus": "Closed",
        "TotalAmt": 582.5,
        "Line": [
          {
            "Description": "Rock Fountain",
            "DetailType": "SalesItemLineDetail",
            "SalesItemLineDetail": {
              "TaxCodeRef": {
                "value": "NON"
              },
              "Qty": 1,
              "UnitPrice": 275,
              "ItemRef": {
                "name": "Rock Fountain",
                "value": "5"
              }
            },
            "LineNum": 1,
            "Amount": 275.0,
            "Id": "1"
          },
          {
            "Description": "Custom Design",
            "DetailType": "SalesItemLineDetail",
            "SalesItemLineDetail": {
              "TaxCodeRef": {
                "value": "NON"
              },
              "Qty": 3.5,
              "UnitPrice": 75,
              "ItemRef": {
                "name": "Design",
                "value": "4"
              }
            },
            "LineNum": 2,
            "Amount": 262.5,
            "Id": "2"
          },
          {
            "Description": "Fountain Pump",
            "DetailType": "SalesItemLineDetail",
            "SalesItemLineDetail": {
              "TaxCodeRef": {
                "value": "NON"
              },
              "Qty": 2,
              "UnitPrice": 22.5,
              "ItemRef": {
                "name": "Pump",
                "value": "11"
              }
            },
            "LineNum": 3,
            "Amount": 45.0,
            "Id": "3"
          },
          {
            "DetailType": "SubTotalLineDetail",
            "Amount": 582.5,
            "SubTotalLineDetail": {}
          }
        ],
        "ApplyTaxAfterDiscount": false,
        "DocNumber": "1001",
        "sparse": false,
        "CustomerMemo": {
          "value": "Thank you for your business and have a great day!"
        },
        "ProjectRef": {
          "value": "39298035"
        },
        "CustomerRef": {
          "name": "Geeta Kalapatapu",
          "value": "10"
        },
        "TxnTaxDetail": {
          "TotalTax": 0
        },
        "SyncToken": "0",
        "LinkedTxn": [
          {
            "TxnId": "103",
            "TxnType": "Invoice"
          }
        ],
        "CustomField": [
          {
            "DefinitionId": "1",
            "Type": "StringType",
            "Name": "Crew #"
          }
        ],
        "ShipAddr": {
          "City": "Middlefield",
          "Line1": "1987 Main St.",
          "PostalCode": "94303",
          "Lat": "37.445013",
          "Long": "-122.1391443",
          "CountrySubDivisionCode": "CA",
          "Id": "10"
        },
        "EmailStatus": "NotSet",
        "BillAddr": {
          "Line3": "Middlefield, CA 94303",
          "Line2": "1987 Main St.",
          "Long": "-122.1178261",
          "Line1": "Geeta Kalapatapu",
          "Lat": "37.4530553",
          "Id": "59"
        },
        "MetaData": {
          "CreateTime": "2014-09-17T11:20:06-07:00",
          "LastUpdatedTime": "2014-09-18T13:41:59-07:00"
        },
        "BillEmail": {
          "Address": "Geeta@Kalapatapu.com"
        },
        "Id": "41"
      }
    ],
    "maxResults": 1
  },
  "time": "2015-07-24T14:00:04.902-07:00"
}
```

## Read an Estimate

Retrieves the details of an estimate that has been previously created.

### Returns

The estimate response body.

#### Request URL

```
GET /v3/company/<realmID>/estimate/<estimateId>
ProductionBaseURL:https://quickbooks.api.intuit.com
SandboxBaseURL:https://sandbox-quickbooks.api.intuit.com
```

#### Returns

```json
{
  "Estimate": {
    "DocNumber": "1001",
    "SyncToken": "0",
    "domain": "QBO",
    "TxnStatus": "Pending",
    "BillEmail": {
      "Address": "Cool_Cars@intuit.com"
    },
    "TxnDate": "2015-03-26",
    "TotalAmt": 31.5,
    "CustomerRef": {
      "name": "Cool Cars",
      "value": "3"
    },
    "CustomerMemo": {
      "value": "Thank you for your business and have a great day!"
    },
    "ShipAddr": {
      "CountrySubDivisionCode": "CA",
      "City": "Half Moon Bay",
      "PostalCode": "94213",
      "Id": "104",
      "Line1": "65 Ocean Dr."
    },
    "ProjectRef": {
      "value": "39298034"
    },
    "PrintStatus": "NeedToPrint",
    "BillAddr": {
      "CountrySubDivisionCode": "CA",
      "City": "Half Moon Bay",
      "PostalCode": "94213",
      "Id": "103",
      "Line1": "65 Ocean Dr."
    },
    "sparse": false,
    "EmailStatus": "NotSet",
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
    "ApplyTaxAfterDiscount": false,
    "CustomField": [
      {
        "DefinitionId": "1",
        "Type": "StringType",
        "Name": "Crew #"
      }
    ],
    "Id": "177",
    "TxnTaxDetail": {
      "TotalTax": 0
    },
    "MetaData": {
      "CreateTime": "2015-03-26T13:25:05-07:00",
      "LastUpdatedTime": "2015-03-26T13:25:05-07:00"
    }
  },
  "time": "2015-03-26T13:25:05.473-07:00"
}
```

## Send an Estimate

- The Estimate.EmailStatus parameter is set to EmailSent.
- The Estimate.DeliveryInfo element is populated with sending information.
- The Estimate.BillEmail.Address parameter is updated to the address specified with the value of the sendTo query parameter, if specified.

### Returns

The estimate response body.

#### Request URL

```
POST /v3/company/<realmID>/estimate/<estimateId>/send
POST /v3/company/<realmID>/estimate/<estimateId>/send?sendTo=<emailAddr>
Contenttype:application/octet-stream
ProductionBaseURL:https://quickbooks.api.intuit.com
SandboxBaseURL:https://sandbox-quickbooks.api.intuit.com
```

#### Returns

```json
{
  "Estimate": {
    "TxnDate": "2014-11-06",
    "domain": "QBO",
    "PrintStatus": "NeedToPrint",
    "DeliveryInfo": {
      "DeliveryType": "Email",
      "DeliveryTime": "2015-03-26T14:05:31-07:00"
    },
    "TxnStatus": "Closed",
    "TotalAmt": 362.07,
    "Line": [
      {
        "Description": "Rock Fountain",
        "DetailType": "SalesItemLineDetail",
        "SalesItemLineDetail": {
          "TaxCodeRef": {
            "value": "TAX"
          },
          "Qty": 1,
          "UnitPrice": 275,
          "ItemRef": {
            "name": "Rock Fountain",
            "value": "5"
          }
        },
        "LineNum": 1,
        "Amount": 275.0,
        "Id": "1"
      },
      {
        "Description": "Fountain Pump",
        "DetailType": "SalesItemLineDetail",
        "SalesItemLineDetail": {
          "TaxCodeRef": {
            "value": "TAX"
          },
          "Qty": 1,
          "UnitPrice": 12.75,
          "ItemRef": {
            "name": "Pump",
            "value": "11"
          }
        },
        "LineNum": 2,
        "Amount": 12.75,
        "Id": "2"
      },
      {
        "Description": "Concrete for fountain installation",
        "DetailType": "SalesItemLineDetail",
        "SalesItemLineDetail": {
          "TaxCodeRef": {
            "value": "TAX"
          },
          "Qty": 5,
          "UnitPrice": 9.5,
          "ItemRef": {
            "name": "Concrete",
            "value": "3"
          }
        },
        "LineNum": 3,
        "Amount": 47.5,
        "Id": "3"
      },
      {
        "DetailType": "SubTotalLineDetail",
        "Amount": 335.25,
        "SubTotalLineDetail": {}
      }
    ],
    "ApplyTaxAfterDiscount": false,
    "DocNumber": "1001",
    "sparse": false,
    "CustomerMemo": {
      "value": "Thank you for your business and have a great day!"
    },
    "ProjectRef": {
      "value": "39298036"
    },
    "CustomerRef": {
      "name": "Sonnenschein Family Store",
      "value": "24"
    },
    "TxnTaxDetail": {
      "TxnTaxCodeRef": {
        "value": "2"
      },
      "TotalTax": 26.82,
      "TaxLine": [
        {
          "DetailType": "TaxLineDetail",
          "Amount": 26.82,
          "TaxLineDetail": {
            "NetAmountTaxable": 335.25,
            "TaxPercent": 8,
            "TaxRateRef": {
              "value": "3"
            },
            "PercentBased": true
          }
        }
      ]
    },
    "SyncToken": "0",
    "LinkedTxn": [
      {
        "TxnId": "130",
        "TxnType": "Invoice"
      }
    ],
    "CustomField": [
      {
        "DefinitionId": "1",
        "Type": "StringType",
        "Name": "Crew #"
      }
    ],
    "ShipAddr": {
      "City": "Middlefield",
      "Line1": "5647 Cypress Hill Ave.",
      "PostalCode": "94303",
      "Lat": "37.4238562",
      "Long": "-122.1141681",
      "CountrySubDivisionCode": "CA",
      "Id": "25"
    },
    "EmailStatus": "EmailSent",
    "BillAddr": {
      "Lat": "37.4238562",
      "Long": "-122.1141681",
      "Id": "86",
      "Line1": "Russ Sonnenschein\nSonnenschein Family Store\n5647 Cypress Hill Ave.\nMiddlefield, CA 94303"
    },
    "MetaData": {
      "CreateTime": "2014-11-08T13:37:55-08:00",
      "LastUpdatedTime": "2015-03-26T14:05:31-07:00"
    },
    "BillEmail": {
      "Address": "Familiystore@intuit.com"
    },
    "Id": "100"
  },
  "time": "2015-03-26T14:05:31.330-07:00"
}
```

## Sparse Update an Estimate

Sparse updating provides the ability to update a subset of properties for a given object; only elements specified in the request are updated. Missing elements are left untouched. The ID of the object to update is specified in the request body.

### Request Body

#### ATTRIBUTES

- **Id** (*Required for update, read only, system defined*)
  - String, filterable, sortable
  - Unique identifier for this object. Sort order is ASC by default.

- **CustomerRef** (*Required*)
  - ReferenceType, filterable
  - Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use Customer.Id and Customer.DisplayName from that object for CustomerRef.value and CustomerRef.name, respectively.

- **SyncToken** (*Required for update, read only, system defined*)
  - String
  - Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its SyncToken is incremented. Attempts to modify an object specifying an older SyncToken fails. Only the latest version of the object is maintained by QuickBooks Online.

- (Plus all other fields mentioned in the Estimate object which can be optionally updated)

### Returns

The estimate response body.

#### Request URL

```
POST /v3/company/<realmID>/estimate
Contenttype:application/json
ProductionBaseURL:https://quickbooks.api.intuit.com
SandboxBaseURL:https://sandbox-quickbooks.api.intuit.com
```

#### Request Body

```json
{
  "SyncToken": "3",
  "domain": "QBO",
  "CustomerMemo": {
    "value": "An updated memo via full update the second time."
  },
  "sparse": true,
  "Id": "41",
  "MetaData": {
    "CreateTime": "2014-09-17T11:20:06-07:00",
    "LastUpdatedTime": "2015-07-24T14:08:04-07:00"
  }
}
```

#### Returns

```json
{
  "Estimate": {
    "TxnDate": "2014-09-07",
    "domain": "QBO",
    "PrintStatus": "NeedToPrint",
    "TxnStatus": "Closed",
    "TotalAmt": 582.5,
    "Line": [
      {
        "Description": "Rock Fountain",
        "DetailType": "SalesItemLineDetail",
        "SalesItemLineDetail": {
          "TaxCodeRef": {
            "value": "NON"
          },
          "Qty": 1,
          "UnitPrice": 275,
          "ItemRef": {
            "name": "Rock Fountain",
            "value": "5"
          }
        },
        "LineNum": 1,
        "Amount": 275.0,
        "Id": "1"
      },
      {
        "Description": "Custom Design",
        "DetailType": "SalesItemLineDetail",
        "SalesItemLineDetail": {
          "TaxCodeRef": {
            "value": "NON"
          },
          "Qty": 3.5,
          "UnitPrice": 75,
          "ItemRef": {
            "name": "Design",
            "value": "4"
          }
        },
        "LineNum": 2,
        "Amount": 262.5,
        "Id": "2"
      },
      {
        "Description": "Fountain Pump",
        "DetailType": "SalesItemLineDetail",
        "SalesItemLineDetail": {
          "TaxCodeRef": {
            "value": "NON"
          },
          "Qty": 2,
          "UnitPrice": 22.5,
          "ItemRef": {
            "name": "Pump",
            "value": "11"
          }
        },
        "LineNum": 3,
        "Amount": 45.0,
        "Id": "3"
      },
      {
        "DetailType": "SubTotalLineDetail",
        "Amount": 582.5,
        "SubTotalLineDetail": {}
      }
    ],
    "ApplyTaxAfterDiscount": false,
    "DocNumber": "1001",
    "sparse": false,
    "CustomerMemo": {
      "value": "An updated memo via full update the second time."
    },
    "ProjectRef": {
      "value": "39298033"
    },
    "CustomerRef": {
      "name": "Geeta Kalapatapu",
      "value": "10"
    },
    "TxnTaxDetail": {
      "TotalTax": 0
    },
    "SyncToken": "4",
    "LinkedTxn": [
      {
        "TxnId": "103",
        "TxnType": "Invoice"
      }
    ],
    "CustomField": [
      {
        "DefinitionId": "1",
        "Type": "StringType",
        "Name": "Crew #"
      }
    ],
    "ShipAddr": {
      "CountrySubDivisionCode": "CA",
      "City": "Middlefield",
      "PostalCode": "94303",
      "Id": "119",
      "Line1": "1987 Main St."
    },
    "EmailStatus": "NotSet",
    "BillAddr": {
      "Line3": "Middlefield, CA 94303",
      "Id": "59",
      "Line1": "Geeta Kalapatapu",
      "Line2": "1987 Main St."
    },
    "MetaData": {
      "CreateTime": "2014-09-17T11:20:06-07:00",
      "LastUpdatedTime": "2015-07-24T14:17:23-07:00"
    },
    "BillEmail": {
      "Address": "Geeta@Kalapatapu.com"
    },
    "Id": "41"
  },
  "time": "2015-07-24T14:17:23.307-07:00"
}
```

## Full Update an Estimate

Use this operation to update any of the writable fields of an existing estimate object. The request body must include all writable fields of the existing object as returned in a read response. Writable fields omitted from the request body are set to NULL. The ID of the object to update is specified in the request body.

### Request Body

#### ATTRIBUTES

- **Id** (*Required for update, read only, system defined*)
  - String, filterable, sortable
  - Unique identifier for this object. Sort order is ASC by default.

- **CustomerRef** (*Required*)
  - ReferenceType, filterable
  - Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use Customer.Id and Customer.DisplayName from that object for CustomerRef.value and CustomerRef.name, respectively.

- **SyncToken** (*Required for update, read only, system defined*)
  - String
  - Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its SyncToken is incremented. Attempts to modify an object specifying an older SyncToken fails. Only the latest version of the object is maintained by QuickBooks Online.

- (Plus all other fields mentioned in the Estimate object)

### Returns

The estimate response body.

#### Request URL

```
POST /v3/company/<realmID>/estimate
Contenttype:application/json
ProductionBaseURL:https://quickbooks.api.intuit.com
SandboxBaseURL:https://sandbox-quickbooks.api.intuit.com
```

#### Request Body

```json
{
  "TxnDate": "2014-09-07",
  "domain": "QBO",
  "PrintStatus": "NeedToPrint",
  "TxnStatus": "Closed",
  "TotalAmt": 582.5,
  "Line": [
    {
      "Description": "Rock Fountain",
      "DetailType": "SalesItemLineDetail",
      "SalesItemLineDetail": {
        "TaxCodeRef": {
          "value": "NON"
        },
        "Qty": 1,
        "UnitPrice": 275,
        "ItemRef": {
          "name": "Rock Fountain",
          "value": "5"
        }
      },
      "LineNum": 1,
      "Amount": 275.0,
      "Id": "1"
    },
    {
      "Description": "Custom Design",
      "DetailType": "SalesItemLineDetail",
      "SalesItemLineDetail": {
        "TaxCodeRef": {
          "value": "NON"
        },
        "Qty": 3.5,
        "UnitPrice": 75,
        "ItemRef": {
          "name": "Design",
          "value": "4"
        }
      },
      "LineNum": 2,
      "Amount": 262.5,
      "Id": "2"
    },
    {
      "Description": "Fountain Pump",
      "DetailType": "SalesItemLineDetail",
      "SalesItemLineDetail": {
        "TaxCodeRef": {
          "value": "NON"
        },
        "Qty": 2,
        "UnitPrice": 22.5,
        "ItemRef": {
          "name": "Pump",
          "value": "11"
        }
      },
      "LineNum": 3,
      "Amount": 45.0,
      "Id": "3"
    },
    {
      "DetailType": "SubTotalLineDetail",
      "Amount": 582.5,
      "SubTotalLineDetail": {}
    }
  ],
  "ApplyTaxAfterDiscount": false,
  "DocNumber": "1001",
  "sparse": false,
  "CustomerMemo": {
    "value": "An updated memo via full update."
  },
  "ProjectRef": {
    "value": "39298033"
  },
  "CustomerRef": {
    "name": "Geeta Kalapatapu",
    "value": "10"
  },
  "TxnTaxDetail": {
    "TotalTax": 0
  },
  "SyncToken": "2",
  "LinkedTxn": [
    {
      "TxnId": "103",
      "TxnType": "Invoice"
    }
  ],
  "CustomField": [
    {
      "DefinitionId": "1",
      "Type": "StringType",
      "Name": "Crew #"
    }
  ],
  "ShipAddr": {
    "CountrySubDivisionCode": "CA",
    "City": "Middlefield",
    "PostalCode": "94303",
    "Id": "119",
    "Line1": "1987 Main St."
  },
  "EmailStatus": "NotSet",
  "BillAddr": {
    "Line3": "Middlefield, CA 94303",
    "Id": "59",
    "Line1": "Geeta Kalapatapu",
    "Line2": "1987 Main St."
  },
  "MetaData": {
    "CreateTime": "2014-09-17T11:20:06-07:00",
    "LastUpdatedTime": "2015-07-24T14:08:04-07:00"
  },
  "BillEmail": {
    "Address": "Geeta@Kalapatapu.com"
  },
  "Id": "41"
}
```

#### Returns

```json
{
  "Estimate": {
    "TxnDate": "2014-09-07",
    "domain": "QBO",
    "PrintStatus": "NeedToPrint",
    "TxnStatus": "Closed",
    "TotalAmt": 582.5,
    "Line": [
      {
        "Description": "Rock Fountain",
        "DetailType": "SalesItemLineDetail",
        "SalesItemLineDetail": {
          "TaxCodeRef": {
            "value": "NON"
          },
          "Qty": 1,
          "UnitPrice": 275,
          "ItemRef": {
            "name": "Rock Fountain",
            "value": "5"
          }
        },
        "LineNum": 1,
        "Amount": 275.0,
        "Id": "1"
      },
      {
        "Description": "Custom Design",
        "DetailType": "SalesItemLineDetail",
        "SalesItemLineDetail": {
          "TaxCodeRef": {
            "value": "NON"
          },
          "Qty": 3.5,
          "UnitPrice": 75,
          "ItemRef": {
            "name": "Design",
            "value": "4"
          }
        },
        "LineNum": 2,
        "Amount": 262.5,
        "Id": "2"
      },
      {
        "Description": "Fountain Pump",
        "DetailType": "SalesItemLineDetail",
        "SalesItemLineDetail": {
          "TaxCodeRef": {
            "value": "NON"
          },
          "Qty": 2,
          "UnitPrice": 22.5,
          "ItemRef": {
            "name": "Pump",
            "value": "11"
          }
        },
        "LineNum": 3,
        "Amount": 45.0,
        "Id": "3"
      },
      {
        "DetailType": "SubTotalLineDetail",
        "Amount": 582.5,
        "SubTotalLineDetail": {}
      }
    ],
    "ApplyTaxAfterDiscount": false,
    "DocNumber": "1001",
    "sparse": false,
    "CustomerMemo": {
      "value": "An updated memo via full update."
    },
    "ProjectRef": {
      "value": "39298033"
    },
    "CustomerRef": {
      "name": "Geeta Kalapatapu",
      "value": "10"
    },
    "TxnTaxDetail": {
      "TotalTax": 0
    },
    "SyncToken": "3",
    "LinkedTxn": [
      {
        "TxnId": "103",
        "TxnType": "Invoice"
      }
    ],
    "CustomField": [
      {
        "DefinitionId": "1",
        "Type": "StringType",
        "Name": "Crew #"
      }
    ],
    "ShipAddr": {
      "CountrySubDivisionCode": "CA",
      "City": "Middlefield",
      "PostalCode": "94303",
      "Id": "119",
      "Line1": "1987 Main St."
    },
    "EmailStatus": "NotSet",
    "BillAddr": {
      "Line3": "Middlefield, CA 94303",
      "Id": "59",
      "Line1": "Geeta Kalapatapu",
      "Line2": "1987 Main St."
    },
    "MetaData": {
      "CreateTime": "2014-09-17T11:20:06-07:00",
      "LastUpdatedTime": "2015-07-24T14:15:10-07:00"
    },
    "BillEmail": {
      "Address": "Geeta@Kalapatapu.com"
    },
    "Id": "41"
  },
  "time": "2015-07-24T14:15:10.332-07:00"
}
```

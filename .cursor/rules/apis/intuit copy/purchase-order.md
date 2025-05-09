---
description: 
globs: 
alwaysApply: false
---

# QuickBooks Online Purchase Order API Documentation

## Introduction

The Purchase Order API in QuickBooks Online allows developers to create, read, update, and delete purchase orders through the QuickBooks Online Accounting API. Purchase orders represent requests to vendors for goods or services and can be linked to bills and other transactions.

## The Purchase Order Object

ATTRIBUTES
- **Id**

  *** Required for update**

  read only

  system defined

  **String** *, filterable* *, sortable*

  Unique identifier for this object. Sort order is ASC by default.
- **APAccountRef**

  *** Required**

  **ReferenceType**

  Specifies to which AP account the bill is credited. Query the Account name list resource to determine the appropriate Account object for this reference. Use Account.Id and Account.Name from that object for APAccountRef.value and APAccountRef.name, respectively. The specified account must have Account.Classification set to Liability and Account.AccountSubType set to AccountsPayable.
  If the company has a single AP account, the account is implied. However, it is recommended that the AP Account be explicitly specified in all cases to prevent unexpected errors when relating transactions to each other.

  Hide child attributes 
  - **value**

    *** Required**

    **string**

    The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
  - **name**

    Optional

    **string**

    An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.
- **VendorRef**

  *** Required**

  **ReferenceType**

  Reference to the vendor for this transaction. Query the Vendor name list resource to determine the appropriate Vendor object for this reference. Use Vendor.Id and Vendor.Name from that object for VendorRef.value and VendorRef.name, respectively.

  Hide child attributes 
  - **value**

    *** Required**

    **string**

    The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
  - **name**

    Optional

    **string**

    An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.
- **Line [0..n]**

  *** Required**

  **Line**

  Individual line items of a transaction. Valid Line types include: ItemBasedExpenseLine and AccountBasedExpenseLine

  ItemBasedExpenseLine

  Hide child attributes 
  - **Id**

    *** Required for update**

    read only

    system defined

    **String**

    The Id of the line item. Its use in requests is as folllows:
  - If Idis greater than zero and exists for the company, the request is considered an update operation for a line item.
  - If no Idis provided, the Idprovided is less than or equal to zero, or the Idprovided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.

  Available in all objects that use lines and support the update operation.
- **ItemBasedExpenseLineDetail**

  *** Required**

  **ItemBasedExpenseLineDetail**

  Hide child attributes 
  - **TaxInclusiveAmt**

    Optional

    **Decimal**

    The total amount of the line item including tax. Constraints: Available when endpoint is evoked with the minorversion=1query parameter.
  - **ItemRef**

    Optional

    **ReferenceType**

    Reference to the Item. Query the Item name list resource to determine the appropriate Item object for this reference. Use Item.Id and Item.Name from that object for ItemRef.value and ItemRef.name, respectively. When a line lacks an ItemRef it is treated as documentation and the Line.Amount attribute is ignored. For France locales: The account associated with the referenced Item object is looked up in the account category list.
  - If this account has same location as specified in the transaction by the TransactionLocationType attribute and the same VAT as in the line item TaxCodeRef attribute, then the item account is used.
  - If there is a mismatch, then the account from the account category list that matches the transaction location and VAT is used.
  - If this account is not present in the account category list, then a new account is created with the new location, new VAT code, and all other attributes as in the default account.

  Hide child attributes 
  - **value**

    *** Required**

    **string**

    The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
  - **name**

    Optional

    **string**

    An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.
- **CustomerRef**

  Optional

  **ReferenceType**

  Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use Customer.Id and Customer.DisplayName from that object for CustomerRef.value and CustomerRef.name, respectively.

  Show child attributes 
- **PriceLevelRef**

  Optional

  **ReferenceType**

  Reference to the PriceLevel of the service or item for the line. Support for this element will be available in the coming months.

  Hide child attributes 
  - **value**

    *** Required**

    **string**

    The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
  - **name**

    Optional

    **string**

    An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.
- **ClassRef**

  Optional

  **ReferenceType**

  Reference to the Class associated with the expense. Available if Preferences.AccountingInfoPrefs.ClassTrackingPerLine is set to true. Query the Class name list resource to determine the appropriate Class object for this reference. Use Class.Id and Class.Name from that object for ClassRef.value and ClassRef.name, respectively.

  Hide child attributes 
  - **value**

    *** Required**

    **string**

    The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
  - **name**

    Optional

    **string**

    An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.
- **TaxCodeRef**

  Optional

  **ReferenceType**

  Reference to the TaxCodefor this item. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use TaxCode.Id and TaxCode.Name from that object for TaxCodeRef.value and TaxCodeRef.name, respectively.

  Hide child attributes 
  - **value**

    *** Required**

    **string**

    The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
  - **name**

    Optional

    **string**

    An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.
- **MarkupInfo**

  Optional

  **MarkupInfo**

  Markup information for the expense.

  Show child attributes 
- **BillableStatus**

  Optional

  read only

  **BillableStatusEnum**

  The billable status of the expense. This field is not updatable through an API request. The value automatically changes when an invoice is created. Valid values: Billable, NotBillable, HasBeenBilled
- **Qty**

  Optional

  **Decimal**

  Number of items for the line.
- **UnitPrice**

  Optional

  **Decimal**

  Unit price of the subject item as referenced by ItemRef. Corresponds to the Rate column on the QuickBooks Online UI to specify either unit price, a discount, or a tax rate for item. If used for unit price, the monetary value of the service or product, as expressed in the home currency. If used for a discount or tax rate, express the percentage as a fraction. For example, specify 0.4 for 40% tax.

**Amount**

*** Required**

max character: Max 15 digits in 10.5 format

**Decimal**

The amount of the line item.

**DetailType**

*** Required**

**LineDetailTypeEnum**

Set to ItemBasedExpenseLineDetail for this type of line.

**LinkedTxn [0..n]**

Optional

minorVersion: 55

**LinkedTxn**

Zero or more transactions linked to this object. The LinkedTxn.TxnType can be set to ReimburseCharge. The LinkedTxn.TxnId can be set as the ID of the transaction.

Show child attributes 

**Description**

Optional

max character: Max 4000 chars

**String**

Free form text description of the line item that appears in the printed record.

**LineNum**

Optional

**Decimal**

Specifies the position of the line in the collection of transaction lines. Positive integer.

AccountBasedExpenseLine

Show child attributes 

**SyncToken**

*** Required for update**

read only

system defined

**String**

Version number of the object. It is used to lock an object for use by one app at a time. As soon as an application modifies an object, its SyncToken is incremented. Attempts to modify an object specifying an older SyncToken fails. Only the latest version of the object is maintained by QuickBooks Online.

**CurrencyRef**

*** Conditionally required**

**CurrencyRefType**

Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
Multicurrency is enabled for the company if Preferences.MultiCurrencyEnabled is set to true. Read more about multicurrency support [here](https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies "Currency"). Required if multicurrency is enabled for the company

Hide child attributes 
- **value**

  *** Required**

  **String**

  A three letter string representing the ISO 4217 code for the currency. For example, USD, AUD, EUR, and so on.
- **name**

  Optional

  **String**

  The full name of the currency.

**GlobalTaxCalculation**

*** Conditionally required**

**GlobalTaxCalculationEnum**

Method in which tax is applied. Allowed values are: TaxExcluded, TaxInclusive, and NotApplicable. Not applicable to US companies; required for non-US companies.

**TxnDate**

Optional

**Date** *, filterable* *, sortable*

The date entered by the user when this transaction occurred. For posting transactions, this is the posting date that affects the financial statements. If the date is not supplied, the current date on the server is used.
Sort order is ASC by default.

**CustomField**

Optional

**CustomField**

One of, up to three custom fields for the transaction. Available for custom fields so configured for the company. Check Preferences.SalesFormsPrefs.CustomField and Preferences.VendorAndPurchasesPrefs.POCustomField for custom fields currenly configured. [Click here](https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/create-custom-fields "Custom Fields") to learn about managing custom fields.

Hide child attributes 
- **DefinitionId**

  *** Required**

  read only

  system defined

  **String**

  Unique identifier of the CustomFieldDefinition that corresponds to this CustomField.
- **StringValue**

  Optional

  **String**

  The value for the StringTypecustom field.
- **Name**

  Optional

  read only

  **String**

  Name of the custom field.
- **Type**

  read only

  **CustomFieldTypeEnum**

  Data type of custom field. Only one type is currently supported: StringType.

**POEmail**

Optional

minorVersion: 17

**EmailAddress**

Used to specify the vendor e-mail address where the purchase req is sent.

Hide child attributes 
- **Address**

  Optional

  max character: maximum of 100 chars

  **String**

  An email address. The address format must follow the RFC 822 standard.

**ClassRef**

Optional

**ReferenceType**

Reference to the Class associated with the transaction. Available if Preferences.AccountingInfoPrefs.ClassTrackingPerTxn is set to true. Query the Class name list resource to determine the appropriate Class object for this reference. Use Class.Id and Class.Name from that object for ClassRef.value and ClassRef.name, respectively.

Hide child attributes 
- **value**

  *** Required**

  **string**

  The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
- **name**

  Optional

  **string**

  An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.

**SalesTermRef**

Optional

**ReferenceType**

Reference to the sales term associated with the transaction. Query the Term name list resource to determine the appropriate Term object for this reference. Use Term.Id and Term.Name from that object for SalesTermRef.value and SalesTermRef.name, respectively.

Hide child attributes 
- **value**

  *** Required**

  **string**

  The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
- **name**

  Optional

  **string**

  An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.

**LinkedTxn [0..n]**

Optional

**LinkedTxn**

Zero or more Bill objects linked to this purchase order; LinkedTxn.TxnType is set to Bill. To retrieve details of a linked Bill transaction, issue a separate request to read the Bill whose ID is linkedTxn.TxnId.

Hide child attributes 
- **TxnId**

  *** Required**

  **String**

  Transaction Id of the related transaction.
- **TxnType**

  *** Required**

  **String**

  Transaction type of the linked object.
- **TxnLineId**

  *** Conditionally required**

  **String**

  Required for Deposit and Bill entities. The line number of a specific line of the linked transaction. If supplied, the TxnId and TxnType attributes of the linked transaction must also be populated.

**Memo**

Optional

max character: Max of 4000 chars

**String**

A message for the vendor. This text appears on the Purchase Order object sent to the vendor.

**POStatus**

Optional

**String**

Purchase order status. Valid values are: Open and Closed.

**TransactionLocationType**

Optional

minorVersion: 4

**String**

The account location. Valid values include:

WithinFrance

FranceOverseas

OutsideFranceWithEU

OutsideEU

For France locales, only.

**DueDate**

Optional

**Date** *, filterable* *, sortable*

Date when the payment of the transaction is due. If date is not provided, the number of days specified in SalesTermRef added the transaction date will be used.

Hide child attributes 
- **date**

  **String**

  Local timezone: *YYYY-MM-DD* UTC: *YYYY-MM-DD*Z Specific time zone: *YYYY-MM-DD+/-HH:MM*
  The date format follows the [XML Schema standard.](https://www.w3.org/TR/xmlschema-2/)

**MetaData**

Optional

**ModificationMetaData**

Descriptive information about the object. The MetaData values are set by Data Services and are read only for all applications.

Hide child attributes 
- **CreateTime**

  read only

  system defined

  **DateTime** *, filterable* *, sortable*

  Time the entity was created in the source domain.

  Hide child attributes 
  - **dateTime**

    **string**

    Local time zone: *YYYY-MM-DDTHH:MM:SS* UTC: *YYYY-MM-DD*T *HH* *:MM:* *SS*Z Specific time zone: *YYYY-MM-DD*T *HH :MM:SS* +/- *HH* *:MM*
- **LastUpdatedTime**

  read only

  system defined

  **DateTime** *, filterable* *, sortable*

  Time the entity was last updated in the source domain.

  Hide child attributes 
  - **dateTime**

    **string**

    Local time zone: *YYYY-MM-DDTHH:MM:SS* UTC: *YYYY-MM-DD*T *HH* *:MM:* *SS*Z Specific time zone: *YYYY-MM-DD*T *HH :MM:SS* +/- *HH* *:MM*

**DocNumber**

Optional

max character: Maximum of 21 chars

**String** *, filterable* *, sortable*

Reference number for the transaction. If not explicitly provided at create time, this field is populated based on the setting of Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers as follows:

If Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers is true a custom value can be provided. If no value is supplied, the resulting DocNumber is null.

If Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers is false, resulting DocNumber is system generated by incrementing the last number by 1.

Throws an error when duplicate DocNumber is sent in the request. Recommended best practice: check the setting of Preferences:OtherPrefs:NameValue.Name = VendorAndPurchasesPrefs.UseCustomTxnNumbers before setting DocNumber. If a duplicate DocNumber needs to be supplied, add the query parameter name/value pair, include=allowduplicatedocnum to the URI. Sort order is ASC by default.

**PrivateNote**

Optional

max character: Max of 4000 chars

**String**

User entered, organization-private note about the transaction. This note does not appear on the purchase order to the vendor. This field maps to the Memo field on the Purchase Order form.

**ShipMethodRef**

Optional

**ReferenceType**

Reference to the user-defined ShipMethod associated with the transaction. Store shipping method string in both ShipMethodRef.value and ShipMethodRef.name.

Hide child attributes 
- **value**

  *** Required**

  **string**

  The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
- **name**

  Optional

  **string**

  An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.

**TxnTaxDetail**

Optional

**TxnTaxDetail**

This data type provides information for taxes charged on the transaction as a whole. It captures the details sales taxes calculated for the transaction based on the tax codes referenced by the transaction. This can be calculated by QuickBooks business logic or you may supply it when adding a transaction. See [Global tax model](https://developer.intuit.com/app/developer/qbo/docs/workflows/manage-sales-tax-for-non-us-locales "Global Tax Model") for more information about this element. If sales tax is disabled (Preferences.TaxPrefs.UsingSalesTax is set to false) then TxnTaxDetail is ignored and not stored.

Hide child attributes 
- **TxnTaxCodeRef**

  Optional

  **ReferenceType**

  Reference to the transaction tax code. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use TaxCode.Id and TaxCode.Name from that object for TaxCodeRef.value and TaxCodeRef.name, respectively. If specified and sales tax is disabled (Preferences.TaxPrefs.UsingSalesTax is set to false), this element is ignored and not returned. For sales transactions, only: if automated sales tax is enabled (Preferences.TaxPrefs.PartnerTaxEnabled is set to true) the supplied transaction tax code is replaced by the automated sales tax engine recommendation.

  Show child attributes 
- **TotalTax**

  Optional

  **Decimal**

  Total tax calculated for the transaction, excluding any tax lines manually inserted into the transaction line list.
- **TaxLine [0..n]**

  Optional

  **Line**

  Show child attributes 

**ShipTo**

Optional

**ReferenceType**

Reference to the customer to whose shipping address the order will be shipped to.

Hide child attributes 
- **value**

  *** Required**

  **string**

  The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
- **name**

  Optional

  **string**

  An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.

**ExchangeRate**

Optional

**Decimal**

The number of home currency units it takes to equal one unit of currency specified by CurrencyRef. Applicable if multicurrency is enabled for the company.

**ShipAddr**

Optional

**PhysicalAddress**

Address to which the vendor shipped or will ship any goods associated with the purchase.
If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:
- Line1 and Line2 elements are populated with the customer name and company name.
- Original Line1 through Line 5 contents, City, SubDivisionCode, and PostalCode flow into Line3 through Line5as a free format strings.

Hide details

AFTER CREATE
- **Line1**

  address 1
- **Line2**

  address 2
- **Line3..5**

  address 3..5, as needed
- **City**

  City
- **CountrySubDivisionCode**

  subdivision code
- **PostalCode**

  postal code
- **Lat**

  latitude
- **Long**

  longitude
- **Customer name**

  determine from CustomerRef element
- **Company name**

  determine from CustomerRef

AFTER UPDATE
- **Line1**

  customer name
- **Line2**

  customer name
- **Line3..5**

  address 1..5, city, subdivision code, postal code
- **City**

  not returned
- **CountrySubDivisionCode**

  not returned
- **Lat**

  not returned
- **Long**

  not returned
- **Customer name**

  determine from CustomerRef element
- **Company name**

  determine from CustomerRef element

Hide child attributes 
- **Id**

  *** Required for update**

  read only

  system defined

  **String**

  Unique identifier of the QuickBooks object for the address, autoincremented when the address is changed. This is an internal value included for backwards compatibility and can be ignored.
- **PostalCode**

  Optional

  max character: Maximum of 30 chars

  **String**

  Postal code. For example, zip code for USA and Canada
- **City**

  Optional

  max character: Maximum of 255 chars

  **String**

  City name.
- **Country**

  Optional

  max character: Maximum of 255 chars

  **String**

  Country name. For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.
- **Line5**

  Optional

  max character: Individual maximum of 500 chars, up to combined max of 2000 chars

  **String**

  Fifth line of the address.
- **Line4**

  Optional

  max character: Individual maximum of 500 chars, up to combined max of 2000 chars

  **String**

  Fourth line of the address.
- **Line3**

  Optional

  max character: Individual maximum of 500 chars, up to combined max of 2000 chars

  **String**

  Third line of the address.
- **Line2**

  Optional

  max character: Individual maximum of 500 chars, up to combined max of 2000 chars

  **String**

  Second line of the address.
- **Line1**

  Optional

  max character: Individual maximum of 500 chars, up to combined max of 2000 chars

  **String**

  First line of the address.
- **Lat**

  Optional

  read only

  system defined

  **String**

  Latitude coordinate of Geocode (Geospacial Entity Object Code). INVALIDis returned for invalid addresses.
- **Long**

  Optional

  read only

  system defined

  **String**

  Longitude coordinate of Geocode (Geospacial Entity Object Code). INVALIDis returned for invalid addresses.
- **CountrySubDivisionCode**

  Optional

  max character: Maximum of 255 chars

  **String**

  Region within a country. For example, state name for USA, province name for Canada.

**VendorAddr**

Optional

**PhysicalAddress**

Address to which the payment should be sent.
If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created:
- Line1 and Line2 elements are populated with the customer name and company name.
- Original Line1 through Line 5 contents, City, SubDivisionCode, and PostalCode flow into Line3 through Line5as a free format strings.

Hide details

AFTER CREATE
- **Line1**

  address 1
- **Line2**

  address 2
- **Line3..5**

  address 3..5, as needed
- **City**

  City
- **CountrySubDivisionCode**

  subdivision code
- **PostalCode**

  postal code
- **Lat**

  latitude
- **Long**

  longitude
- **Customer name**

  determine from CustomerRef element
- **Company name**

  determine from CustomerRef

AFTER UPDATE
- **Line1**

  customer name
- **Line2**

  customer name
- **Line3..5**

  address 1..5, city, subdivision code, postal code
- **City**

  not returned
- **CountrySubDivisionCode**

  not returned
- **Lat**

  not returned
- **Long**

  not returned
- **Customer name**

  determine from CustomerRef element
- **Company name**

  determine from CustomerRef element

Hide child attributes 
- **Id**

  *** Required for update**

  read only

  system defined

  **String**

  Unique identifier of the QuickBooks object for the address, autoincremented when the address is changed. This is an internal value included for backwards compatibility and can be ignored.
- **PostalCode**

  Optional

  max character: Maximum of 30 chars

  **String**

  Postal code. For example, zip code for USA and Canada
- **City**

  Optional

  max character: Maximum of 255 chars

  **String**

  City name.
- **Country**

  Optional

  max character: Maximum of 255 chars

  **String**

  Country name. For international addresses - countries should be passed as 3 ISO alpha-3 characters or the full name of the country.
- **Line5**

  Optional

  max character: Individual maximum of 500 chars, up to combined max of 2000 chars

  **String**

  Fifth line of the address.
- **Line4**

  Optional

  max character: Individual maximum of 500 chars, up to combined max of 2000 chars

  **String**

  Fourth line of the address.
- **Line3**

  Optional

  max character: Individual maximum of 500 chars, up to combined max of 2000 chars

  **String**

  Third line of the address.
- **Line2**

  Optional

  max character: Individual maximum of 500 chars, up to combined max of 2000 chars

  **String**

  Second line of the address.
- **Line1**

  Optional

  max character: Individual maximum of 500 chars, up to combined max of 2000 chars

  **String**

  First line of the address.
- **Lat**

  Optional

  read only

  system defined

  **String**

  Latitude coordinate of Geocode (Geospacial Entity Object Code). INVALIDis returned for invalid addresses.
- **Long**

  Optional

  read only

  system defined

  **String**

  Longitude coordinate of Geocode (Geospacial Entity Object Code). INVALIDis returned for invalid addresses.
- **CountrySubDivisionCode**

  Optional

  max character: Maximum of 255 chars

  **String**

  Region within a country. For example, state name for USA, province name for Canada.

**EmailStatus**

Optional

minorVersion: 45

**String**

Email status of the purchase order. Valid values: NotSet, NeedToSend, EmailSent

**TotalAmt**

read only

system defined

**BigDecimal**

Indicates the total amount of the transaction. This includes the total of all the charges, allowances, and taxes. Calculated by QuickBooks business logic; any value you supply is over-written by QuickBooks.

**RecurDataRef**

read only

minorVersion: 52

**ReferenceType**

A reference to the Recurring Transaction. It captures what recurring transaction template the PurchaseOrder was created from.

Hide child attributes 
- **value**

  *** Required**

  **string**

  The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
- **name**

  Optional

  **string**

  An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.

## Create Purchase Order

**Request Body**

The minimum elements to create an purchaseorder are listed here.

ATTRIBUTES
- **APAccountRef**

  *** Required**

  **ReferenceType**

  Specifies which AP account to which the bill is credited. Many/most small businesses have a single AP account, so the account can be implied. When specified, the account must be a Liability account, and further, the sub-type must be of type Payables. We strongly recommend that the AP Account be explicitly specified in all cases as companies that have more then one AP account will encounter unexpected errors when relating transactions to each other.

  Hide child attributes 
  - **value**

    *** Required**

    **string**

    The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
  - **name**

    Optional

    **string**

    An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.
- **VendorRef**

  *** Required**

  **ReferenceType**

  The vendor reference for this transaction.

  Hide child attributes 
  - **value**

    *** Required**

    **string**

    The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
  - **name**

    Optional

    **string**

    An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.
- **Line [0..n]**

  *** Required**

  **Line**

  Individual line items of a transaction. Valid Line types include: Item line. Note: The ItemRef in the ItemBasedExpenseLine below must reference an Item in QBO that has an expense account linked to it (e.g. in the ExpenseAccountRef field of the Item). Otherwise the request fails in QBO with a 'You must select an account for this transaction.' error.

  Hide child attributes 
  - **Id**

    *** Required for update**

    read only

    system defined

    **String**

    The Id of the line item. Its use in requests is as folllows:
  - If Idis greater than zero and exists for the company, the request is considered an update operation for a line item.
  - If no Idis provided, the Idprovided is less than or equal to zero, or the Idprovided is greater than zero and does not exist for the company then the request is considered a create operation for a line item.

  Available in all objects that use lines and support the update operation.
- **ItemBasedExpenseLineDetail**

  *** Required**

  **ItemBasedExpenseLineDetail**

  Hide child attributes 
  - **TaxInclusiveAmt**

    Optional

    **Decimal**

    The total amount of the line item including tax. Constraints: Available when endpoint is evoked with the minorversion=1query parameter.
  - **ItemRef**

    Optional

    **ReferenceType**

    Reference to the Item. Query the Item name list resource to determine the appropriate Item object for this reference. Use Item.Id and Item.Name from that object for ItemRef.value and ItemRef.name, respectively. When a line lacks an ItemRef it is treated as documentation and the Line.Amount attribute is ignored. For France locales: The account associated with the referenced Item object is looked up in the account category list.
  - If this account has same location as specified in the transaction by the TransactionLocationType attribute and the same VAT as in the line item TaxCodeRef attribute, then the item account is used.
  - If there is a mismatch, then the account from the account category list that matches the transaction location and VAT is used.
  - If this account is not present in the account category list, then a new account is created with the new location, new VAT code, and all other attributes as in the default account.

  Hide child attributes 
  - **value**

    *** Required**

    **string**

    The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
  - **name**

    Optional

    **string**

    An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.
- **CustomerRef**

  Optional

  **ReferenceType**

  Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use Customer.Id and Customer.DisplayName from that object for CustomerRef.value and CustomerRef.name, respectively.

  Hide child attributes 
  - **value**

    *** Required**

    **string**

    The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
  - **name**

    Optional

    **string**

    An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.
- **PriceLevelRef**

  Optional

  **ReferenceType**

  Reference to the PriceLevel of the service or item for the line. Support for this element will be available in the coming months.

  Hide child attributes 
  - **value**

    *** Required**

    **string**

    The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
  - **name**

    Optional

    **string**

    An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.
- **ClassRef**

  Optional

  **ReferenceType**

  Reference to the Class associated with the expense. Available if Preferences.AccountingInfoPrefs.ClassTrackingPerLine is set to true. Query the Class name list resource to determine the appropriate Class object for this reference. Use Class.Id and Class.Name from that object for ClassRef.value and ClassRef.name, respectively.

  Hide child attributes 
  - **value**

    *** Required**

    **string**

    The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
  - **name**

    Optional

    **string**

    An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.
- **TaxCodeRef**

  Optional

  **ReferenceType**

  Reference to the TaxCodefor this item. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use TaxCode.Id and TaxCode.Name from that object for TaxCodeRef.value and TaxCodeRef.name, respectively.

  Hide child attributes 
  - **value**

    *** Required**

    **string**

    The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
  - **name**

    Optional

    **string**

    An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.
- **MarkupInfo**

  Optional

  **MarkupInfo**

  Markup information for the expense.

  Hide child attributes 
  - **PriceLevelRef**

    Optional

    **ReferenceType**

    Reference to a PriceLevel for the markup. Support for this element will be available in the coming months.

    Show child attributes 
  - **Percent**

    Optional

    **Decimal**

    Markup amount expressed as a percent of charges already entered in the current transaction. To enter a rate of 10% use 10.0, not 0.01.
  - **MarkUpIncomeAccountRef**

    Optional

    read only

    system defined

    **ReferenceType**

    The account associated with the markup. Available with invoice objects, only, and when linktxn specified a ReimburseCharge.

    Hide child attributes 
    - **value**

      *** Required**

      **string**

      The ID for the referenced object as found in the Id field of the object payload. The context is set by the type of reference and is specific to the QuickBooks company file.
    - **name**

      Optional

      **string**

      An identifying name for the object being referenced by value and is derived from the field that holds the common name of that object. This varies by context and specific type of object referenced. For example, references to a Customer object use Customer.DisplayName to populate this field. Optionally returned in responses, implementation dependent.
- **BillableStatus**

  Optional

  read only

  **BillableStatusEnum**

  The billable status of the expense. This field is not updatable through an API request. The value automatically changes when an invoice is created. Valid values: Billable, NotBillable, HasBeenBilled
- **Qty**

  Optional

  **Decimal**

  Number of items for the line.
- **UnitPrice**

  Optional

  **Decimal**

  Unit price of the subject item as referenced by ItemRef. Corresponds to the Rate column on the QuickBooks Online UI to specify either unit price, a discount, or a tax rate for item. If used for unit price, the monetary value of the service or product, as expressed in the home currency. If used for a discount or tax rate, express the percentage as a fraction. For example, specify 0.4 for 40% tax.

**Amount**

*** Required**

max character: Max 15 digits in 10.5 format

**Decimal**

The amount of the line item.

**DetailType**

*** Required**

**LineDetailTypeEnum**

Set to ItemBasedExpenseLineDetail for this type of line.

**LinkedTxn [0..n]**

Optional

minorVersion: 55

**LinkedTxn**

Zero or more transactions linked to this object. The LinkedTxn.TxnType can be set to ReimburseCharge. The LinkedTxn.TxnId can be set as the ID of the transaction.

Hide child attributes 
- **TxnId**

  *** Required**

  **String**

  Transaction Id of the related transaction.
- **TxnType**

  *** Required**

  **String**

  Transaction type of the linked object.
- **TxnLineId**

  *** Conditionally required**

  **String**

  Required for Deposit and Bill entities. The line number of a specific line of the linked transaction. If supplied, the TxnId and TxnType attributes of the linked transaction must also be populated.

**Description**

Optional

max character: Max 4000 chars

**String**

Free form text description of the line item that appears in the printed record.

**LineNum**

Optional

**Decimal**

Specifies the position of the line in the collection of transaction lines. Positive integer.

**CurrencyRef**

*** Conditionally required**

**CurrencyRefType**

Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.
Multicurrency is enabled for the company if Preferences.MultiCurrencyEnabled is set to true. Read more about multicurrency support [here](https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-multiple-currencies "Currency"). Required if multicurrency is enabled for the company

Hide child attributes 
- **value**

  *** Required**

  **String**

  A three letter string representing the ISO 4217 code for the currency. For example, USD, AUD, EUR, and so on.
- **name**

  Optional

  **String**

  The full name of the currency.

----
Sample Request Body:

{
  "TotalAmt": 25.0, 
  "Line": [
    {
      "DetailType": "ItemBasedExpenseLineDetail", 
      "Amount": 25.0, 
      "ProjectRef": {
        "value": "39298034"
      }, 
      "Id": "1", 
      "ItemBasedExpenseLineDetail": {
        "ItemRef": {
          "name": "Pump", 
          "value": "11"
        }, 
        "CustomerRef": {
          "name": "Cool Cars", 
          "value": "3"
        }, 
        "Qty": 1, 
        "TaxCodeRef": {
          "value": "NON"
        }, 
        "BillableStatus": "NotBillable", 
        "UnitPrice": 25
      }
    }
  ], 
  "APAccountRef": {
    "name": "Accounts Payable (A/P)", 
    "value": "33"
  }, 
  "VendorRef": {
    "name": "Hicks Hardware", 
    "value": "41"
  }, 
  "ShipTo": {
    "name": "Jeff's Jalopies", 
    "value": "12"
  }
}


## Base URL

```
https://quickbooks.api.intuit.com/v3/company/{realmId}/purchaseorder
```

## API Endpoints

### Create a Purchase Order

**Request Method:** POST  
**Endpoint:** `/v3/company/{realmId}/purchaseorder`

### Read a Purchase Order

**Request Method:** GET  
**Endpoint:** `/v3/company/{realmId}/purchaseorder/{id}`

### Update a Purchase Order

**Request Method:** POST  
**Endpoint:** `/v3/company/{realmId}/purchaseorder`  
**Note:** Include the ID in the request body

### Delete a Purchase Order

**Request Method:** POST  
**Endpoint:** `/v3/company/{realmId}/purchaseorder`  
**Operation:** Set `Active` field to `false`

## Data Model

Purchase Orders in QuickBooks Online contain the following key elements:

### Main Fields

- **Id** - Unique identifier for the purchase order
- **DocNumber** - Purchase order number that appears on the transaction
- **TxnDate** - Date of the transaction
- **PrivateNote** - Private note for internal use
- **TotalAmt** - Total amount of the purchase order
- **VendorRef** - Reference to the vendor
- **APAccountRef** - Reference to the accounts payable account
- **POStatus** - Status of the purchase order (Open, Closed)
- **ClassRef** - Reference to class for tracking purposes
- **SalesTermRef** - Reference to sales terms
- **DueDate** - Due date for the purchase order
- **ShipMethodRef** - Reference to shipping method
- **ShipTo** - Shipping address information
- **VendorAddr** - Vendor address information
- **CurrencyRef** - Reference to currency used
- **ExchangeRate** - Exchange rate if using multiple currencies
- **DepartmentRef** - Reference to department for tracking purposes
- **Memo** - Memo field visible to vendor

### Line Items

Each purchase order contains line items with the following structure:

- **LineNum** - Line number
- **Description** - Description of the item
- **Amount** - Amount for this line
- **DetailType** - Type of line item (ItemBasedExpenseLine, AccountBasedExpenseLine)
- **ItemBasedExpenseLine** - Details for item-based lines:
  - **ItemRef** - Reference to the item
  - **UnitPrice** - Price per unit
  - **Qty** - Quantity
  - **TaxCodeRef** - Reference to tax code
- **AccountBasedExpenseLine** - Details for account-based lines:
  - **AccountRef** - Reference to the account
  - **TaxCodeRef** - Reference to tax code

## Request and Response Format

All requests and responses use JSON format. Here's an example structure of a Purchase Order:

```json
{
  "PurchaseOrder": {
    "DocNumber": "1001",
    "TxnDate": "2025-05-06",
    "VendorRef": {
      "value": "56",
      "name": "Vendor Company"
    },
    "Line": [
      {
        "DetailType": "ItemBasedExpenseLine",
        "ItemBasedExpenseLine": {
          "ItemRef": {
            "value": "5",
            "name": "Office Supplies"
          },
          "UnitPrice": 25.00,
          "Qty": 2
        },
        "Amount": 50.00,
        "Description": "Printer Paper"
      }
    ],
    "TotalAmt": 50.00,
    "POStatus": "Open"
  }
}
```

## Authentication

The QuickBooks Online API uses OAuth 2.0 for authentication. Requests must include the authorization header with a valid OAuth token.

## Minor Versions

QuickBooks Online API supports minor versions to manage API changes. Include the `minorversion` parameter in your requests to use specific features:

```
GET /v3/company/{realmId}/purchaseorder/{id}?minorversion=65
```

## Error Handling

The API returns standard HTTP status codes and detailed error information in the response body for failed requests.

## Best Practices

1. Always specify the minor version in your requests
2. Handle pagination properly for list operations
3. Use sparse updates when modifying resources
4. Implement proper error handling
5. Follow rate limiting guidelines

---

# QuickBooks Online Purchase Order API Documentation

## Overview

The Purchase Order API in QuickBooks Online allows you to create, read, update, and delete purchase orders through the QuickBooks Online Accounting API. Purchase orders represent requests to vendors for goods or services.

## Endpoint URL

```
https://quickbooks.api.intuit.com/v3/company/{realmId}/purchaseorder
```

## API Operations

### Create a Purchase Order

**Request Method:** POST  
**Endpoint:** `/v3/company/{realmId}/purchaseorder`

### Read a Purchase Order

**Request Method:** GET  
**Endpoint:** `/v3/company/{realmId}/purchaseorder/{id}`

Example from Pipedream component description: "Returns details about a purchase order."

### Update a Purchase Order

**Request Method:** POST  
**Endpoint:** `/v3/company/{realmId}/purchaseorder`  
**Note:** Include the ID in the request body

### Delete a Purchase Order

**Request Method:** POST  
**Endpoint:** `/v3/company/{realmId}/purchaseorder`  
**Operation:** Set `Active` field to `false`

## Request and Response Format

All requests and responses use JSON format.

## Authentication

The QuickBooks Online API uses OAuth 2.0 for authentication. You'll need to set up an AuthClient with your CLIENT_ID, CLIENT_SECRET, and ACCESS_TOKEN.

## Minor Versions

QuickBooks Online API supports minor versions to manage API changes. Include the `minorversion` parameter in your requests to use specific features.

Example request:
```
GET /v3/company/{realmId}/purchaseorder/{id}?minorversion=70
```

## Data Model

### Purchase Order Object Structure

```json
{
  "PurchaseOrder": {
    "DocNumber": "1005",
    "SyncToken": "0",
    "domain": "QBO",
    "APAccountRef": {
      "name": "Accounts Payable (A/P)",
      "value": "33"
    },
    "CurrencyRef": {
      "name": "United States Dollar",
      "value": "USD"
    },
    "TxnDate": "2025-05-06",
    "TotalAmt": 25.0,
    "ShipAddr": {
      "Line4": "Half Moon Bay, CA 94213",
      "Line3": "65 Ocean Dr.",
      "Id": "121",
      "Line1": "Grace Pariente",
      "Line2": "Cool Cars"
    },
    "VendorAddr": {
      "Line4": "Middlefield, CA 94303",
      "Line3": "42 Main St.",
      "Id": "120",
      "Line1": "Geoff Hicks",
      "Line2": "Hicks Hardware"
    },
    "POStatus": "Open",
    "sparse": false,
    "VendorRef": {
      "name": "Hicks Hardware",
      "value": "41"
    },
    "Line": [
      {
        "DetailType": "ItemBasedExpenseLine",
        "ItemBasedExpenseLine": {
          "ItemRef": {
            "name": "Garden Supplies",
            "value": "5"
          },
          "Qty": 1,
          "UnitPrice": 25.0
        },
        "Amount": 25.0,
        "Description": "Garden Hose"
      }
    ]
  }
}
```

## Main Fields

- **Id** - Unique identifier for the purchase order
- **DocNumber** - Purchase order number that appears on the transaction
- **SyncToken** - Version number of the object
- **TxnDate** - Date of the transaction
- **CurrencyRef** - Reference to currency used
- **TotalAmt** - Total amount of the purchase order
- **APAccountRef** - Reference to accounts payable account
- **VendorRef** - Reference to the vendor
- **POStatus** - Status of the purchase order (Open, Closed)
- **ShipAddr** - Shipping address information
- **VendorAddr** - Vendor address information
- **EmailStatus** - Indicates if the purchase order has been emailed
- **sparse** - Indicates if this is a sparse update

## Line Items

Each purchase order contains line items with the following structure:

- **LineNum** - Line number
- **Description** - Description of the item
- **Amount** - Amount for this line
- **DetailType** - Type of line item (ItemBasedExpenseLine, AccountBasedExpenseLine)
- **ItemBasedExpenseLine** - Details for item-based lines:
  - **ItemRef** - Reference to the item
  - **UnitPrice** - Price per unit
  - **Qty** - Quantity
- **AccountBasedExpenseLine** - Details for account-based lines:
  - **AccountRef** - Reference to the account

## Query Operations

You can query purchase orders using SQL-like syntax. The maximum number of entities that can be returned in a response is 1000. If the result size is not specified, the default number is 100.

Example query:
```
SELECT * FROM PurchaseOrder WHERE VendorRef = '41'
```

## Pagination

For queries that return many entities, fetch the entities in chunks using STARTPOSITION and MAXRESULTS:

```
SELECT * FROM PurchaseOrder STARTPOSITION 1 MAXRESULTS 10
```

## Error Handling

The API returns standard HTTP status codes and detailed error information in the response body for failed requests.

## Best Practices

1. Always specify the minor version in your requests
2. Handle pagination properly for list operations
3. Use sparse updates when modifying resources
4. Implement proper error handling
5. Follow rate limiting guidelines

## Common Issues

When creating a purchase order, you might encounter a "Business Validation Error: Please enter a valid email address" if email-related fields aren't properly set.

## Examples

### Creating a Purchase Order

```json
{
  "PurchaseOrder": {
    "DocNumber": "1005",
    "APAccountRef": {
      "name": "Accounts Payable (A/P)",
      "value": "33"
    },
    "VendorRef": {
      "name": "Hicks Hardware",
      "value": "41"
    },
    "Line": [
      {
        "DetailType": "ItemBasedExpenseLine",
        "ItemBasedExpenseLine": {
          "ItemRef": {
            "name": "Garden Supplies",
            "value": "5"
          },
          "Qty": 1,
          "UnitPrice": 25.0
        },
        "Amount": 25.0,
        "Description": "Garden Hose"
      }
    ],
    "EmailStatus": 0
  }
}
```

### Reading a Purchase Order

To get a specific purchase order by ID:

```
GET /v3/company/{realmId}/purchaseorder/{id}
```

### Updating a Purchase Order

When updating a purchase order, include the ID and SyncToken:

```json
{
  "PurchaseOrder": {
    "Id": "123",
    "SyncToken": "1",
    "sparse": true,
    "POStatus": "Closed"
  }
}
```

### Deleting a Purchase Order

To delete a purchase order, update it with Active set to false:

```json
{
  "PurchaseOrder": {
    "Id": "123",
    "SyncToken": "2",
    "Active": false
  }
}
```

## Reference Documentation

For more detailed information, please refer to the official [QuickBooks Online API documentation](mdc:https:/developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchaseorder).
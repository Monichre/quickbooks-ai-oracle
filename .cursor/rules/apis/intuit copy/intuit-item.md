---
description: 
globs: 
alwaysApply: false
---
# **Item**

An item is a product or service that your company buys, sells, or resells to customers, such as products and services. When you add an item, you categorize it as one of these types: inventory, non-inventory, service, or bundle. QuickBooks Online lets you track items so that a sale and its impact on inventory and accounts get recorded simultaneously. An item is shown as a line on an invoice or other sales form. The Item.Type attribute, which specifies how the item is used, has one of the following values:

**Inventory**

Used in transactions to track merchandise that your business purchases, stocks, and re-sells as inventory. QuickBooks tracks the current number of inventory items in stock, cost of goods sold, and the asset value of the inventory after the purchase and sale of every item.

**Group**

Used as a container for a bundle of items with a count for each item. For example, a Gift Basket with 2 apples, 5 pencils and 1 stack of paper. The bundle is the Gift Basket, the bundle items are apples, pencils and paper. Note: Creating them via the QuickBooks Online API is not supported.
- Bundles cannot contain other bundles.
- Bundles cannot contain categories.
- An item can be listed more than once with same or different quantities.
- Bundles can be added to transactions.

**Service**

Used in transactions to track services that you charge on the purchase. For example, specialized labor, consulting hours, and professional fees.

**NonInventory**

Used for goods you buy but don’t track, like office supplies.
Used in transactions for goods and materials for a specific job that you charge back to the customer and don't track yourself.


In addition to the above, QuickBooks companies supports item categories to define item hierarchies. Use Item.Type set to Category to create hierarchies. Of note:
- Non-category items used as parent items and used for things the company sells cannot be freely mixed.
  - An app can now clearly distinguish between things the company sells and categories used to build a hierarchy to organize them.
  - Categories do not have a price, income account, or expense accounts.
- Items—-the things the company sells—-cannot have children. That is, if your items are organized into a hierarchy, items can only be at the leaf level of the hierarchy.
- Categories are only available on companies that have enabled Categories. Test the CompanyInfo.NameValue.Name.ItemCategoriesFeature flag:
  - true— categories are enabled
  - false— categories are not enabled
 
**IMPORTANT:** Line Items on the estimate are instances of @quickbooks-item.mdc and has one of the following values:
- **Inventory**
- **Group**
- **Service**
- **NonInventory**

---

## The item object

ATTRIBUTES
- **Id**

  *** Required for update**

  read only

  system defined

  **IdType** *, filterable* *, sortable*

  Unique Identifier for an Intuit entity (object). Required for the update operation.
- **ItemCategoryType**

  *** Required**

  minorVersion: 3

  **String**

  Classification that specifies the use of this item. Applicable for France companies, only. Available when endpoint is evoked with the minorversion=3 query parameter. Read-only after object is created. Valid values include: Product and Service.
- **Name**

  *** Required**

  max character: maximum of 100 chars

  **String** *, filterable* *, sortable*

  Name of the item. This value is unique.
- **SyncToken**

  *** Required for update**

  read only

  system defined

  **String**

  Version number of the entity. Required for the update operation.
- **InvStartDate**

  *** Conditionally required**

  **Date**

  Date of opening balance for the inventory transaction. For read operations, the date returned in this field is always the originally provided inventory start date. For update operations, the date supplied is interpreted as the inventory adjust date, is stored as such in the underlying data model, and is reflected in the QuickBooks Online UI for the object. The inventory adjust date is not exposed for read operations through the API. Required for Inventory type items.

  
- **Type**

  *** Conditionally required**

  minorVersion: specified.

  **String** *, filterable* *, sortable*

  Classification that specifies the use of this item. See the description at the top of the Item entity page for details about supported item types. For requests with minor versions earlier than 4 specified, this field is read-only and system-defined as follows:
- Inventory--Default setting when TrackQtyOnHand, InvStartDate, and AssetAccountRef are specified. Used for goods the company sells and buys that are tracked as inventory.
- Service--Default setting when TrackQtyOnHand, InvStartDate, and AssetAccountRef are not specified. Used for non-tangible goods the company sells and buys that are not tracked as inventory. For example, specialized labor, consulting hours, and professional fees.

For requests with minor version=4 query parameter, this field is required to be explicitly set with one of the following:
- Inventory--Used for goods the company sells and buys that are tracked as inventory.
- Service--Used for non-tangible goods the company sells and buys that are not tracked as inventory. For example, specialized labor, consulting hours, and professional fees.
- NonInventory--Use for goods the company sells and buys that are not tracked as inventory. For example, office supplies or goods bought on behalf of the customer.

When querying Item objects with minor versions earlier than 4 specified, NonInventory types are returned as type Service. For French locales, Type is tied with ItemCategoryType: if ItemCategoryType is set to Service, then Type is set to Service, if ItemCategoryType is Product, then Type is set to NonInventory. >Required when minor version 4 is specified.
- **QtyOnHand**

  *** Conditionally required**

  **Decimal**

  Current quantity of the Inventory items available for sale. Not used for Service or NonInventory type items.Required for Inventory type items.
- **AssetAccountRef**

  *** Conditionally required**

  **ReferenceType**

  Reference to the Inventory Asset account that tracks the current value of the inventory. If the same account is used for all inventory items, the current balance of this account will represent the current total value of the inventory. Query the Account name list resource to determine the appropriate Account object for this reference. Use Account.Id and Account.Name from that object for AssetAccountRef.value and AssetAccountRef.name, respectively. Required for Inventory item types.

  
- **Sku**

  Optional

  max character: maximum of 100 chars

  minorVersion: 4

  **String** *, filterable*

  The stock keeping unit (SKU) for this Item. This is a company-defined identifier for an item or product used in tracking inventory.
- **SalesTaxIncluded**

  Optional

  **Boolean**

  True if the sales tax is included in the item amount, and therefore is not calculated for the transaction.
- **TrackQtyOnHand**

  Optional

  **Boolean**

  True if there is quantity on hand to be tracked. Once this value is true, it cannot be updated to false. Applicable for items of type Inventory. Not applicable for Service or NonInventory item types.
- **SalesTaxCodeRef**

  Optional

  **ReferenceType**

  Reference to the sales tax code for the Sales item. Applicable to Service and Sales item types only. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use TaxCode.Id and TaxCode.Name from that object for SalesTaxCodeRef.value and SalesTaxCodeRef.name, respectively.

  
- **ClassRef**

  Optional

  minorVersion: 41

  **ReferenceType**

  Reference to the Class for the item. Query the Class name list resource to determine the appropriate object for this reference. Use Class.Id and Class.Name from that object for ClassRef.value and ClassRef.name, respectively.

  
- **Source**

  Optional

  minorVersion: 59

  **String**

  The Source type of the transactions created by QuickBooks Commerce. Valid values include: QBCommerce
- **PurchaseTaxIncluded**

  Optional

  **Boolean**

  True if the purchase tax is included in the item amount, and therefore is not calculated for the transaction.
- **Description**

  Optional

  max character: maximum of 4000 chars

  **String**

  Description of the item.
- **AbatementRate**

  Optional

  minorVersion: 3

  **Decimal**

  Sales tax abatement rate for India locales.
- **SubItem**

  Optional

  **Boolean**

  If true, this is a sub item. If false or null, this is a top-level item. Creating inventory hierarchies with traditional inventory items is being phased out in lieu of using categories and sub categories.
- **Taxable**

  Optional

  **Boolean**

  If true, transactions for this item are taxable. Applicable to US companies, only.
- **UQCDisplayText**

  Optional

  max character: maximum of 25 chars

  minorVersion: 33

  **String**

  Text to be displayed on customer's invoice to denote the Unit of Measure (instead of the standard code).
- **ReorderPoint**

  Optional

  **Decimal**

  The minimum quantity of a particular inventory item that you need to restock at any given time. The ReorderPoint value cannot be set to null for sparse updates(sparse=true). It can be set to null only for full updates.
- **PurchaseDesc**

  Optional

  max character: Max 1000 chars

  **String**

  Purchase description for the item.
- **MetaData**

  Optional

  **ModificationMetaData**

  Descriptive information about the entity. The MetaData values are set by Data Services and are read only for all applications.

  
- **PrefVendorRef**

  Optional

  minorVersion: 31

  **ReferenceType**

  Reference to the preferred vendor of this item. Query the Vendor name list resource to determine the appropriate object for this reference. Use Vendor.Id and Vendor.Name from that object for ParentRef.value and ParentRef.name, respectively.

  
- **Active**

  Optional

  **Boolean** *, filterable*

  If true, the object is currently enabled for use by QuickBooks.
- **UQCId**

  Optional

  minorVersion: 33

  **String**

  Id of Standard Unit of Measure (UQC:Unique Quantity Code) of the item according to GST rule. UQCId should be one of the following ids:

  Show valid values
- **ReverseChargeRate**

  Optional

  minorVersion: 3

  **Decimal**

  Sales tax reverse charge rate for India locales.
- **PurchaseTaxCodeRef**

  Optional

  **ReferenceType**

  Reference to the purchase tax code for the item. Applicable to Service, Other Charge, and Product (Non-Inventory) item types. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use TaxCode.Id and TaxCode.Name from that object for PurchaseTaxCodeRef.value and PurchaseTaxCodeRef.name, respectively.

  
- **ServiceType**

  Optional

  minorVersion: 3

  **String**

  Sales tax service type for India locales.

  Show valid values
- **PurchaseCost**

  Optional

  max character: Maximum of 99999999999

  **Decimal**

  Amount paid when buying or ordering the item, as expressed in the home currency.
- **ParentRef**

  Optional

  **ReferenceType**

  The immediate parent of the sub item in the hierarchical Item:SubItem list. If SubItem is true, then ParenRef is required. If SubItem is true, then ParenRef is required. Query the Item name list resource to determine the appropriate object for this reference. Use Item.Id and Item.Name from that object for ParentRef.value and ParentRef.name, respectively.

  
- **UnitPrice**

  Optional

  max character: maximum of 99999999999

  **Decimal** *, sortable*

  Corresponds to the Price/Rate column on the QuickBooks Online UI to specify either unit price, a discount, or a tax rate for item. If used for unit price, the monetary value of the service or product, as expressed in the home currency. If used for a discount or tax rate, express the percentage as a fraction. For example, specify 0.4 for 40% tax.
- **FullyQualifiedName**

  read only

  system defined

  **String** *, filterable*

  Fully qualified name of the entity. The fully qualified name prepends the topmost parent, followed by each sub element separated by colons. Takes the form of Item:SubItem. Returned from an existing object and not input on a new object.Limited to 5 levels.
- **ExpenseAccountRef**

  **ReferenceType**

  Reference to the expense account used to pay the vendor for this item. Must be an account with account type of Cost of Goods Sold. Query the Account name list resource to determine the appropriate Account object for this reference. Use Account.Id and Account.Name from that object for ExpenseAccountRef.value and ExpenseAccountRef.name, respectively. For France locales:
- This is an optional field.
- This is the purchase account id, If not provided it defaults to the default purchase account: 605100 and 601100 are the default expense accounts used for Service and Product type of item, respectively.

Required for Inventory, NonInventory, and Service item types


- **Level**

  read only

  system defined

  **Integer**

  Specifies the level of the hierarchy in which the entity is located. Zero specifies the top level of the hierarchy; anything above will be the next level with respect to the parent. Limited to 5 levels.
- **IncomeAccountRef**

  *** Conditionally Required**

  **ReferenceType**

  Reference to the posting account, that is, the account that records the proceeds from the sale of this item. Must be an account with account type of Sales of Product Income. Query the Account name list resource to determine the appropriate Account object for this reference. Use Account.Id and Account.Name from that object for IncomeAccountRef.value and IncomeAccountRef.name, respectively.For France locales:
- This is an optional field.
- This is the sales account id, If not provided it defaults to the default sales account: 706100 and 707100 are the default expense accounts used for Service and Product type of item, respectively.

required for Inventory and Service item types


- **TaxClassificationRef**

  minorVersion: 34

  **ReferenceType**

  Tax classification segregates different items into different classifications and the tax classification is one of the key parameters to determine appropriate tax on transactions involving items. Tax classifications are sourced by either tax governing authorities as in India/Malaysia or externally like Exactor. 'Fuel', 'Garments' and 'Soft drinks' are a few examples of tax classification in layman terms. User can choose a specific tax classification for an item while creating it. A level 1 tax classification cannot be associated to an Item.

  

```json
{
  "Name": "Rock Fountain",
  "Description": "Custom-made water fountain for your garden with natural rocks.",
  "Active": true,
  "FullyQualifiedName": "Rock Fountain",
  "Taxable": true,
  "UnitPrice": 275.00,
  "Type": "Inventory",
  "IncomeAccountRef": {
    "value": "79",
    "name": "Sales of Product Income"
  },
  "ExpenseAccountRef": {
    "value": "80",
    "name": "Cost of Goods Sold"
  },
  "AssetAccountRef": {
    "value": "81",
    "name": "Inventory Asset"
  },
  "TrackQtyOnHand": true,
  "QtyOnHand": 10,
  "InvStartDate": "2023-04-01",
  "PurchaseCost": 125.00,
  "PurchaseDesc": "Garden rocks, fountain supplies",
  "MetaData": {
    "CreateTime": "2023-04-01T12:31:05-07:00",
    "LastUpdatedTime": "2023-04-01T12:31:05-07:00"
  },
  "Id": "5",
  "SyncToken": "0"
}
```

## Create an item

### Request Body

```json
{
  "Name": "Rock Fountain",
  "IncomeAccountRef": {
    "value": "79"
  },
  "ExpenseAccountRef": {
    "value": "80"
  },
  "AssetAccountRef": {
    "value": "81"
  },
  "Type": "Inventory",
  "TrackQtyOnHand": true,
  "QtyOnHand": 10,
  "InvStartDate": "2023-04-01"
}
```

## Query an item

### Request

```
GET /v3/company/<realmId>/query?query=select * from Item where Name = 'Rock Fountain'
```

## Read an item

### Request

```
GET /v3/company/<realmId>/item/<id>
```

### Response

```json
{
  "Item": {
    "Name": "Rock Fountain",
    "Description": "Custom-made water fountain for your garden with natural rocks.",
    "Active": true,
    "FullyQualifiedName": "Rock Fountain",
    "Taxable": true,
    "UnitPrice": 275.00,
    "Type": "Inventory",
    "IncomeAccountRef": {
      "value": "79",
      "name": "Sales of Product Income"
    },
    "ExpenseAccountRef": {
      "value": "80",
      "name": "Cost of Goods Sold"
    },
    "AssetAccountRef": {
      "value": "81",
      "name": "Inventory Asset"
    },
    "TrackQtyOnHand": true,
    "QtyOnHand": 10,
    "InvStartDate": "2023-04-01",
    "PurchaseCost": 125.00,
    "PurchaseDesc": "Garden rocks, fountain supplies",
    "MetaData": {
      "CreateTime": "2023-04-01T12:31:05-07:00",
      "LastUpdatedTime": "2023-04-01T12:31:05-07:00"
    },
    "domain": "QBO",
    "sparse": false,
    "Id": "5",
    "SyncToken": "0"
  },
  "time": "2023-04-01T12:31:05-07:00"
}
```

## Full update an item

### Request Body

```json
{
  "Id": "5",
  "SyncToken": "0",
  "sparse": false,
  "Name": "Rock Fountain - Large",
  "Description": "Updated description for garden rock fountain, larger size",
  "Active": true,
  "FullyQualifiedName": "Rock Fountain - Large",
  "Taxable": true,
  "UnitPrice": 295.00,
  "Type": "Inventory",
  "IncomeAccountRef": {
    "value": "79",
    "name": "Sales of Product Income"
  },
  "ExpenseAccountRef": {
    "value": "80",
    "name": "Cost of Goods Sold"
  },
  "AssetAccountRef": {
    "value": "81",
    "name": "Inventory Asset"
  },
  "TrackQtyOnHand": true,
  "QtyOnHand": 8,
  "InvStartDate": "2023-04-01",
  "PurchaseCost": 145.00,
  "PurchaseDesc": "Premium garden rocks, fountain supplies"
}
```

## Sparse update an item

### Request Body

```json
{
  "Id": "5",
  "SyncToken": "0",
  "sparse": true,
  "UnitPrice": 295.00,
  "QtyOnHand": 8
}
```

## Delete an item

You can mark an item as inactive through an API call. You cannot delete an item.

### Request Body

```json
{
  "Id": "5",
  "SyncToken": "0",
  "Active": false
}
```

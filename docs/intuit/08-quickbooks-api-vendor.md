# QuickBooks API - Vendor Entity

## Overview

The Vendor entity in QuickBooks Online represents suppliers or sellers from whom your company purchases goods or services. This entity contains comprehensive information about vendors, including contact details, payment terms, tax information, and account mappings.

## Data Model

### Key Fields

| Field | Type | Description |
|-------|------|-------------|
| Id | String | Unique identifier for the vendor (read-only) |
| SyncToken | String | Version number to control concurrency during updates |
| DisplayName | String | The name of the vendor as displayed in the UI (required, must be unique) |
| Title | String | Title of the person (e.g., Mr., Mrs., Ms.) |
| GivenName | String | First name of the vendor |
| MiddleName | String | Middle name of the vendor |
| FamilyName | String | Last name of the vendor |
| Suffix | String | Suffix of the vendor's name |
| CompanyName | String | Company name of the vendor |
| PrimaryEmailAddr | EmailAddress | Primary email address |
| PrimaryPhone | PhoneNumber | Primary phone number |
| AlternatePhone | PhoneNumber | Alternate phone number |
| Mobile | PhoneNumber | Mobile phone number |
| Fax | PhoneNumber | Fax number |
| WebAddr | WebSiteAddress | Website address |
| BillAddr | PhysicalAddress | Billing address |
| TaxIdentifier | String | Tax ID of the vendor (masked in responses) |
| AcctNum | String | Account number or identifier assigned to the vendor |
| PrintOnCheckName | String | Name to be printed on checks |
| Active | Boolean | Indicates if the vendor is active |
| Vendor1099 | Boolean | Indicates if this vendor is a 1099 contractor |
| CostRate | Decimal | Default hourly cost rate for the vendor |
| BillRate | Decimal | Default hourly billing rate for the vendor |
| Balance | Decimal | Balance due to this vendor (read-only) |
| TermRef | Reference | Payment terms reference (e.g., Net 30) |
| APAccountRef | Reference | Accounts payable account reference (for some regions) |
| CurrencyRef | Reference | Reference to the currency used |

### Special/Regional Fields

| Field | Type | Description | Region |
|-------|------|-------------|--------|
| GSTIN | String | GST registration number | India |
| GSTRegistrationType | String | GST registration type | India |
| BusinessNumber | String | PAN code | India |
| HasTPAR | Boolean | TPAR enabled flag | Australia |
| T4AEligible | Boolean | T4A eligibility flag | Canada |
| T5018Eligible | Boolean | T5018 eligibility flag | Canada |
| TaxReportingBasis | String | Income tracking method | France |

### Nested Structures

- **EmailAddress**: `{ Address: String }`
- **PhoneNumber**: `{ FreeFormNumber: String }`
- **WebSiteAddress**: `{ URI: String }`
- **PhysicalAddress**:

  ```json
  {
    "Line1": String,
    "Line2": String,
    "Line3": String,
    "Line4": String,
    "Line5": String,
    "City": String,
    "Country": String,
    "CountrySubDivisionCode": String,
    "PostalCode": String
  }
  ```

- **Reference**:

  ```json
  {
    "value": String,
    "name": String
  }
  ```

## Business Rules

- The following fields must not contain colon (:), tab (\t), or newline (\n) characters:
  - DisplayName
  - Title
  - GivenName
  - MiddleName
  - FamilyName
  - Suffix
  - PrintOnCheckName

- DisplayName must be unique across all Customer, Employee, and Vendor objects

- PrimaryEmailAddr must contain @ and . characters

- During creation, either DisplayName or at least one of Title, GivenName, MiddleName, FamilyName, or Suffix is required

## API Operations

### Create a Vendor

**Endpoint**: `POST /v3/company/{realmId}/vendor`

**Content Type**: `application/json`

**Minimum Required Fields**:

- DisplayName (or at least one name component: Title, GivenName, MiddleName, FamilyName, Suffix)

**Sample Request**:

```json
{
  "DisplayName": "ABC Supplies",
  "CompanyName": "ABC Supplies Inc.",
  "PrimaryEmailAddr": {
    "Address": "info@abcsupplies.com"
  },
  "PrimaryPhone": {
    "FreeFormNumber": "555-555-5555"
  },
  "BillAddr": {
    "Line1": "123 Main Street",
    "City": "Mountain View",
    "CountrySubDivisionCode": "CA",
    "PostalCode": "94043",
    "Country": "US"
  }
}
```

### Read a Vendor

**Endpoint**: `GET /v3/company/{realmId}/vendor/{vendorId}`

**Sample Response**:

```json
{
  "Vendor": {
    "Id": "56",
    "SyncToken": "0",
    "DisplayName": "ABC Supplies",
    "CompanyName": "ABC Supplies Inc.",
    "PrimaryEmailAddr": {
      "Address": "info@abcsupplies.com"
    },
    "PrimaryPhone": {
      "FreeFormNumber": "555-555-5555"
    },
    "BillAddr": {
      "Id": "59",
      "Line1": "123 Main Street",
      "City": "Mountain View",
      "CountrySubDivisionCode": "CA",
      "PostalCode": "94043",
      "Country": "US"
    },
    "Active": true,
    "Vendor1099": false,
    "Balance": 0,
    "MetaData": {
      "CreateTime": "2023-01-15T09:48:25-08:00",
      "LastUpdatedTime": "2023-01-15T09:48:25-08:00"
    }
  },
  "time": "2023-01-15T09:50:32.807-08:00"
}
```

### Update a Vendor (Full)

**Endpoint**: `POST /v3/company/{realmId}/vendor`

**Content Type**: `application/json`

**Required Fields**:

- Id
- SyncToken

**Sample Request**:

```json
{
  "Id": "56",
  "SyncToken": "0",
  "DisplayName": "ABC Supplies",
  "CompanyName": "ABC Supplies Inc.",
  "PrimaryEmailAddr": {
    "Address": "newemail@abcsupplies.com"
  },
  "PrimaryPhone": {
    "FreeFormNumber": "555-555-5555"
  },
  "BillAddr": {
    "Id": "59",
    "Line1": "456 New Street",
    "City": "Mountain View",
    "CountrySubDivisionCode": "CA",
    "PostalCode": "94043",
    "Country": "US"
  },
  "Active": true
}
```

### Query Vendors

**Endpoint**: `GET /v3/company/{realmId}/query?query=select * from vendor where {conditions}`

**Example Query**:

```
select * from vendor where Active = true
select * from vendor where Metadata.LastUpdatedTime > '2023-01-01T00:00:00-08:00'
select * from vendor where DisplayName LIKE '%Supplies%'
```

### Delete a Vendor (Sparse Update)

To delete a vendor, set the Active field to false:

**Endpoint**: `POST /v3/company/{realmId}/vendor`

**Content Type**: `application/json`

**Sample Request**:

```json
{
  "Id": "56",
  "SyncToken": "1",
  "Active": false
}
```

## Special Considerations

### 1099 Vendors

For contractors who require 1099 reporting:

1. Set the `Vendor1099` field to `true`
2. Ensure the `TaxIdentifier` field contains a valid tax ID
3. Associate the vendor with appropriate expense accounts

### Address Management

Vendors can have multiple addresses stored in different address fields. The `BillAddr` is the primary address used for vendor communication and documents.

### Currency Considerations

- If `CurrencyRef` is specified, it must match one of the currencies enabled for the company
- If not specified, the home currency of the company is used
- Once set, currency cannot be changed for the vendor

### Name Display Logic

QuickBooks Online uses the following logic to display vendor names:

1. If `CompanyName` is provided, it's used as the primary name
2. If personal name fields are provided (GivenName, FamilyName), they're concatenated
3. `DisplayName` is always shown in lists and must be unique

## Best Practices

1. **Use Unique Identifiers**: Maintain your own system IDs for vendors and store the QuickBooks `Id` for synchronization
2. **Maintain SyncToken**: Always use the latest SyncToken when updating to avoid data conflicts
3. **Efficient Queries**: Use specific queries rather than retrieving all vendors to improve performance
4. **Error Handling**: Implement comprehensive error handling, especially for duplicate DisplayName errors
5. **Data Validation**: Validate email formats, phone numbers, and postal codes before sending to the API
6. **Batch Processing**: When creating or updating multiple vendors, use reasonable batch sizes to avoid rate limits

## Related Entities

- **Bill**: Purchases from vendors
- **Bill Payment**: Payments made to vendors
- **Purchase Order**: Orders submitted to vendors
- **Vendor Credit**: Credit memos from vendors
- **Account**: For AP account references

## Sample Code

### Creating a Vendor

```javascript
async function createVendor(vendorData) {
  return quickbooksRequest("vendor", "POST", {
    Vendor: vendorData
  });
}

// Example usage
const newVendor = {
  DisplayName: "ABC Supplies",
  CompanyName: "ABC Supplies Inc.",
  PrimaryEmailAddr: { Address: "info@abcsupplies.com" },
  PrimaryPhone: { FreeFormNumber: "555-555-5555" }
};

const result = await createVendor(newVendor);
```

### Retrieving Vendors

```javascript
async function findVendors(query = {}) {
  const queryString = buildQueryString({
    entity: "vendor",
    ...query
  });
  return quickbooksRequest(`query?query=${encodeURIComponent(queryString)}`);
}

// Example usage
const activeVendors = await findVendors({ Active: true });
```

## Error Codes

| Error Code | Description | Resolution |
|------------|-------------|------------|
| 6000 | Duplicate Name Exists | Choose a different DisplayName |
| 6560 | Required field is missing | Ensure all required fields are provided |
| 6240 | Invalid email format | Correct the email address format |
| 6140 | Insufficient permissions | Check user permissions |
| 6190 | Invalid reference | Ensure referenced entities exist |

## Additional Resources

- [QuickBooks API Vendor Reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/vendor)
- [Tax Information in QuickBooks](https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-vendors-and-1099-contractors)
- [Address Format Requirements](https://developer.intuit.com/app/developer/qbo/docs/develop/tutorials/manage-addresses)

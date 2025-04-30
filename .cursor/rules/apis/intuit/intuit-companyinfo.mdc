# CompanyInfo

The CompanyInfo entity contains company-level information about the QuickBooks Online company. It's a singleton resource in QuickBooks Online - there's only one CompanyInfo object per company.

## The companyinfo object

```json
{
  "CompanyName": "Acme Inc.",
  "LegalName": "Acme Incorporated",
  "CompanyAddr": {
    "Line1": "123 Main Street",
    "City": "Mountain View",
    "CountrySubDivisionCode": "CA",
    "PostalCode": "94043",
    "Country": "US"
  },
  "CustomerCommunicationAddr": {
    "Line1": "123 Main Street",
    "City": "Mountain View",
    "CountrySubDivisionCode": "CA",
    "PostalCode": "94043",
    "Country": "US"
  },
  "LegalAddr": {
    "Line1": "123 Main Street",
    "City": "Mountain View",
    "CountrySubDivisionCode": "CA",
    "PostalCode": "94043",
    "Country": "US"
  },
  "SupportedLanguages": "en",
  "Country": "US",
  "CompanyStartDate": "2023-01-01",
  "FiscalYearStartMonth": "January",
  "CustomerCommunicationEmailAddr": {
    "Address": "info@acmeinc.com"
  },
  "PrimaryPhone": {
    "FreeFormNumber": "(555) 555-5555"
  },
  "WebAddr": {
    "URI": "https://www.acmeinc.com"
  },
  "NameValue": [
    {
      "Name": "IndustryType",
      "Value": "Computer Equipment and Services"
    },
    {
      "Name": "IndustryCode",
      "Value": "54"
    },
    {
      "Name": "CompanyType",
      "Value": "SCorporation"
    }
  ],
  "Email": {
    "Address": "hr@acmeinc.com"
  },
  "Id": "1",
  "SyncToken": "0",
  "MetaData": {
    "CreateTime": "2023-01-01T00:00:00-08:00",
    "LastUpdatedTime": "2023-01-10T14:21:38-08:00"
  }
}
```

## Query companyinfo

### Request

```
GET /v3/company/<realmId>/query?query=select * from CompanyInfo
```

## Read companyinfo

### Request

```
GET /v3/company/<realmId>/companyinfo/<id>
```

### Response

```json
{
  "CompanyInfo": {
    "CompanyName": "Acme Inc.",
    "LegalName": "Acme Incorporated",
    "CompanyAddr": {
      "Line1": "123 Main Street",
      "City": "Mountain View",
      "CountrySubDivisionCode": "CA",
      "PostalCode": "94043",
      "Country": "US"
    },
    "CustomerCommunicationAddr": {
      "Line1": "123 Main Street",
      "City": "Mountain View",
      "CountrySubDivisionCode": "CA",
      "PostalCode": "94043",
      "Country": "US"
    },
    "LegalAddr": {
      "Line1": "123 Main Street",
      "City": "Mountain View",
      "CountrySubDivisionCode": "CA",
      "PostalCode": "94043",
      "Country": "US"
    },
    "SupportedLanguages": "en",
    "Country": "US",
    "CompanyStartDate": "2023-01-01",
    "FiscalYearStartMonth": "January",
    "CustomerCommunicationEmailAddr": {
      "Address": "info@acmeinc.com"
    },
    "PrimaryPhone": {
      "FreeFormNumber": "(555) 555-5555"
    },
    "WebAddr": {
      "URI": "https://www.acmeinc.com"
    },
    "NameValue": [
      {
        "Name": "IndustryType",
        "Value": "Computer Equipment and Services"
      },
      {
        "Name": "IndustryCode",
        "Value": "54"
      },
      {
        "Name": "CompanyType",
        "Value": "SCorporation"
      }
    ],
    "Email": {
      "Address": "hr@acmeinc.com"
    },
    "domain": "QBO",
    "Id": "1",
    "SyncToken": "0",
    "MetaData": {
      "CreateTime": "2023-01-01T00:00:00-08:00",
      "LastUpdatedTime": "2023-01-10T14:21:38-08:00"
    }
  },
  "time": "2023-02-01T09:52:17-08:00"
}
```

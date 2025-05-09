---
description: 
globs: 
alwaysApply: false
---
 ---
description: Intuit QuickBooks Online Employee API guidelines and specifications
globs: **/apis/intuit/**/*.ts, **/apis/intuit/**/*.js, **/apis/quickbooks/**/*.ts, **/apis/quickbooks/**/*.js
alwaysApply: false
---

# Intuit QuickBooks Online Employee API

This rule documents the Employee API endpoints and object structure for the QuickBooks Online API.

## Employee Object Structure

- **Core Employee Attributes**
  - `Id` (String, filterable, sortable): Unique identifier (read-only, system-defined)
  - `SyncToken` (String): Version number for concurrency control (required for updates)
  - `DisplayName` (String, max 500 chars): Display name of the employee
    - Auto-generated if not provided from Name components
    - Read-only when QuickBooks Payroll is enabled (concatenation of name fields)
  - `GivenName` (String, max 100 chars): First name (at least one of GivenName or FamilyName required)
  - `MiddleName` (String, max 100 chars): Middle name
  - `FamilyName` (String, max 100 chars): Last name (at least one of GivenName or FamilyName required)
  - `Suffix` (String, max 16 chars): Suffix (e.g., "Jr.")
    - Not supported when QuickBooks Payroll is enabled
  - `Title` (String, max 16 chars): Person's title
    - Not supported when QuickBooks Payroll is enabled
  - `PrintOnCheckName` (String, max 100 chars): Name printed on checks
    - Not supported when QuickBooks Payroll is enabled
  - `Active` (Boolean, filterable): Whether employee is active

- **Contact Information**
  - `PrimaryAddr` (PhysicalAddress): Primary address
    - Required when QuickBooks Payroll is enabled
    - Required fields with Payroll: `City`, `CountrySubDivisionCode`, `PostalCode`
  - `PrimaryEmailAddr` (EmailAddress): Primary email
  - `PrimaryPhone` (TelephoneNumber): Primary phone number
  - `Mobile` (TelephoneNumber): Mobile phone number

- **Employee-specific Attributes**
  - `SSN` (String, max 100 chars): Social Security Number
    - Masked in responses as XXX-XX-XXXX
    - Cannot be passed when QuickBooks Payroll is enabled
  - `EmployeeNumber` (String, max 100 chars): Employee ID in employer's directory
  - `BillableTime` (Boolean): Whether employee is eligible for billable time
  - `BillRate` (BigDecimal): Billable rate (only if BillableTime=true)
    - Not supported when QuickBooks Payroll is enabled
  - `CostRate` (BigDecimal): Pay rate of the employee
  - `BirthDate` (Date): Birth date
  - `Gender` (String): Gender (values: "Male", "Female")
    - Set to null in full update request to clear
  - `HiredDate` (Date): Hire date
  - `ReleasedDate` (Date): Release date
  - `Organization` (Boolean): Whether entity represents an organization (true) or person (false)

- **System Fields**
  - `MetaData` (ModificationMetaData): Contains creation and modification timestamps
  - `V4IDPseudonym` (String): Employee reference number (internal use only)

## Important Validation Rules

- The display name must be unique across customers, employees, and vendors
- Name fields must not contain colons (:), tabs (\\t), or newlines (\\n)
- Email address must contain @ and . characters
- At least one of GivenName or FamilyName is required

## API Endpoints

- **Create Employee**
  - `POST /v3/company/<realmID>/employee`
  - Required fields: At least one of GivenName or FamilyName
  - Returns the newly created Employee object

- **Read Employee**
  - `GET /v3/company/<realmID>/employee/<employeeId>`
  - Returns the Employee object

- **Update Employee**
  - `POST /v3/company/<realmID>/employee` (full update)
  - Required fields: Id, SyncToken, and all fields to be retained
  - Omitted writable fields will be set to NULL
  - Returns the updated Employee object

- **Query Employees**
  - `GET /v3/company/<realmID>/query?query=<selectStatement>`
  - Example: `select * from Employee where DisplayName = 'Emily Platt'`
  - Returns array of matching Employee objects

## QuickBooks Payroll Considerations

- Check if payroll is enabled by querying CompanyInfo for `{"Name": "PayrollFeature", "Value": "true"}`
- When payroll is enabled:
  - `Title`, `Suffix`, and `PrintOnCheckName` are not supported
  - `DisplayName` is read-only (auto-generated from name fields)
  - `BillRate` is not supported
  - `SSN` cannot be passed in requests (must be removed from code)
  - `PrimaryAddr` is required with `City`, `CountrySubDivisionCode`, and `PostalCode`

## Sample Code (TypeScript)

```typescript
// Employee interface
interface Employee {
  Id?: string;
  SyncToken?: string;
  DisplayName?: string;
  GivenName?: string;
  MiddleName?: string;
  FamilyName?: string;
  Suffix?: string;
  Title?: string;
  Active?: boolean;
  PrimaryAddr?: {
    Line1?: string;
    City?: string;
    CountrySubDivisionCode?: string;
    PostalCode?: string;
  };
  PrimaryEmailAddr?: {
    Address?: string;
  };
  PrimaryPhone?: {
    FreeFormNumber?: string;
  };
  SSN?: string;
  EmployeeNumber?: string;
  BillableTime?: boolean;
  BillRate?: number;
  BirthDate?: string; // ISO date format
  Gender?: 'Male' | 'Female' | null;
  HiredDate?: string; // ISO date format
  ReleasedDate?: string; // ISO date format
}

// Create employee example
async function createEmployee(client, employee: Employee) {
  try {
    const response = await client.post('/employee', employee);
    return response.data.Employee;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
}

// Update employee example
async function updateEmployee(client, employee: Employee) {
  if (!employee.Id || !employee.SyncToken) {
    throw new Error('Employee Id and SyncToken are required for updates');
  }
  
  try {
    const response = await client.post('/employee', employee);
    return response.data.Employee;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
}

// Query employees by name example
async function findEmployeeByName(client, name: string) {
  try {
    const query = `select * from Employee where DisplayName = '${name}'`;
    const response = await client.get(`/query?query=${encodeURIComponent(query)}`);
    return response.data.QueryResponse.Employee || [];
  } catch (error) {
    console.error('Error querying employees:', error);
    throw error;
  }
}
```

## Best Practices

- **Check for Payroll**
  - Always check if the company has QuickBooks Payroll enabled before creating/updating employees
  - Adjust your code to handle the restricted fields based on payroll status

- **Error Handling**
  - Handle concurrency errors (SyncToken mismatch)
  - Handle validation errors for required fields

- **Security**
  - Never store unmasked SSNs
  - Remove SSN field from code when Payroll is enabled

- **Data Validation**
  - Ensure DisplayName uniqueness
  - Validate email format
  - Ensure at least one name field is provided
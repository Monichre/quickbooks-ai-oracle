# CreateCustomerDialog_PSEUDOCODE.md

## Goal

Update the customer creation form to fully conform to the QuickBooks Online API spec, including all required and recommended fields, proper validation, and correct payload mapping.

---

## Form Structure

- **DisplayName** (required, string)
- **GivenName** (optional, string)
- **FamilyName** (optional, string)
- **CompanyName** (optional, string)
- **PrimaryEmailAddr.Address** (optional, string, must be valid email if present)
- **PrimaryPhone.FreeFormNumber** (optional, string)
- **BillAddr** (optional, object)
  - Line1 (optional, string)
  - City (optional, string)
  - CountrySubDivisionCode (optional, string)
  - PostalCode (optional, string)
  - Country (optional, string)

---

## Validation

- **DisplayName**
  - Required
  - Must not contain colons (:), tabs (\t), or newlines (\n)
- **GivenName, FamilyName, CompanyName**
  - Optional
  - Must not contain colons (:), tabs (\t), or newlines (\n)
- **PrimaryEmailAddr.Address**
  - Optional
  - If present, must be a valid email
- **PrimaryPhone.FreeFormNumber**
  - Optional
  - If present, should be a valid phone number (basic pattern)
- **BillAddr fields**
  - All optional
  - If any BillAddr field is filled, Line1 should be required

---

## Form State

- Use react-hook-form with Zod schema for validation
- Default values: all fields empty

---

## UI Layout

- Group BillAddr fields under a "Billing Address" section
- Use text inputs for all fields
- Show validation errors inline
- Show API errors at the top
- Show loading state on submit

---

## Payload Mapping

On submit, build the payload as follows:

```typescript
const payload = {
  DisplayName,
  GivenName, // if present
  FamilyName, // if present
  CompanyName, // if present
  PrimaryEmailAddr: Email ? { Address: Email } : undefined,
  PrimaryPhone: Phone ? { FreeFormNumber: Phone } : undefined,
  BillAddr: any BillAddr field present ? {
    Line1,
    City,
    CountrySubDivisionCode,
    PostalCode,
    Country,
  } : undefined,
}
```

---

## Pseudocode

```typescript
// Form fields
const fields = {
  DisplayName: '',
  GivenName: '',
  FamilyName: '',
  CompanyName: '',
  Email: '',
  Phone: '',
  BillAddr: {
    Line1: '',
    City: '',
    CountrySubDivisionCode: '',
    PostalCode: '',
    Country: '',
  },
}

// Zod schema
const customerSchema = z.object({
  DisplayName: z.string().min(1).refine(noColonsTabsNewlines),
  GivenName: z.string().optional().refine(noColonsTabsNewlines),
  FamilyName: z.string().optional().refine(noColonsTabsNewlines),
  CompanyName: z.string().optional().refine(noColonsTabsNewlines),
  Email: z.string().email().optional().or(z.literal('')),
  Phone: z.string().optional(),
  BillAddr: z.object({
    Line1: z.string().optional(),
    City: z.string().optional(),
    CountrySubDivisionCode: z.string().optional(),
    PostalCode: z.string().optional(),
    Country: z.string().optional(),
  }).optional(),
}).refine(
  (data) => {
    // If any BillAddr field is filled, Line1 must be present
    const addr = data.BillAddr || {}
    const anyFilled = Object.values(addr).some(Boolean)
    return !anyFilled || !!addr.Line1
  },
  { message: 'Line1 is required if any billing address field is filled', path: ['BillAddr', 'Line1'] }
)

// On submit
const payload = {
  DisplayName: fields.DisplayName,
  GivenName: fields.GivenName || undefined,
  FamilyName: fields.FamilyName || undefined,
  CompanyName: fields.CompanyName || undefined,
  PrimaryEmailAddr: fields.Email ? { Address: fields.Email } : undefined,
  PrimaryPhone: fields.Phone ? { FreeFormNumber: fields.Phone } : undefined,
  BillAddr: anyBillAddrFieldPresent(fields.BillAddr) ? {
    Line1: fields.BillAddr.Line1,
    City: fields.BillAddr.City,
    CountrySubDivisionCode: fields.BillAddr.CountrySubDivisionCode,
    PostalCode: fields.BillAddr.PostalCode,
    Country: fields.BillAddr.Country,
  } : undefined,
}

// Call createCustomerAction(payload)
```

---

## Edge Cases

- DisplayName uniqueness is enforced by backend; show error if duplicate
- All string fields must not contain forbidden characters
- If user fills any BillAddr field, Line1 is required
- All fields optional except DisplayName

# Pseudocode: Full Spec Compliance for CreateEstimatePage

## 1. Extend EstimateForm Schema

- Add BillAddr, ShipAddr, BillEmail fields (all optional, with validation)
- Add CurrencyRef (required if multicurrency enabled)
- Add DueDate, ExpirationDate, CustomField, Status, etc. (optional)
- Refactor Line array to support multiple line types (SalesItemLineDetail, GroupLineDetail, DiscountLineDetail, SubTotalLineDetail, DescriptionOnlyLineDetail)

## 2. UI Changes

- Add address fields (BillAddr, ShipAddr) as collapsible/optional sections
- Add BillEmail input
- Add CurrencyRef dropdown (conditionally rendered if multicurrency enabled)
- Add DueDate, ExpirationDate, CustomField, Status fields as needed
- Refactor LineItemsEditor:
  - Allow user to select line type per row
  - Render appropriate fields for each line type
  - Validate required fields per type

## 3. Data Flow

- On submit, build EstimateCreateRequest object with all populated fields
- Only include optional fields if user provided values
- Pass to createEstimateAction as before

## 4. API/Type Changes

- Ensure EstimateCreateRequest and EstimateLine types support all fields
- Update createEstimateAction schema to match new form

## 5. Testing

- Add tests for new fields and line types
- Test with/without optional fields, with multicurrency, with different line types

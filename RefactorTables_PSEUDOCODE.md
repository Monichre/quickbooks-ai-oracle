# RefactorTables_PSEUDOCODE

## 1. Analyze Current Table Usage

- Both `purchase-orders/page.tsx` and `estimates/page.tsx`:
  - Fetch data from respective API.
  - Render a table with hardcoded columns and rows.
  - Use vanilla HTML table markup.

## 2. Analyze EntityTable

- `EntityTable` expects:
  - `entity`: string (e.g., 'purchase-orders', 'estimates')
  - `initialData`: QuickBooksResponse (with QueryResponse containing array of entities)
- Handles:
  - Dynamic columns based on data keys.
  - Filtering, sorting, pagination.
  - Error and empty states.

## 3. Refactor Each Page

- Remove vanilla table markup.
- Import and use `EntityTable`.
- Fetch data as before.
- Pass:
  - `entity` as a string ('purchase-orders' or 'estimates')
  - `initialData` as the API response object.

## 4. Adjust Data Fetching (if needed)

- Ensure API response matches:
  - `{ QueryResponse: { [EntityKey]: EntityObject[] } }`
- If not, wrap/transform as needed.

## 5. Test

- Validate:
  - All columns appear.
  - Sorting, filtering, pagination work.
  - Error and empty states render as expected.

## 6. Document

- Write up architecture, data flow, and usage in `RefactorTables.md`.

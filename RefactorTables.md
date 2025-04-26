# RefactorTables

## Overview

This refactor replaces the vanilla HTML tables in `src/app/dashboard/purchase-orders/page.tsx` and `src/app/dashboard/estimates/page.tsx` with a reusable, feature-rich table component based on TanStack React Table. The new implementation leverages the `EntityTable` component from `src/app/dashboard/[entity]/entity-table.tsx`.

## Architecture

- **EntityTable**: A generic, dynamic table component that uses TanStack React Table for advanced features (sorting, filtering, pagination, column pinning, etc.).
- **Page Components**: `purchase-orders/page.tsx` and `estimates/page.tsx` now simply fetch their data and render `EntityTable`, passing the correct props.
- **Data Flow**:
  1. Page fetches data from the appropriate API (`findPurchases` or `findEstimates`).
  2. The API response is passed as `initialData` to `EntityTable`, along with the `entity` string (e.g., 'purchase-orders', 'estimates').
  3. `EntityTable` dynamically determines columns and renders the table UI, handling all user interactions.

## Key Modules

- `src/app/dashboard/[entity]/entity-table.tsx`: The core table component, responsible for rendering, sorting, filtering, and paginating entity data.
- `src/app/dashboard/purchase-orders/page.tsx`: Now imports and uses `EntityTable`, passing `entity='purchase-orders'` and the API response.
- `src/app/dashboard/estimates/page.tsx`: Now imports and uses `EntityTable`, passing `entity='estimates'` and the API response.

## Improvements

- **Maintainability**: Table logic is centralized in `EntityTable`, reducing code duplication and making future changes easier.
- **Scalability**: New entity tables can be added by simply reusing `EntityTable` with different data.
- **Feature Set**: Users get advanced table features (sorting, filtering, pagination, column pinning, etc.) out of the box.
- **Consistency**: All entity tables now share a consistent UI/UX and code structure.

## Usage Example

```tsx
// In purchase-orders/page.tsx
<EntityTable entity='purchase-orders' initialData={purchasesResponse} />

// In estimates/page.tsx
<EntityTable entity='estimates' initialData={estimatesResponse} />
```

## References

- [entity-table.tsx](mdc:src/app/dashboard/[entity]/entity-table.tsx)
- [purchase-orders/page.tsx](mdc:src/app/dashboard/purchase-orders/page.tsx)
- [estimates/page.tsx](mdc:src/app/dashboard/estimates/page.tsx)

# 01 – UI : Add Dropdown Action Column

**Status:** ✅ done

**Depends on:** none

## Goal

Add a pinned right-hand dropdown to each row of the **Estimates** table inside `EntityTable` that allows users to choose **Create Purchase Order** or **Create Invoice**.

## Acceptance Criteria

- [x] Dropdown appears only when `entity === 'estimates'`.
- [x] Uses shadcn `DropdownMenu`, consistent styling with other action buttons.
- [x] Two menu items trigger callbacks with the full `Estimate` object.
- [x] Existing Eye / ExternalLink buttons remain functional.
- [x] ESLint warnings relating to unstable callback deps are resolved.
- [x] No significant performance regression (render diff <50 ms per 500 rows measured via React profiler).

## Implementation Notes

1. **Component Refactor**
   - Move `navigateToEntityDetail` & `openQuickView` into `useCallback` hooks so they're stable references.
   - Extract column generation logic into `useMemo` that depends only on stable values.
2. **Dropdown Column**
   - Add new column `actions` pinned right.
   - Content: `DropdownMenuTrigger` (icon button). Items: _Create Purchase Order_, _Create Invoice_.
   - Use `onSelect={() => handleCreatePO(row.original)}` etc.
3. **Event Propagation**
   - Lift handlers to EstimatesPage via prop callback, or use a context/Router push.
4. **Type Safety**
   - Ensure callbacks accept `Estimate` typed object (import from `estimate.types.ts`).

## Implementation Summary

- Added dropdown menu for estimates using shadcn's `DropdownMenu` components
- Implemented callbacks with proper type safety
- Refactored callbacks to use `useCallback` to fix ESLint warnings
- Added unit tests to verify functionality
- Created documentation in `/docs/intuit/UI-AddDropdownActionColumn.md`

## Out of Scope

- Actual routing / API calls (handled by later tickets).

## Test Strategy

- Unit: render table with mock Estimate data, fire dropdown click, assert handler called.
- Visual: Storybook entry showing dropdown presence.

# 14 – UI : Revamp Estimates Table Styling

**Status:** ⏳ pending

**Depends on:** 01 (column dropdown)

## Goal

Align the **Estimates** dashboard table visual appearance with the look & feel of the reference screenshots (`@estimate-screen.png`, `@view-estimate-screen.png`).

## Acceptance Criteria

- [ ] Table header background `#F9FAFB` (light grey) with 1 px bottom border.
- [ ] Row hover state uses Tailwind `bg-gray-50`.
- [ ] Fixed column widths so `Amount` and `Date` align with right edge.
- [ ] Customer name column shows avatar initials circle (fallback) or company logo.
- [ ] Status badge (color-coded) in its own column: `Pending` (yellow), `Accepted` (green), `Expired` (red).
- [ ] Responsive: collapses to card list on <640 px viewport.
- [ ] No CLS; skeleton rows maintain height during fetch.

## Implementation Notes

1. **Component Layer**
   - Extend `EntityTable` with a `variant="estimates"` prop for table class overrides.
2. **Avatar**
   - Use existing `components/ui/avatar` or create if missing. Generate initials from `CustomerRef?.name`.
3. **Status Pill**
   - Use shadcn `Badge` component. Map QuickBooks status.
4. **Responsive Card**
   - On mobile, each Estimate renders as `EstimateCard` with grid layout (see screenshot). Use `@tailwindcss/line-clamp` for long descriptions.

## Out of Scope

- Dropdown action column (covered by ticket 01).

## Test Strategy

- Percy visual diff against baseline.
- Manual check on iPhone SE + Desktop 1440 px.

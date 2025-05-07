# 15 – UI : Polish Estimate Detail Layout

**Status:** ⏳ pending

**Depends on:** 14

## Goal

Refine the **Estimate Detail** page to better match the visual hierarchy and spacing of the reference screenshots.

## Acceptance Criteria

- [ ] Use two-column layout where summary card (total, status, dates) sits on right for ≥1024 px screens.
- [ ] Customer info card adopts same card style with subtle shadow and rounded corners.
- [ ] Line items table header sticky within scroll container.
- [ ] Totals section floats at bottom right of table container on desktop.
- [ ] "Notes" section uses `textarea`-like monospace font styling.
- [ ] Replace generic black background classes with Tailwind theme-based neutrals.
- [ ] Print button appears beside Edit & Create PO buttons (from ticket 12).

## Implementation Notes

1. **Grid**: use `lg:grid lg:grid-cols-[2fr_1fr] lg:gap-8`.
2. **Sticky totals**: wrap table in `relative`, place `TotalsCard` `absolute` bottom-0 right-0.
3. **Colors**: adhere to design token palette (check `tailwind.config.ts`).

## Test Strategy

- Storybook variant for `>lg` and `<md` viewports.
- Axe audit for accessibility.

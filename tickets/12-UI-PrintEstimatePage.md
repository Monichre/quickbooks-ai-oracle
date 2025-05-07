# 12 – UI : Print Estimate Page & Actions

**Status:** ⏳ pending

**Depends on:** 11

## Goal

Enable users to generate a **print-friendly** view of an Estimate inside the Dashboard and provide options to **download PDF** or **send via email**.

## Acceptance Criteria

- [ ] `@EditEstimatePage()` and `@EstimateDetailPage()` show a **Print** button (icon + text) in the top-right action bar.
- [ ] Clicking **Print** navigates to `/dashboard/estimates/[id]/print` (new route, server component) and opens in a new browser tab.
- [ ] The print page renders the static HTML produced by ticket 11 and invokes `window.print()` automatically when loaded.
- [ ] The route supports `?download=1` to trigger `Content-Disposition: attachment` with filename `Estimate-<DocNumber>.pdf`.
- [ ] The route supports `?email=user@example.com` to queue an email job (ticket 13) and returns 202 with JSON `{queued: true}`.
- [ ] Loading state displays skeleton while `renderEstimatePdf` is running.
- [ ] Error boundary shows toast + fallback UI.
- [ ] Lighthouse PDF/print audit score ≥ 95.

## UI Mockups

Refer to **@estimate-print-preview.png** and **@view-estimate-screen.png** screenshots. Layout must closely match sample
including font sizes, table borders, and totals alignment.

## Implementation Notes

1. **Route**: `app/dashboard/estimates/[id]/print/route.ts` (Next.js Route Handler) for PDF binary; `page.tsx` for preview.
2. **Actions**: Add `generatePdfAction(id: string)` server action that calls `renderEstimatePdf`.
3. **Client Component**: Small `PrintDialog.tsx` with Download + Email buttons (uses `useTransition`).
4. **Accessibility**: Ensure buttons have `aria-label="Print Estimate as PDF"` etc.
5. **Navigation**: Keep existing links functional; `prefetch={false}` on print route to reduce bundle size.

## Out of Scope

- Actual email send (ticket 13).
- PDF styling (handled in ticket 11 template).

## Test Strategy

- Cypress E2E: load detail page, click Print, assert new tab PDF renders.
- Unit: mock action returns Buffer length >0.
- Visual: Storybook story for `PrintDialog`.

# 12 – UI : Print Estimate Page & Actions

**Status:** ✅ done

**Depends on:** 11

## Goal

Enable users to generate a **print-friendly** view of an Estimate inside the Dashboard and provide options to **download PDF** or **send via email**.

## Acceptance Criteria

- [x] `@EditEstimatePage()` and `@EstimateDetailPage()` show a **Print** button (icon + text) in the top-right action bar.
- [x] Clicking **Print** navigates to `/dashboard/estimates/[id]/print` (new route, server component) and opens in a new browser tab.
- [x] The print page renders the static HTML produced by ticket 11 and invokes `window.print()` automatically when loaded.
- [x] The route supports `?download=1` to trigger `Content-Disposition: attachment` with filename `Estimate-<DocNumber>.pdf`.
- [x] The route supports `?email=user@example.com` to queue an email job (ticket 13) and returns 202 with JSON `{queued: true}`.
- [x] Loading state displays skeleton while `renderEstimatePdf` is running.
- [x] Error boundary shows toast + fallback UI.
- [x] Lighthouse PDF/print audit score ≥ 95.

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

## Documentation

### Module Structure

- **Page Components**:
  - `src/app/dashboard/estimates/[id]/print/page.tsx` - Print preview page
  - `src/app/dashboard/estimates/[id]/print/route.ts` - API route for PDF download
- **UI Components**:
  - `src/components/estimates/PrintButton.tsx` - Print button for estimate pages
  - `src/components/estimates/PrintDialog.tsx` - Dialog with email/download options
- **Actions**:
  - `src/app/actions/estimate-pdf-actions.ts` - Server actions for PDF generation
- **Tests**:
  - `src/components/estimates/__tests__/PrintButton.test.tsx`
  - `src/app/dashboard/estimates/[id]/print/__tests__/route.test.ts`

### Key Features

1. **Print Preview**:
   - Server-side rendering of estimate data using the HTML template
   - Automatic print dialog triggering with `window.print()`
   - Clean print styles with responsive layout

2. **PDF Download**:
   - Content-Disposition header configuration for attachment download
   - Properly formatted filename including estimate number
   - Server-side PDF generation using the utility from ticket 11

3. **Email Integration**:
   - Queue-based email sending via API endpoint
   - Email validation and error handling
   - Success/failure status responses

4. **UX Enhancements**:
   - Loading skeleton during PDF generation
   - Error boundary with helpful user feedback
   - Accessible button interactions with proper ARIA attributes

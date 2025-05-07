# 11 – Utility : Generate Estimate ➜ PDF

**Status:** ⏳ pending

**Depends on:** none

## Goal

Provide a deterministic utility that converts an **Estimate** object into an HTML string and then into a **PDF** buffer that can be served to the client or attached to an email.

## Acceptance Criteria

- [ ] Exported function `renderEstimatePdf(est: Estimate): Promise<Buffer>`
- [ ] Uses headless Chromium via `@puppeteer` or `@playwright` (whichever is already in the project) **server-side only**.
- [ ] Layout must match reference screenshots – logo, customer section, line items table, totals, and footer.
- [ ] Output PDF is A4 (8.27 × 11.69 in) with 0.5in margins.
- [ ] Function throws descriptive errors for missing required fields.
- [ ] Jest tests cover: successful render, invalid estimate (missing Line items), and large estimate (>50 lines) performance (<3 s).
- [ ] No **client-side** JS leakage (function must never run in the browser bundle).

## Implementation Notes

1. **Template**
   - Create `estimate-print.template.tsx` using Tailwind-in-JIT for styling or inline CSS if Tailwind not available in Node.
   - Render React component to string via `renderToStaticMarkup`.
2. **PDF Engine**
   - Launch headless Chromium once per Lambda/process and reuse to avoid cold-start cost.
   - Use `page.setContent(html)` then `page.pdf()` with `printBackground: true`.
3. **Assets**
   - Inline fonts or reference Google Fonts with proper license.
   - Logo pulled from `public/logo-dark.png`.
4. **Performance**
   - Memoize compiled HTML template per DocNumber to avoid re-render when unchanged.
5. **Error Handling & Logging**
   - Wrap in try/catch and log to Sentry with context (DocNumber, CustomerRef.value) when failures occur.

## Out of Scope

- Email sending (handled by ticket 13).
- UI integration on Next.js pages (ticket 12).

## Test Strategy

- Unit: mock Puppeteer, assert PDF Buffer size >10 kB.
- Integration: spawn real Chromium in CI workflow using `--no-sandbox` and ensure render completes <5 s.

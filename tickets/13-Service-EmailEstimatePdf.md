# 13 – Service : Email Estimate PDF

**Status:** ⏳ pending

**Depends on:** 11,12

## Goal

Provide a reusable service that sends an **Estimate PDF** as an email attachment to a specified recipient using the project's configured email provider (e.g., Resend, Postmark, or AWS SES).

## Acceptance Criteria

- [ ] Exported async function `sendEstimatePdfEmail(opts: { estimateId: string; to: string; }): Promise<{ messageId: string }>`
- [ ] Retrieves Estimate via existing `getEstimate()` service if object not provided.
- [ ] Generates PDF via `renderEstimatePdf` (ticket 11).
- [ ] Email subject: `Estimate <DocNumber> from <CompanyName>`.
- [ ] Email body (HTML + plain text) includes greeting, short description, and link back to Estimate detail page.
- [ ] Attaches PDF with correct MIME type (`application/pdf`) and filename `Estimate-<DocNumber>.pdf`.
- [ ] Respects rate limits; queue job via BullMQ if in production.
- [ ] Throws descriptive errors (invalid recipient, send failure).
- [ ] Unit tests mock email provider SDK and assert payload.

## Implementation Notes

1. **Provider Abstraction**
   - Add `EmailProvider` interface with `send(mail: MailOptions)` and put provider-specific code under `services/email/providers/*`.
   - Default to `Resend` if `RESEND_API_KEY` env var present.
2. **HTML Template**
   - Use MJML or simple inline-styles component for consistent rendering.
3. **Feature Flag**
   - `ESTIMATES_EMAIL_ENABLED` env gate.
4. **Error Handling**
   - Wrap send in try/catch, log failures to Sentry.

## Out of Scope

- UI for entering custom email body (future ticket).

## Test Strategy

- Jest: mock `renderEstimatePdf` returns dummy Buffer, assert send called with attachment.
- E2E: staging environment sends real email to Mailosaur inbox, assert receipt.

# 00 – Overview

This epic introduces the ability to generate QuickBooks **Purchase Orders** (PO) or **Invoices** from existing **Estimates**.

Reference: _tickets/TODO.md_ (initial master ticket).

## Workflow Summary

1. User views the Estimates dashboard table.
2. A dropdown on each row offers:
   - **Create Purchase Order** (vendor-facing)
   - **Create Invoice** (customer-facing)
3. Selecting an option opens a pre-filled creation page.
4. User reviews > saves. The system persists the document in QuickBooks and refreshes relevant dashboard tables.
5. (Stretch) An AI-Assist option can auto-generate PO payloads from a document or in-memory Estimate object.

## Ticket List

| ID | Title | Depends On | Status |
|----|-------|------------|--------|
| 01 | UI – Add Dropdown Action Column | – | ⏳ |
| 02 | Utility – Map Estimate ➜ PurchaseOrder | – | ⏳ |
| 03 | Utility – Map Estimate ➜ Invoice | – | ⏳ |
| 04 | API – Invoice Service Wrapper | – | ⏳ |
| 05 | API – Bulk PurchaseOrder Support | 02 | ⏳ |
| 06 | Page – Prefill Purchase Order Create | 01,02,05 | ⏳ |
| 07 | Page – Prefill Invoice Create | 01,03,04 | ⏳ |
| 08 | Validation & Error Handling | 06,07 | ⏳ |
| 09 | AI-Assist API (Stretch) | 02 | ⏳ |
| 10 | Documentation & Demo | 06,07,08 | ⏳ |
| 16 | UI – Copy to Purchase Order Action (Detail Page) | 01 | ⏳ |
| 17 | Page – Create Purchase Order Form | 16,02,05 | ⏳ |
| 18 | Validation & Mapping Enhancements | 17 | ⏳ |
| 19 | Docs – Linking PO → Bills/Expenses Flow | – | ⏳ |

---
**Legend**: ⏳ pending · ✅ done · 🛑 blocked

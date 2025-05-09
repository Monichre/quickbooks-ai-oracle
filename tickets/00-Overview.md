# 00 – Overview

This epic introduces the ability to generate QuickBooks **Purchase Orders** (PO) or **Invoices** from existing **Estimates**.

Reference: _tickets/TODO.md_ (initial master ticket).


## Ticket List

| ID | Title | Depends On | Status |
|----|-------|------------|--------|
| 01 | UI – Add Dropdown Action Column | – | ✅ |
| 02 | Utility – Map Estimate ➜ PurchaseOrder | ✅ | ⏳ |
| 03 | Utility – Map Estimate ➜ Invoice | – | ✅ |
| 04 | API – Invoice Service Wrapper | – | ✅ |
| 05 | API – Bulk PurchaseOrder Support | 02 | ⏳ |
| 06 | Page – Prefill Purchase Order Create | 01,02,05 | ✅ |
| 07 | Page – Prefill Invoice Create | 01,03,04 | ⏳ |
| 08 | Validation & Error Handling | 06,07 | ⏳ |
| 09 | AI-Assist API (Stretch) | 02 | ⏳ |
| 10 | Documentation & Demo | 06,07,08 | ⏳ |
| 16 | UI – Copy to Purchase Order Action (Detail Page) | 01 | ⏳ |
| 17 | Page – Create Purchase Order Form | 16,02,05 | ⏳ |
| 18 | Validation & Mapping Enhancements | 17 | ⏳ |
| 19 | Docs – Linking PO → Bills/Expenses Flow | – | ⏳ |
| 20 | Integration – Midday Invoice Components | 03,04,07 | ⏳ |
| 21 | Midday – Dependency Analysis | – | ✅ |
| 22 | Midday – Invoice PDF Template | 21,04 | ⏳ |
| 23 | Midday – Invoice React Template | 21,07 | ⏳ |
| 24 | Midday – Invoice Open Graph | 21,23 | 🛑 |
| 25 | Midday – Invoice Toolbar | 21,23 | 🛑 |
| 26 | Midday – Integration Testing | 22,23,24,25 | 🛑 |
| 27 | Midday – Document Processor | 21 | ⏳ |
| 28 | Midday – Future Invoice Editor | 21 | ⏳ |

---
**Legend**: ⏳ pending · ✅ done · 🛑 blocked
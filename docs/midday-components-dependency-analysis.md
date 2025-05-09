# Midday Components: Dependency Analysis

This document provides a comprehensive analysis of dependencies required for integrating Midday invoice and document processing components into the QuickBooks Oracle project.

## Overview

The [Midday](https://github.com/midday-ai/midday) project is an open-source platform for freelancers and small businesses with components that we plan to integrate:

1. Invoice PDF Template
2. Invoice React Template
3. Invoice Open Graph
4. Invoice Toolbar
5. Document Processor

## Core Dependencies Analysis

### Already Installed Dependencies (Compatible)

The following dependencies are already in our project and compatible with Midday requirements:

| Dependency | Current Version | Required Version | Status |
|------------|-----------------|------------------|--------|
| React | 19.0.0 | >=19.0.0 | ✅ Compatible |
| React DOM | 19.0.0 | >=19.0.0 | ✅ Compatible |
| Next.js | 15.2.2 | >=14.0.0 | ✅ Compatible |
| Tailwind CSS | 4.0.14 | >=3.3.0 | ✅ Compatible |
| date-fns | 4.1.0 | ^4.1.0 | ✅ Compatible |
| zod | 3.24.3 | ^3.24.3 | ✅ Compatible |
| Radix UI (various) | Latest | Latest | ✅ Compatible |
| lucide-react | 0.503.0 | Any | ✅ Compatible |
| clsx | 2.1.1 | Any | ✅ Compatible |
| tailwind-merge | 3.0.2 | Any | ✅ Compatible |

### New Dependencies Required

The following dependencies need to be added to our project:

| Dependency | Required Version | Purpose |
|------------|------------------|---------|
| @react-pdf/renderer | ^4.0.0 | PDF generation for invoices |
| qrcode | ^1.5.4 | Generate QR codes for invoice sharing |
| jose | ^5.9.6 | JWT handling for secure document sharing |
| @tiptap/react | ^2.1.15 | Rich text editing for invoice templates |
| @tiptap/extension-* | ^2.1.15 | Various Tiptap extensions for formatting |
| embla-carousel-react | ^8.0.0 | UI carousels for document previews |
| mammoth | ^1.9.0 | Document parsing (already installed) |
| unpdf | ^0.12.2 | PDF parsing for document processor |
| officeparser | ^5.1.1 | Office document parsing |

## Potential Conflicts

1. **No Major Conflicts**: Most dependencies are either compatible or non-overlapping.

2. **Tailwind Configuration**: Midday uses a specific Tailwind configuration that may need to be merged with our existing setup.

3. **React Version**: Our project uses React 19, which is the latest version. This should be compatible, but thorough testing is recommended.

## Package.json Updates

Add the following to package.json:

```json
{
  "dependencies": {
    "@react-pdf/renderer": "^4.0.0",
    "qrcode": "^1.5.4",
    "jose": "^5.9.6",
    "@tiptap/react": "^2.1.15",
    "@tiptap/extension-heading": "^2.1.15",
    "@tiptap/extension-paragraph": "^2.1.15",
    "@tiptap/extension-document": "^2.1.15",
    "@tiptap/extension-text": "^2.1.15",
    "@tiptap/extension-bullet-list": "^2.1.15",
    "@tiptap/extension-list-item": "^2.1.15",
    "@tiptap/extension-bold": "^2.1.15",
    "@tiptap/extension-italic": "^2.1.15",
    "unpdf": "^0.12.2",
    "officeparser": "^5.1.1"
  }
}
```

## Project Structure for Midday Integration

We recommend the following folder structure for Midday component wrappers:

```
src/
  components/
    midday/
      invoice/
        InvoicePdfTemplate.tsx
        InvoiceReactTemplate.tsx
        InvoiceOpenGraph.tsx
        InvoiceToolbar.tsx
      documents/
        DocumentProcessor.tsx
  lib/
    midday/
      invoice-utils.ts
      document-utils.ts
```

## Integration Strategy

1. **Phased Approach**: Implement components in the following order:
   - Invoice PDF Template
   - Invoice React Template 
   - Document Processor
   - Invoice Open Graph
   - Invoice Toolbar

2. **Wrapper Pattern**: Create wrapper components that adapt Midday's components to our data structures.

3. **Data Transformation**: Implement utility functions to transform our data models to Midday's expected format.

## Next Steps

1. Install required dependencies
2. Create the recommended folder structure
3. Implement wrapper components for each Midday feature
4. Write unit tests
5. Document usage examples

## Conclusion

The integration of Midday components is technically feasible with minimal conflicts. The primary work will involve creating appropriate wrapper components and data transformation utilities to bridge our system with Midday's component APIs.
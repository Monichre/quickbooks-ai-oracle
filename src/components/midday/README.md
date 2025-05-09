# Midday Components Integration

This directory contains wrapper components for integrating [Midday](https://github.com/midday-ai/midday) components into the QuickBooks Oracle project.

## Components

### Invoice Components

Located in `/src/components/midday/invoice/`:

- **InvoicePdfTemplate** - For generating PDF invoices using @react-pdf/renderer
- **InvoiceReactTemplate** - For interactive invoice viewing and editing
- **InvoiceOpenGraph** (coming soon) - For generating shareable invoice previews
- **InvoiceToolbar** (coming soon) - For invoice collaboration and annotations

### Document Processing Components

Located in `/src/components/midday/documents/`:

- **DocumentProcessor** - For processing and analyzing documents

## Installation

Before using these components, you need to install the required dependencies:

```bash
# Using npm
npm install qrcode @react-pdf/renderer jose @tiptap/react @tiptap/extension-heading @tiptap/extension-paragraph @tiptap/extension-document @tiptap/extension-text @tiptap/extension-bullet-list @tiptap/extension-list-item @tiptap/extension-bold @tiptap/extension-italic unpdf officeparser

# Using yarn
yarn add qrcode @react-pdf/renderer jose @tiptap/react @tiptap/extension-heading @tiptap/extension-paragraph @tiptap/extension-document @tiptap/extension-text @tiptap/extension-bullet-list @tiptap/extension-list-item @tiptap/extension-bold @tiptap/extension-italic unpdf officeparser
```

Or simply copy the dependencies from `midday-package-update.json` at the project root.

## Usage Examples

### Invoice PDF Template

```tsx
import { InvoicePdfTemplate } from '@/components/midday/invoice';
import { getInvoice } from '@/services/intuit/invoice';
import { getCompanyInfo } from '@/services/intuit/company-info';

// In your component
const invoice = await getInvoice(invoiceId);
const companyInfo = await getCompanyInfo();

return (
  <InvoicePdfTemplate 
    invoice={invoice} 
    companyInfo={companyInfo} 
    onDownload={(blob) => {
      // Handle downloaded PDF blob
    }}
  />
);
```

### Invoice React Template

```tsx
import { InvoiceReactTemplate } from '@/components/midday/invoice';
import { getInvoice } from '@/services/intuit/invoice';
import { getCompanyInfo } from '@/services/intuit/company-info';

// In your component
const invoice = await getInvoice(invoiceId);
const companyInfo = await getCompanyInfo();

return (
  <InvoiceReactTemplate 
    invoice={invoice} 
    companyInfo={companyInfo} 
    editable={true}
    onSave={(updatedInvoice) => {
      // Handle saving updated invoice
    }}
  />
);
```

### Document Processor

```tsx
import { DocumentProcessor } from '@/components/midday/documents';
import { ProcessedDocument } from '@/lib/midday/document-utils';

// In your component
const handleDocumentProcessed = (document: ProcessedDocument) => {
  console.log('Document processed:', document);
  // Do something with the processed document
};

return (
  <DocumentProcessor 
    onDocumentProcessed={handleDocumentProcessed}
    maxSizeMB={20}
  />
);
```

## Implementation Status

- ✅ Project structure created
- ✅ Utility libraries
- ✅ Placeholder components
- ⏳ Install dependencies
- ⏳ Implement full functionality
- ⏳ Testing and validation
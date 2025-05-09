'use client';

/**
 * Invoice PDF Template Wrapper for Midday Components
 * 
 * This component will use @react-pdf/renderer library (from Midday) to
 * generate PDF invoices. It requires installation of the dependencies
 * listed in midday-package-update.json.
 * 
 * NOTE: This is a placeholder implementation until we install the required dependencies.
 * The actual implementation will import and use the @react-pdf/renderer components.
 */

import React, { useCallback } from 'react';
import type { Invoice } from '@/services/intuit/types';
import { transformInvoiceToMiddayFormat } from '@/lib/midday/invoice-utils';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface InvoicePdfTemplateProps {
  invoice: Invoice;
  companyInfo?: any;
  onDownload?: (blob: Blob) => void;
  onError?: (error: Error) => void;
}

export default function InvoicePdfTemplate({
  invoice,
  companyInfo,
  onDownload,
  onError,
}: InvoicePdfTemplateProps) {
  // Transform invoice data to Midday format
  const invoiceData = transformInvoiceToMiddayFormat(invoice, companyInfo);

  const handleGeneratePdf = useCallback(async () => {
    try {
      // This is a placeholder to demonstrate the component's API
      // With actual dependencies installed, this would use react-pdf/renderer
      // to create a PDF from the invoice data
      
      // Once dependencies are installed, this will be replaced with actual PDF generation
      alert('PDF generation placeholder - Dependencies not yet installed.');
      console.log('Invoice data that would be used for PDF:', invoiceData);
      
      // Mock PDF blob for demo purposes
      // In the real implementation, we would create a PDF blob
      const mockPdfBlob = new Blob(['PDF data would go here'], { type: 'application/pdf' });
      
      if (onDownload) {
        onDownload(mockPdfBlob);
      } else {
        // Default download behavior
        const url = URL.createObjectURL(mockPdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceData.invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [invoice, companyInfo, onDownload, onError, invoiceData]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Invoice PDF Preview</h2>
        <p className="text-sm text-gray-500">
          This is a placeholder for the PDF preview. The actual implementation will render a PDF preview.
        </p>
      </div>
      
      {/* Mock preview of invoice data */}
      <div className="border p-4 rounded-md bg-gray-50 mb-4">
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="font-bold">{invoiceData.companyName}</h3>
            <p className="text-sm">{invoiceData.companyAddress?.line1}</p>
            <p className="text-sm">{invoiceData.companyAddress?.city}, {invoiceData.companyAddress?.state} {invoiceData.companyAddress?.postalCode}</p>
          </div>
          <div className="text-right">
            <h3 className="font-bold">Invoice #{invoiceData.invoiceNumber}</h3>
            <p className="text-sm">Date: {invoiceData.date}</p>
            <p className="text-sm">Due: {invoiceData.dueDate}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Bill To:</h4>
          <p>{invoiceData.customerName}</p>
          <p className="text-sm">{invoiceData.customerAddress?.line1}</p>
          <p className="text-sm">{invoiceData.customerAddress?.city}, {invoiceData.customerAddress?.state} {invoiceData.customerAddress?.postalCode}</p>
        </div>
        
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Unit Price</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.description}</td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">${item.unitPrice.toFixed(2)}</td>
                <td className="text-right py-2">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex justify-end">
          <div className="w-1/3">
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>${invoiceData.subtotal.toFixed(2)}</span>
            </div>
            {invoiceData.tax && invoiceData.tax > 0 && (
              <div className="flex justify-between mb-1">
                <span>Tax:</span>
                <span>${invoiceData.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t pt-1">
              <span>Total:</span>
              <span>${invoiceData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {invoiceData.notes && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold mb-2">Notes:</h4>
            <p className="text-sm">{invoiceData.notes}</p>
          </div>
        )}
      </div>
      
      <Button onClick={handleGeneratePdf} className="bg-blue-600 hover:bg-blue-700">
        <FileText className="mr-2 h-4 w-4" />
        Generate PDF
      </Button>
    </div>
  );
}
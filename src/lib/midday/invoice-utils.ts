/**
 * Utility functions for transforming QuickBooks invoice data to Midday invoice format
 */

import type { Invoice } from '@/services/intuit/types';
import { formatCurrency } from '@/components/estimates/EstimateDetailView';

// Define Midday Invoice structure (based on their expected format)
export interface MiddayInvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  companyName: string;
  companyEmail?: string;
  companyAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  companyLogo?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  subtotal: number;
  tax?: number;
  total: number;
  notes?: string;
  terms?: string;
  metadata?: Record<string, any>;
}

/**
 * Transforms a QuickBooks Invoice to Midday Invoice format
 */
export function transformInvoiceToMiddayFormat(
  invoice: Invoice,
  companyInfo?: any
): MiddayInvoiceData {
  // Extract line items
  const items = invoice.Line?.filter(
    (line) => line.DetailType === 'SalesItemLineDetail'
  ).map((line) => ({
    description: line.Description || '',
    quantity: line.SalesItemLineDetail?.Qty || 1,
    unitPrice: line.SalesItemLineDetail?.UnitPrice || 0,
    amount: line.Amount || 0,
  })) || [];

  // Format dates (assuming invoice.TxnDate and invoice.DueDate are ISO strings)
  const date = invoice.TxnDate 
    ? new Date(invoice.TxnDate).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];
  
  const dueDate = invoice.DueDate 
    ? new Date(invoice.DueDate).toISOString().split('T')[0]
    : '';

  // Transform to Midday format
  return {
    invoiceNumber: invoice.DocNumber || invoice.Id || '',
    date,
    dueDate,
    customerName: invoice.CustomerRef?.name || '',
    customerEmail: '',  // Not directly available in QB invoice
    customerAddress: {
      line1: invoice.BillAddr?.Line1 || '',
      line2: invoice.BillAddr?.Line2 || '',
      city: invoice.BillAddr?.City || '',
      state: invoice.BillAddr?.CountrySubDivisionCode || '',
      postalCode: invoice.BillAddr?.PostalCode || '',
      country: invoice.BillAddr?.Country || '',
    },
    companyName: companyInfo?.CompanyName || '',
    companyEmail: companyInfo?.Email?.Address || '',
    companyAddress: {
      line1: companyInfo?.CompanyAddr?.Line1 || '',
      line2: companyInfo?.CompanyAddr?.Line2 || '',
      city: companyInfo?.CompanyAddr?.City || '',
      state: companyInfo?.CompanyAddr?.CountrySubDivisionCode || '',
      postalCode: companyInfo?.CompanyAddr?.PostalCode || '',
      country: companyInfo?.CompanyAddr?.Country || '',
    },
    companyLogo: '',  // Would need to be provided separately
    items,
    subtotal: invoice.TxnTaxDetail?.TotalTax 
      ? (invoice.TotalAmt - invoice.TxnTaxDetail.TotalTax) 
      : invoice.TotalAmt,
    tax: invoice.TxnTaxDetail?.TotalTax || 0,
    total: invoice.TotalAmt || 0,
    notes: invoice.CustomerMemo?.value || '',
    terms: invoice.SalesTermRef?.name || '',
  };
}

/**
 * Formats the invoice data for display in a PDF
 */
export function formatInvoiceDataForDisplay(invoice: MiddayInvoiceData) {
  return {
    ...invoice,
    items: invoice.items.map(item => ({
      ...item,
      formattedUnitPrice: formatCurrency(item.unitPrice),
      formattedAmount: formatCurrency(item.amount),
    })),
    formattedSubtotal: formatCurrency(invoice.subtotal),
    formattedTax: formatCurrency(invoice.tax || 0),
    formattedTotal: formatCurrency(invoice.total),
  };
}
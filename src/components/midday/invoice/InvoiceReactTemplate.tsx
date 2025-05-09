'use client';

/**
 * Invoice React Template Wrapper for Midday Components
 * 
 * This component will provide an interactive invoice template for viewing and editing.
 * It requires installation of the dependencies listed in midday-package-update.json.
 * 
 * NOTE: This is a placeholder implementation until we install the required dependencies.
 * The actual implementation will import and use the Midday invoice template components.
 */

import React from 'react';
import type { Invoice } from '@/services/intuit/types';
import { transformInvoiceToMiddayFormat, formatInvoiceDataForDisplay } from '@/lib/midday/invoice-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PencilIcon, Save } from 'lucide-react';

interface InvoiceReactTemplateProps {
  invoice: Invoice;
  companyInfo?: any;
  editable?: boolean;
  onSave?: (updatedInvoice: any) => void;
}

export default function InvoiceReactTemplate({
  invoice,
  companyInfo,
  editable = false,
  onSave,
}: InvoiceReactTemplateProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  
  // Transform invoice data to Midday format
  const invoiceData = transformInvoiceToMiddayFormat(invoice, companyInfo);
  const formattedInvoice = formatInvoiceDataForDisplay(invoiceData);
  
  const handleToggleEdit = () => {
    if (!editable) return;
    setIsEditing(!isEditing);
  };
  
  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      // In a real implementation, we would collect the edited data
      // and transform it back to QuickBooks format
      onSave(invoice);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Invoice #{formattedInvoice.invoiceNumber}</CardTitle>
          {editable && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleToggleEdit}
              className={isEditing ? "bg-blue-50" : ""}
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Company Information */}
            <div>
              <h3 className="font-bold text-lg mb-2">{formattedInvoice.companyName}</h3>
              <p>{formattedInvoice.companyAddress?.line1}</p>
              {formattedInvoice.companyAddress?.line2 && <p>{formattedInvoice.companyAddress.line2}</p>}
              <p>
                {formattedInvoice.companyAddress?.city}
                {formattedInvoice.companyAddress?.state ? `, ${formattedInvoice.companyAddress.state}` : ''}
                {formattedInvoice.companyAddress?.postalCode ? ` ${formattedInvoice.companyAddress.postalCode}` : ''}
              </p>
              {formattedInvoice.companyEmail && <p>{formattedInvoice.companyEmail}</p>}
            </div>
            
            {/* Invoice Details */}
            <div className="text-right">
              <h3 className="text-2xl font-bold mb-4">INVOICE</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">Invoice Number:</span>
                  <span>{formattedInvoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{formattedInvoice.date}</span>
                </div>
                {formattedInvoice.dueDate && (
                  <div className="flex justify-between">
                    <span className="font-medium">Due Date:</span>
                    <span>{formattedInvoice.dueDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Customer Information */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Bill To:</h3>
            <p className="font-medium">{formattedInvoice.customerName}</p>
            {formattedInvoice.customerAddress?.line1 && <p>{formattedInvoice.customerAddress.line1}</p>}
            {formattedInvoice.customerAddress?.line2 && <p>{formattedInvoice.customerAddress.line2}</p>}
            {(formattedInvoice.customerAddress?.city || formattedInvoice.customerAddress?.state || formattedInvoice.customerAddress?.postalCode) && (
              <p>
                {formattedInvoice.customerAddress?.city}
                {formattedInvoice.customerAddress?.state ? `, ${formattedInvoice.customerAddress.state}` : ''}
                {formattedInvoice.customerAddress?.postalCode ? ` ${formattedInvoice.customerAddress.postalCode}` : ''}
              </p>
            )}
            {formattedInvoice.customerEmail && <p>{formattedInvoice.customerEmail}</p>}
          </div>
          
          {/* Line Items */}
          <div className="mb-6">
            <div className="bg-gray-50 p-3 grid grid-cols-12 gap-4 font-medium text-gray-700">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            <div className="border-t border-b divide-y">
              {formattedInvoice.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 py-3">
                  <div className="col-span-6">{item.description}</div>
                  <div className="col-span-2 text-right">{item.quantity}</div>
                  <div className="col-span-2 text-right">{formatCurrency(item.unitPrice)}</div>
                  <div className="col-span-2 text-right">{formatCurrency(item.amount)}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-56">
              <div className="flex justify-between py-1">
                <span className="font-medium">Subtotal:</span>
                <span>{formattedInvoice.formattedSubtotal}</span>
              </div>
              {formattedInvoice.tax && formattedInvoice.tax > 0 && (
                <div className="flex justify-between py-1">
                  <span className="font-medium">Tax:</span>
                  <span>{formattedInvoice.formattedTax}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between py-1 font-bold">
                <span>Total:</span>
                <span>{formattedInvoice.formattedTotal}</span>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          {formattedInvoice.notes && (
            <div className="mt-8 pt-4 border-t">
              <h4 className="font-semibold mb-2">Notes:</h4>
              <p className="text-sm text-gray-700">{formattedInvoice.notes}</p>
            </div>
          )}
          
          {/* Terms */}
          {formattedInvoice.terms && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Terms:</h4>
              <p className="text-sm text-gray-700">{formattedInvoice.terms}</p>
            </div>
          )}
          
          {/* Save Button (only shown when editing) */}
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-md">
        <p className="text-amber-800 text-sm">
          <strong>Note:</strong> This is a placeholder component. The actual implementation will use TipTap and other Midday dependencies for rich text editing and interactive invoice displays.
        </p>
      </div>
    </div>
  );
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
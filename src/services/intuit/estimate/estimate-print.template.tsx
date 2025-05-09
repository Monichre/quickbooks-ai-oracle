import React from 'react'
import {Estimate} from '../types'

interface EstimatePrintTemplateProps {
  estimate: Estimate
}

/**
 * Format a number as currency
 */
function formatCurrency(amount: number | undefined): string {
  if (amount === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Format a date string as MM/DD/YYYY
 */
function formatDate(dateString: string | undefined): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(date)
  } catch (e) {
    return dateString
  }
}

/**
 * React component that renders an Estimate as a printable HTML document
 */
export function EstimatePrintTemplate({
  estimate,
}: EstimatePrintTemplateProps): React.ReactElement {
  const {
    DocNumber,
    TxnDate,
    CustomerRef,
    CustomerMemo,
    Line = [],
    TotalAmt,
  } = estimate

  // Get unique CSS ID to avoid conflicts if multiple templates are rendered
  const id = `estimate-${DocNumber?.replace(/\s+/g, '-') || 'template'}`

  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Estimate {DocNumber}</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          #${id} {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #1a1a1a;
            line-height: 1.5;
          }
          
          #${id} * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          #${id} .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #e5e7eb;
          }
          
          #${id} .logo {
            max-height: 3rem;
            width: auto;
          }
          
          #${id} .estimate-info {
            text-align: right;
          }
          
          #${id} .estimate-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          
          #${id} .customer-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2rem;
          }
          
          #${id} .section-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #4b5563;
          }
          
          #${id} .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2rem;
          }
          
          #${id} .items-table th {
            background-color: #f3f4f6;
            text-align: left;
            padding: 0.75rem;
            font-weight: 600;
            border-bottom: 1px solid #e5e7eb;
          }
          
          #${id} .items-table td {
            padding: 0.75rem;
            border-bottom: 1px solid #e5e7eb;
          }
          
          #${id} .items-table .amount {
            text-align: right;
          }
          
          #${id} .totals-section {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-bottom: 2rem;
          }
          
          #${id} .totals-row {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 0.5rem;
          }
          
          #${id} .totals-label {
            width: 10rem;
            text-align: right;
            margin-right: 1rem;
            font-weight: 500;
          }
          
          #${id} .totals-value {
            width: 8rem;
            text-align: right;
          }
          
          #${id} .grand-total {
            font-weight: 700;
            font-size: 1.125rem;
          }
          
          #${id} .footer {
            margin-top: 3rem;
            padding-top: 1rem;
            border-top: 1px solid #e5e7eb;
            font-size: 0.875rem;
            color: #6b7280;
          }
          
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        `,
          }}
        />
      </head>
      <body>
        <div id={id}>
          <div className='header'>
            <div className='logo-section'>
              <img src='/logo-dark.png' alt='Company Logo' className='logo' />
            </div>
            <div className='estimate-info'>
              <div className='estimate-title'>Estimate</div>
              <div>#{DocNumber}</div>
              <div>Date: {formatDate(TxnDate)}</div>
            </div>
          </div>

          <div className='customer-section'>
            <div className='bill-to'>
              <div className='section-title'>Bill To:</div>
              <div>{CustomerRef?.name || 'Customer'}</div>
              {CustomerMemo && <div>{CustomerMemo}</div>}
            </div>

            <div className='company-info'>
              <div className='section-title'>From:</div>
              <div>Your Company Name</div>
              <div>123 Business Ave</div>
              <div>City, State ZIP</div>
              <div>contact@yourcompany.com</div>
            </div>
          </div>

          <table className='items-table'>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th className='amount'>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Line.map((line, index) => {
                if (line.DetailType !== 'SalesItemLineDetail') return null
                const detail = line.SalesItemLineDetail

                return (
                  <tr key={index}>
                    <td>
                      {line.Description || detail?.ItemRef?.name || 'Item'}
                    </td>
                    <td>{detail?.Qty || 1}</td>
                    <td>{formatCurrency(detail?.UnitPrice)}</td>
                    <td className='amount'>{formatCurrency(line.Amount)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className='totals-section'>
            <div className='totals-row'>
              <div className='totals-label'>Subtotal:</div>
              <div className='totals-value'>{formatCurrency(TotalAmt)}</div>
            </div>

            <div className='totals-row grand-total'>
              <div className='totals-label'>Total:</div>
              <div className='totals-value'>{formatCurrency(TotalAmt)}</div>
            </div>
          </div>

          <div className='footer'>
            <p>Thank you for your business!</p>
            <p>This estimate is valid for 30 days from the date issued.</p>
          </div>
        </div>
      </body>
    </html>
  )
}

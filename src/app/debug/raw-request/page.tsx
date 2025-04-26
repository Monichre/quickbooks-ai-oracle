'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { makeRawRequest } from './actions';

export default function RawRequestPage() {
  const [payload, setPayload] = useState<string>(JSON.stringify({
    CustomerRef: { value: "1" },
    Line: [{
      DetailType: "SalesItemLineDetail",
      Amount: 25,
      SalesItemLineDetail: {
        ItemRef: { value: "manual-entry", name: "Manual Entry" },
        UnitPrice: 25,
        Qty: 1
      },
      Description: "test 1"
    }],
    DocNumber: "1",
    TxnDate: new Date().toISOString().split('T')[0],
    BillAddr: {
      Line1: "4581 Finch St.",
      City: "Bayshore",
      CountrySubDivisionCode: "CA",
      PostalCode: "94326",
      Country: "United States"
    },
    ShipAddr: {
      Line1: "4581 Finch St.",
      City: "Bayshore",
      CountrySubDivisionCode: "CA",
      PostalCode: "94326",
      Country: "United States"
    },
    BillEmail: { Address: "Birds@Intuit.com" },
    CurrencyRef: { value: "USD" },
    DueDate: "2025-05-02",
    ExpirationDate: "2025-06-06", 
    TxnStatus: "Pending",
    PrintStatus: "NeedToPrint",
    EmailStatus: "NotSet"
  }, null, 2));
  
  const [endpoint, setEndpoint] = useState<string>("estimate");
  const [method, setMethod] = useState<string>("POST");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Parse the JSON payload
      const parsedPayload = JSON.parse(payload);
      
      // Make the request
      const response = await makeRawRequest(endpoint, method, parsedPayload);
      setResult(response);
    } catch (err) {
      console.error('Error with request:', err);
      setError(err.message || 'An error occurred');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Raw QuickBooks API Request</h1>
      
      <div className="mb-4">
        <Link href="/debug">
          <Button variant="outline">Back to Debug Dashboard</Button>
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Endpoint</label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., estimate"
            />
            <p className="text-xs text-gray-500 mt-1">
              Will be appended to API base URL, e.g., .../v3/company/{process.env.INTUIT_COMPANY_ID}/estimate
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Request Payload (JSON)</label>
          <Textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="font-mono text-sm h-80"
            placeholder='{"key": "value"}'
          />
        </div>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending Request...' : 'Send Request'}
        </Button>
      </form>
      
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {result && (
        <Card className="p-4 mt-6">
          <h2 className="text-xl font-semibold mb-2">Response</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-[500px]">
            {JSON.stringify(result, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { getDebugInfo } from './actions';
import { createTestEstimate } from './estimate-actions';

export default function DebugPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [testingEstimate, setTestingEstimate] = useState(false);
  const [estimateResult, setEstimateResult] = useState(null);

  async function fetchDebugInfo() {
    setLoading(true);
    try {
      const result = await getDebugInfo();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching debug info:', err);
      setError(err.message || 'Error fetching debug information');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function testCreateEstimate() {
    setTestingEstimate(true);
    try {
      // Create a minimal estimate payload for testing
      const testEstimate = {
        CustomerRef: { value: "1" },
        Line: [{
          DetailType: "SalesItemLineDetail",
          Amount: 25,
          SalesItemLineDetail: {
            ItemRef: { value: "manual-entry", name: "Manual Entry" },
            UnitPrice: 25,
            Qty: 1
          },
          Description: "Test Item Description"
        }],
        DocNumber: "TEST-1",
        TxnDate: new Date().toISOString().split('T')[0], // Today's date
        BillAddr: {
          Line1: "123 Main St",
          City: "Anytown",
          CountrySubDivisionCode: "CA",
          PostalCode: "12345",
          Country: "United States"
        },
        ShipAddr: {
          Line1: "123 Main St",
          City: "Anytown",
          CountrySubDivisionCode: "CA",
          PostalCode: "12345",
          Country: "United States"
        },
        BillEmail: { Address: "test@example.com" },
        CurrencyRef: { value: "USD" },
        PrintStatus: "NeedToPrint",
        EmailStatus: "NotSet"
      };
      
      // Use server action to test estimate creation
      const result = await createTestEstimate(testEstimate);
      setEstimateResult(result);
    } catch (err) {
      console.error('Error testing estimate creation:', err);
      setEstimateResult({
        success: false,
        error: err.message || 'Error testing estimate creation'
      });
    } finally {
      setTestingEstimate(false);
    }
  }

  useEffect(() => {
    fetchDebugInfo();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">QuickBooks Integration Debug</h1>
      
      <div className="flex gap-4 mb-6">
        <Button onClick={fetchDebugInfo} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Debug Info'}
        </Button>
        <Button onClick={testCreateEstimate} disabled={testingEstimate || !data?.authInfo?.authenticated}>
          {testingEstimate ? 'Testing...' : 'Test Create Estimate'}
        </Button>
        <Link href="/debug/raw-request">
          <Button variant="outline">Raw API Request Tool</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-2">Network Connectivity</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(data.networkCheck, null, 2)}
            </pre>
          </Card>
          
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
            <div className="mb-2">
              <span className="font-medium">Authenticated: </span>
              <span className={data.authInfo.authenticated ? "text-green-600" : "text-red-600"}>
                {data.authInfo.authenticated ? "Yes" : "No"}
              </span>
            </div>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(data.authInfo, null, 2)}
            </pre>
          </Card>
          
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(data.environmentInfo, null, 2)}
            </pre>
          </Card>
          
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-2">API Test Results</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(data.apiTest, null, 2)}
            </pre>
          </Card>
          
          {estimateResult && (
            <Card className="p-4 md:col-span-2">
              <h2 className="text-xl font-semibold mb-2">Estimate Test Results</h2>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(estimateResult, null, 2)}
              </pre>
            </Card>
          )}
        </div>
      )}
      
      {!data && !error && (
        <div className="text-center p-10">
          <div className="text-xl">Loading debug information...</div>
        </div>
      )}
    </div>
  );
}
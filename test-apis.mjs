// Test script for QuickBooks API endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001/api/quickbooks';

async function testEndpoint(path, params = {}) {
  // Build query string from params
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  const url = `${BASE_URL}/${path}${queryString ? `?${queryString}` : ''}`;
  console.log(`Testing: ${url}`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
    console.log('-'.repeat(80));
    
    return { success: response.status >= 200 && response.status < 300, data };
  } catch (error) {
    console.error(`Error testing ${path}:`, error.message);
    console.log('-'.repeat(80));
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('=== Testing QuickBooks API Endpoints ===');
  
  // Test company info endpoint
  await testEndpoint('company-info');
  
  // Test vendor endpoints
  await testEndpoint('vendor');
  await testEndpoint('vendor', { limit: 5 });
  
  // Test purchase endpoints
  await testEndpoint('purchase');
  await testEndpoint('purchase', { limit: 5 });
  
  // Test purchase order endpoints
  await testEndpoint('purchase-order');
  await testEndpoint('purchase-order', { limit: 5 });
  
  console.log('=== API Tests Complete ===');
}

runTests().catch(console.error);
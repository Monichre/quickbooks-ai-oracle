"use server";

import { createEstimate } from "@/services/intuit/estimate/estimate.api";

export async function createTestEstimate(data: any) {
  console.log("Attempting to create test estimate with data:", JSON.stringify(data, null, 2));
  
  try {
    // Log the detail of the request
    console.log("Full estimate request data:", {
      customerRef: data.CustomerRef,
      lineCount: data.Line?.length,
      firstLine: data.Line?.[0],
      docNumber: data.DocNumber,
      txnDate: data.TxnDate,
      billAddr: data.BillAddr,
      shipAddr: data.ShipAddr,
      billEmail: data.BillEmail,
      currencyRef: data.CurrencyRef
    });
    
    // Attempt to create the estimate
    const result = await createEstimate(data);
    console.log("Test estimate creation successful:", result);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error creating test estimate:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      status: error.status,
      cause: error.cause,
      stack: error.stack
    });
    
    return {
      success: false,
      error: error.message,
      cause: error.cause,
      stack: error.stack
    };
  }
}
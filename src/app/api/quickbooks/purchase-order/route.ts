import { type NextRequest, NextResponse } from "next/server";
import { findPurchaseOrders, getPurchaseOrder } from "@/services/intuit/api";

/**
 * GET handler for purchase order data from QuickBooks
 */
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const purchaseOrderId = searchParams.get("id");

		// If purchase order ID is provided, return specific purchase order
		if (purchaseOrderId) {
			const purchaseOrderData = await getPurchaseOrder(purchaseOrderId);
			return NextResponse.json(purchaseOrderData);
		}

		// Otherwise query purchase orders with optional filters
		const queryParams: Record<string, string | number> = {};

		// Add pagination params if provided
		const limit = searchParams.get("limit");
		if (limit) queryParams.limit = Number.parseInt(limit, 10);

		const offset = searchParams.get("offset");
		if (offset) queryParams.offset = Number.parseInt(offset, 10);

		// Add any other filter params
		const vendorRefValue = searchParams.get("vendorRefValue");
		if (vendorRefValue) queryParams.VendorRef = vendorRefValue;

		const status = searchParams.get("status");
		if (status) queryParams.POStatus = status;

		const txnDate = searchParams.get("txnDate");
		if (txnDate) queryParams.TxnDate = txnDate;

		const docNumber = searchParams.get("docNumber");
		if (docNumber) queryParams.DocNumber = docNumber;

		const purchaseOrders = await findPurchaseOrders(queryParams);
		return NextResponse.json(purchaseOrders);
	} catch (error) {
		console.error("Error fetching purchase order data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch purchase order data" },
			{ status: 500 },
		);
	}
}

import { type NextRequest, NextResponse } from "next/server";
import { findPurchases, getPurchase } from "@/lib/intuit/api";

/**
 * GET handler for purchase data from QuickBooks
 */
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const purchaseId = searchParams.get("id");

		// If purchase ID is provided, return specific purchase
		if (purchaseId) {
			const purchaseData = await getPurchase(purchaseId);
			return NextResponse.json(purchaseData);
		}

		// Otherwise query purchases with optional filters
		const queryParams: Record<string, string | number> = {};

		// Add pagination params if provided
		const limit = searchParams.get("limit");
		// biome-ignore lint/style/useNumberNamespace: <explanation>
		if (limit) queryParams.limit = parseInt(limit, 10);

		const offset = searchParams.get("offset");
		// biome-ignore lint/style/useNumberNamespace: <explanation>
		if (offset) queryParams.offset = parseInt(offset, 10);

		// Add any other filter params
		const accountRefValue = searchParams.get("accountRefValue");
		if (accountRefValue) queryParams.AccountRef = accountRefValue;

		const entityRefValue = searchParams.get("entityRefValue");
		if (entityRefValue) queryParams.EntityRef = entityRefValue;

		const txnDate = searchParams.get("txnDate");
		if (txnDate) queryParams.TxnDate = txnDate;

		const docNumber = searchParams.get("docNumber");
		if (docNumber) queryParams.DocNumber = docNumber;

		const purchases = await findPurchases(queryParams);
		return NextResponse.json(purchases);
	} catch (error) {
		console.error("Error fetching purchase data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch purchase data" },
			{ status: 500 },
		);
	}
}

import { type NextRequest, NextResponse } from "next/server";
import { findAccounts, getAccount } from "@/services/intuit/api";

/**
 * GET handler for account data from QuickBooks
 */
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const accountId = searchParams.get("id");

		// If account ID is provided, return specific account
		if (accountId) {
			const accountData = await getAccount(accountId);
			return NextResponse.json(accountData);
		}

		// Otherwise query accounts with optional filters
		const queryParams: Record<string, string | number | boolean> = {};

		// Add pagination params if provided
		const limit = searchParams.get("limit");
		if (limit) queryParams.limit = Number.parseInt(limit, 10);

		const offset = searchParams.get("offset");
		if (offset) queryParams.offset = Number.parseInt(offset, 10);

		// Add any other filter params
		const name = searchParams.get("name");
		if (name) queryParams.Name = name;

		const accountType = searchParams.get("accountType");
		if (accountType) queryParams.AccountType = accountType;

		const classification = searchParams.get("classification");
		if (classification) queryParams.Classification = classification;

		const active = searchParams.get("active");
		if (active) queryParams.Active = active === "true";

		const accounts = await findAccounts(queryParams);
		return NextResponse.json(accounts);
	} catch (error) {
		console.error("Error fetching account data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch account data" },
			{ status: 500 },
		);
	}
}

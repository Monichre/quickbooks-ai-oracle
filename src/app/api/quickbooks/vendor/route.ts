// @ts-nocheck

import { type NextRequest, NextResponse } from "next/server";
import { findVendors, getVendor } from "@/lib/intuit/api";

/**
 * GET handler for vendor data from QuickBooks
 */
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const vendorId = searchParams.get("id");

		// If vendor ID is provided, return specific vendor
		if (vendorId) {
			const vendorData = await getVendor(vendorId);
			return NextResponse.json(vendorData);
		}

		// Otherwise query vendors with optional filters
		const queryParams: Record<string, string | number> = {};

		// Add pagination params if provided
		const limit = searchParams.get("limit");
		// biome-ignore lint/style/useNumberNamespace: <explanation>
		if (limit) queryParams.limit = parseInt(limit, 10);

		const offset = searchParams.get("offset");
		if (offset) queryParams.offset = Number.parseInt(offset, 10);

		// Add any other filter params
		const displayName = searchParams.get("displayName");
		if (displayName) queryParams.DisplayName = displayName;

		const companyName = searchParams.get("companyName");
		if (companyName) queryParams.CompanyName = companyName;

		const active = searchParams.get("active");
		if (active) queryParams.Active = active === "true";

		const vendors = await findVendors(queryParams);
		return NextResponse.json(vendors);
	} catch (error) {
		console.error("Error fetching vendor data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch vendor data" },
			{ status: 500 },
		);
	}
}

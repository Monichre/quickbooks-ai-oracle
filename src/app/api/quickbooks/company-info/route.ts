import { getCompanyInfo } from "@/lib/intuit/api";
import { refreshTokensIfNeeded } from "@/lib/intuit/auth";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		// Ensure tokens are refreshed if needed
		await refreshTokensIfNeeded();

		// Fetch company data from QuickBooks
		const response = await getCompanyInfo();
		
		// Extract company info from the query response
		const companyData = response.QueryResponse.CompanyInfo[0];

		return NextResponse.json({ companyData });
	} catch (error) {
		console.error("Error fetching company info:", error);
		return NextResponse.json(
			{ error: "Failed to fetch company information", details: error },
			{ status: 500 },
		);
	}
}

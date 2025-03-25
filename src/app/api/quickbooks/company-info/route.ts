import { getCompanyInfo } from "@/lib/intuit/api";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const companyData = await getCompanyInfo();
		return NextResponse.json(companyData);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch company information" },
			{ status: 500 },
		);
	}
}

import { type NextRequest, NextResponse } from "next/server";
import { getAuthorizationUrl } from "@/lib/intuit/auth";

export async function GET(request: NextRequest) {
	try {
		// Get the authorization URL
		const authUrl = getAuthorizationUrl();

		// Redirect to QuickBooks authorization page
		return NextResponse.redirect(authUrl);
	} catch (error) {
		console.error("Error initiating QuickBooks authentication:", error);

		// Redirect to error page or show error message
		return NextResponse.redirect(
			new URL(
				"/auth/error?message=Failed+to+start+authentication",
				request.url,
			),
		);
	}
}

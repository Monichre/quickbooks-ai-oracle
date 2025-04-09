import { NextResponse } from "next/server";
import { getAuthorizationUrl } from "@/services/intuit/auth";

/**
 * Main Direct Auth Route
 *
 * This route can be accessed directly at /api/intuit/auth
 * It serves as the main entry point for the QuickBooks authorization flow.
 *
 * For programmatic/client-side usage, the /api/intuit/auth/connect route
 * can be used, which returns either a redirect or a JSON response.
 */
export async function GET() {
	try {
		// Get the authorization URL
		const authUrl = await getAuthorizationUrl();

		// Redirect to QuickBooks authorization page
		return NextResponse.redirect(authUrl);
	} catch (error) {
		console.error("Error initiating QuickBooks authentication:", error);

		// Redirect to error page with message
		return NextResponse.redirect(
			new URL(
				"/auth/error?message=Failed+to+start+authentication",
				process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
			),
		);
	}
}

// import { type NextRequest, NextResponse } from "next/server";
// import { getAuthorizationUrl } from "@/lib/intuit/auth";

// export async function GET(request: NextRequest) {
// 	try {
// 		// Get the authorization URL
// 		const authUrl = getAuthorizationUrl();

// 		// Redirect to QuickBooks authorization page
// 		return NextResponse.redirect(authUrl);
// 	} catch (error) {
// 		console.error("Error initiating QuickBooks authentication:", error);

// 		// Redirect to error page or show error message
// 		return NextResponse.redirect(
// 			new URL(
// 				"/auth/error?message=Failed+to+start+authentication",
// 				request.url,
// 			),
// 		);
// 	}
// }

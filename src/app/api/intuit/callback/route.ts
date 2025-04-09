import { type NextRequest, NextResponse } from "next/server";
import { oauthClient } from "@/services/intuit/client";
import { storeTokens } from "@/services/intuit/auth";

export async function GET(request: NextRequest) {
	try {
		// Get the URL with query parameters from the request
		const url = request.url;
		console.log("Callback URL:", url);

		// Parse the authorization response from Intuit
		const authResponse = await oauthClient.createToken(url);
		const tokens = authResponse.getJson();

		// Get realmId (company ID) from the URL
		const searchParams = new URL(url).searchParams;
		const realmId = searchParams.get("realmId");

		// Store realmId in session or other secure storage
		if (realmId) {
			console.log("Company ID:", realmId);
			// Note: Don't modify process.env at runtime - it won't persist
			// Instead, store this in the user's session or metadata
		}

		// Store tokens in user metadata along with realmId
		await storeTokens(tokens, realmId || undefined);
		console.log("Tokens and company ID stored successfully");

		// Redirect to the dashboard
		return NextResponse.redirect(new URL("/dashboard", request.url));
	} catch (error) {
		console.error("Error handling QuickBooks callback:", error);

		// Redirect to error page with message
		return NextResponse.redirect(
			new URL("/auth/error?message=Authentication+failed", request.url),
		);
	}
}

import { type NextRequest, NextResponse } from "next/server";
import { oauthClient } from "@/lib/intuit/client";
import { storeTokens } from "@/lib/intuit/auth";

export async function GET(request: NextRequest) {
	try {
		// Get the URL with query parameters from the request
		const url = new URL(request.url);
		const fullUrl = url.origin + url.pathname + url.search;

		// Parse the authorization response from Intuit
		const response = await oauthClient.createToken(fullUrl);
		const tokens = response.getJson();

		// Store tokens in user metadata
		await storeTokens(tokens);

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

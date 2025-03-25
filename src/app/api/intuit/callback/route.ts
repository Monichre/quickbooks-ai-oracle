import { type NextRequest, NextResponse } from "next/server";
import { storeTokens } from "@/lib";
import { oauthClient } from "@/lib/intuit/client";

export async function GET(request: NextRequest) {
	try {
		// Get the full URL from the request
		const url = request.nextUrl.toString();

		// Exchange the authorization code for tokens
		const authResponse = await oauthClient.createToken(url);
		const tokens = authResponse.getJson();

		// Store tokens securely
		storeTokens(tokens);

		// Redirect to dashboard or another page
		return NextResponse.redirect(new URL("/dashboard", request.url));
	} catch (error) {
		console.error("Error during QuickBooks callback:", error);

		// Redirect to error page or show error message
		return NextResponse.redirect(
			new URL("/auth/error?message=Authentication+failed", request.url),
		);
	}
}

import { type NextRequest, NextResponse } from "next/server";
import { oauthClient } from "@/lib/intuit/client";
import { storeTokens } from "@/lib/intuit/auth";

export async function GET(request: NextRequest) {
	try {
		console.log("🚀 ~ GET ~ request:", request);
		// Get the URL with query parameters from the request
		const url = new URL(request.url);
		// const parseRedirect = request.url;

		console.log("🚀 ~ GET ~ url:", url);

		const fullUrl = url.origin + url.pathname + url.search;

		console.log("🚀 ~ GET ~ fullUrl:", fullUrl);

		// Parse the authorization response from Intuit
		const tokens = await oauthClient
			.createToken(fullUrl)
			// @ts-ignore
			.then((authResponse) => JSON.stringify(authResponse.getToken()));

		// const tokens = response.getJson();

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

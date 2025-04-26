import { type NextRequest, NextResponse } from "next/server";
import { isAuthenticated, refreshTokensIfNeeded } from "@/services/intuit/auth";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const redirectUrl = searchParams.get("redirect") || "/dashboard";

	// Check if the user is authenticated with Clerk
	const { userId } = await auth();
	if (!userId) {
		// Not authenticated with Clerk, redirect to sign-in
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	try {
		// Check if tokens exist and refresh if needed
		const tokens = await refreshTokensIfNeeded(true); // Force refresh tokens

		if (!tokens) {
			// No tokens or refresh failed - redirect to connect page
			return NextResponse.redirect(
				new URL("/api/intuit/auth/connect", request.url),
			);
		}

		// Successfully authenticated, redirect to original destination
		return NextResponse.redirect(new URL(redirectUrl, request.url));
	} catch (error) {
		console.error("Error checking Intuit authentication:", error);
		// Authentication error - redirect to connect page
		return NextResponse.redirect(
			new URL("/api/intuit/auth/connect", request.url),
		);
	}
}

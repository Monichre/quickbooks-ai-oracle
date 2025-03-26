import { NextResponse } from "next/server";
import { isAuthenticated, getTokens } from "@/lib/intuit/auth";

export async function GET() {
	try {
		// Check authentication status
		const authenticated = await isAuthenticated();

		// Get tokens if authenticated
		const tokens = authenticated ? await getTokens() : null;

		// Environment variables (sanitized)
		const environmentInfo = {
			QB_ENVIRONMENT: process.env.QB_ENVIRONMENT || "not set",
			HAS_COMPANY_ID:
				!!process.env.QB_COMPANY_ID || !!process.env.INTUIT_SANDBOX_COMPANY_ID,
			COMPANY_ID_SOURCE: process.env.QB_COMPANY_ID
				? "QB_COMPANY_ID"
				: process.env.INTUIT_SANDBOX_COMPANY_ID
					? "INTUIT_SANDBOX_COMPANY_ID"
					: "none",
			BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "not set",
			NODE_ENV: process.env.NODE_ENV,
		};

		// Authentication info
		const authInfo = {
			authenticated,
			hasTokens: !!tokens,
			tokenExpiry: tokens?.createdAt
				? new Date(tokens.createdAt + tokens.expires_in * 1000).toISOString()
				: null,
			refreshTokenExpiry: tokens?.createdAt
				? new Date(
						tokens.createdAt + tokens.x_refresh_token_expires_in * 1000,
					).toISOString()
				: null,
			tokenCreatedAt: tokens?.createdAt
				? new Date(tokens.createdAt).toISOString()
				: null,
		};

		return NextResponse.json({
			environmentInfo,
			authInfo,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Debug endpoint error:", error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : "Unknown error",
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}

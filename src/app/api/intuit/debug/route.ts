import { NextResponse } from "next/server";
import { isAuthenticated, getTokens, refreshTokensIfNeeded } from "@/services/intuit/auth";
import { quickbooksRequest } from "@/services/intuit/_common/quickbooks-request";

// Check network connectivity
async function checkConnectivity() {
  try {
    const domains = [
      "oauth.platform.intuit.com",
      "sandbox-quickbooks.api.intuit.com"
    ];
    
    const results = {};
    
    for (const domain of domains) {
      try {
        const response = await fetch(`https://${domain}`, { 
          method: 'HEAD',
          cache: 'no-store'
        });
        results[domain] = {
          reachable: true,
          status: response.status
        };
      } catch (error) {
        results[domain] = {
          reachable: false,
          error: error.message
        };
      }
    }
    
    return results;
  } catch (error) {
    return { error: error.message };
  }
}

export async function GET(request: Request) {
	try {
		const networkCheck = await checkConnectivity();
		console.log("Debug route: Network check results:", networkCheck);
		
		// Refresh tokens - most important step to trigger detailed logging
		console.log("Debug route: Attempting to refresh tokens if needed...");
		const refreshedTokens = await refreshTokensIfNeeded();
		
		// Check authentication status
		console.log("Debug route: Checking authentication status...");
		const authenticated = await isAuthenticated();

		// Get tokens
		const tokens = await getTokens();

		// Environment variables (sanitized)
		const environmentInfo = {
			QB_ENVIRONMENT: process.env.QB_ENVIRONMENT || "not set",
			INTUIT_ENVIRONMENT_ID: process.env.INTUIT_ENVIRONMENT_ID || "not set",
			QB_COMPANY_ID: process.env.QB_COMPANY_ID ? "Present" : "Missing",
			INTUIT_COMPANY_ID: process.env.INTUIT_COMPANY_ID ? "Present" : "Missing",
			INTUIT_CLIENT_ID: process.env.INTUIT_CLIENT_ID ? "Present" : "Missing",
			INTUIT_CLIENT_SECRET: process.env.INTUIT_CLIENT_SECRET ? "Present" : "Missing",
			INTUIT_REDIRECT_URI: process.env.INTUIT_REDIRECT_URI ? "Present" : "Missing",
			NEXT_PUBLIC_INTUIT_API_BASE_URL: process.env.NEXT_PUBLIC_INTUIT_API_BASE_URL || "not set",
			INTUIT_API_BASE_URL: process.env.INTUIT_API_BASE_URL || "not set",
			INTUIT_BASE_URL: process.env.INTUIT_BASE_URL || "not set",
			NEXT_PUBLIC_INTUIT_BASE_URL: process.env.NEXT_PUBLIC_INTUIT_BASE_URL || "not set",
			NODE_ENV: process.env.NODE_ENV || "not set",
		};

		// Authentication info
		const authInfo = {
			authenticated,
			tokensRefreshed: !!refreshedTokens,
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

		// Try a simple API call if authenticated
		let apiTestResult = { attempted: false };
		if (authenticated) {
			try {
				console.log("Debug route: Testing a simple API call...");
				// Use the simplest API endpoint - company info
				apiTestResult = {
					attempted: true,
					success: true,
					result: await quickbooksRequest("companyinfo/" + process.env.INTUIT_COMPANY_ID)
				};
			} catch (error) {
				console.error("Debug route: API test error:", error);
				apiTestResult = {
					attempted: true,
					success: false,
					error: error.message,
					stack: error.stack,
					cause: error.cause
				};
			}
		}

		return NextResponse.json({
			networkCheck,
			environmentInfo,
			authInfo,
			apiTest: apiTestResult,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Debug endpoint error:", error);
		return NextResponse.json(
			{
				error: error.message || "Unknown error",
				stack: error.stack,
				cause: error.cause,
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}

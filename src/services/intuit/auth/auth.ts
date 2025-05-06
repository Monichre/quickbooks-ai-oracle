import { TokenStatus } from "@/services/intuit/auth/types";
import { refreshTokensIfNeeded } from "@/services/intuit/auth/tokens";
import { oauthClient } from "@/services/intuit/client";

import { redirect } from "next/navigation";

// Generate a random state value for OAuth security
function generateRandomState() {
	return Math.random().toString(36).substring(2, 15);
}

// Get the authorization URL
export async function getAuthorizationUrl(redirectReason?: string) {
	const authUrl = await oauthClient.authorizeUri({
		scope: [
			"com.intuit.quickbooks.accounting",
			"openid",
			"profile",
			"email",
			"phone",
			"address",
		],
		state: redirectReason || "oauth-flow",
	});

	return authUrl;
}

// Redirect to authentication flow when tokens are invalid
export async function redirectToAuth(showNotification = true) {
	const redirectReason = showNotification ? "tokenExpired" : "oauth-flow";
	const authUrl = await getAuthorizationUrl(redirectReason);
	redirect(authUrl);
}

// Store tokens in Clerk user metadata with rotation support

// Check if the user is authenticated with Intuit (i.e. tokens exist and are current)
export async function isAuthenticated(): Promise<boolean> {
	const result = await refreshTokensIfNeeded();
	return (
		(result.status === TokenStatus.VALID ||
			result.status === TokenStatus.ROTATED) &&
		!!result.tokens
	);
}

// @ts-nocheck

"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { oauthClient } from "@/services/intuit/client";
import OAuthClient from "intuit-oauth";

// Extend the OAuthClient interface to include the missing method
declare module "intuit-oauth" {
	interface OAuthClient {
		refreshUsingToken(
			refreshToken: string,
		): Promise<{ getJson(): IntuitTokens }>;
	}
}

interface OAuthClientWithRefresh extends OAuthClient {
	refreshUsingToken(refreshToken: string): Promise<{ getJson(): IntuitTokens }>;
}

export type IntuitTokens = {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	x_refresh_token_expires_in: number;
	token_type: string;
	createdAt?: number;
};

// Get the authorization URL
export async function getAuthorizationUrl() {
	return await oauthClient.authorizeUri({
		scope: [
			OAuthClient.scopes.Accounting,
			OAuthClient.scopes.OpenId,
			OAuthClient.scopes.Profile,
			OAuthClient.scopes.Email,
			OAuthClient.scopes.Phone,
			OAuthClient.scopes.Address,
		],
		state: "test",
	});
}

// Generate a random state value for OAuth security
function generateRandomState() {
	return Math.random().toString(36).substring(2, 15);
}

// Store tokens in Clerk user public metadata
export async function storeTokens(tokens: IntuitTokens, realmId?: string) {
	const tokensWithTimestamp = {
		...tokens,
		createdAt: Date.now(),
	};

	const { userId } = await auth();
	if (!userId) throw new Error("No authenticated user");

	// Use clerkClient pattern from docs
	const client = await clerkClient();

	// Get current metadata to preserve existing values
	const user = await client.users.getUser(userId);
	const currentMetadata = user.publicMetadata || {};

	await client.users.updateUser(userId, {
		publicMetadata: {
			...currentMetadata,
			qbTokens: tokensWithTimestamp,
			...(realmId ? { qbRealmId: realmId } : {}),
		},
	});
}

// Retrieve tokens from Clerk user metadata
export async function getTokens(): Promise<IntuitTokens | null> {
	const { userId } = await auth();
	if (!userId) return null;

	const client = await clerkClient();
	const user = await client.users.getUser(userId);
	const tokens = user.publicMetadata.qbTokens as IntuitTokens | undefined;

	console.log("🚀 ~ getTokens ~ tokens:", tokens);

	return tokens || null;
}

// Refresh tokens if needed (30 minutes before expiry to avoid 003200 errors)
export async function refreshTokensIfNeeded(
	forceRefresh = false,
): Promise<IntuitTokens | null> {
	function tokensNeedRefresh(tokens: IntuitTokens): boolean {
		if (!tokens.createdAt) return true;
		const expiryTime = tokens.createdAt + tokens.expires_in * 1000;
		// Increase refresh window to 30 minutes to prevent ApplicationAuthenticationFailed
		const refreshWindow = 30 * 60 * 1000; // 30 minutes
		const needsRefresh = Date.now() > expiryTime - refreshWindow;

		// Log token status for debugging
		console.log(`Token expires at ${new Date(expiryTime).toISOString()}`);
		console.log(`Current time is ${new Date().toISOString()}`);
		console.log(`Tokens need refresh: ${needsRefresh}`);

		return needsRefresh;
	}

	const tokens = await getTokens();

	console.log("🚀 ~ refreshTokensIfNeeded ~ tokens:", tokens);

	if (!tokens) return null;

	if (forceRefresh || tokensNeedRefresh(tokens)) {
		try {
			console.log("Refreshing tokens, force:", forceRefresh);

			// Set the token in the client first
			oauthClient.setToken({
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
				token_type: tokens.token_type,
				expires_in: tokens.expires_in,
				x_refresh_token_expires_in: tokens.x_refresh_token_expires_in,
				createdAt: tokens.createdAt,
			});

			// Try using the standard refresh method first
			let newTokens: IntuitTokens;
			try {
				const refreshResponse = await oauthClient.refresh();
				newTokens = refreshResponse.getJson();
				console.log("Successfully refreshed tokens using standard method");
			} catch (refreshError) {
				// If standard refresh fails, try the refreshUsingToken method
				console.log(
					"Standard refresh failed, trying refreshUsingToken",
					refreshError,
				);
				// Use the extended interface
				const extendedClient = oauthClient as OAuthClientWithRefresh;
				const refreshResponse = await extendedClient.refreshUsingToken(
					tokens.refresh_token,
				);
				newTokens = refreshResponse.getJson();
				console.log(
					"Successfully refreshed tokens using refreshUsingToken method",
				);
			}

			// Store tokens and return them
			await storeTokens(newTokens);
			return newTokens;
		} catch (error) {
			// Enhanced error logging for 003200 ApplicationAuthenticationFailed errors
			console.error("Error refreshing tokens:", error);
			console.error("Error details:", {
				status: error.status,
				statusCode: error.statusCode,
				message: error.message,
				response: error.response?.data || error.response,
				tokenAge: tokens.createdAt
					? Math.floor((Date.now() - tokens.createdAt) / 1000) + " seconds"
					: "unknown",
				intuitErrorCode:
					error.intuit_tid ||
					error.response?.headers?.["intuit_tid"] ||
					"not available",
			});

			// Check for specific 003200 error code in various locations
			const isAuthenticationFailure =
				error.message?.includes("003200") ||
				error.response?.data?.error === "003200" ||
				error.response?.data?.fault?.error?.[0]?.code === "003200";

			// If we get a 400 error, the refresh token may be expired
			// Or if we get a 401 with 003200 code (ApplicationAuthenticationFailed)
			if (
				error.status === 400 ||
				error.status === 401 ||
				error.message?.includes("invalid_grant") ||
				error.message?.includes("expired") ||
				isAuthenticationFailure
			) {
				console.log(
					"Token invalid or expired, clearing tokens to force re-authentication",
				);
				await clearTokens();
			}

			return null;
		}
	}
	return tokens;
}

// Clear tokens from Clerk user metadata without revoking them
async function clearTokens(): Promise<boolean> {
	const { userId } = await auth();
	if (!userId) return false;

	try {
		// Use clerkClient pattern from docs
		const client = await clerkClient();
		await client.users.updateUser(userId, {
			publicMetadata: {
				qbTokens: null,
			},
		});
		return true;
	} catch (error) {
		console.error("Error clearing tokens:", error);
		return false;
	}
}

// Revoke tokens and remove them from Clerk user metadata
export async function revokeTokens(): Promise<boolean> {
	const tokens = await getTokens();
	if (!tokens) return false;

	try {
		await oauthClient.revoke({ token: tokens.access_token });

		// Clear the tokens from metadata
		return await clearTokens();
	} catch (error) {
		console.error("Error revoking tokens:", error);
		return false;
	}
}

// Check if the user is authenticated with Intuit (i.e. tokens exist and are current)
export async function isAuthenticated(): Promise<boolean> {
	const tokens = await refreshTokensIfNeeded();
	return !!tokens;
}

// Get the stored company ID (realmId)
export async function getRealmId(): Promise<string | null> {
	const { userId } = await auth();
	if (!userId) return null;

	const client = await clerkClient();
	const user = await client.users.getUser(userId);
	const realmId = user.publicMetadata.qbRealmId as string | undefined;

	return realmId || null;
}

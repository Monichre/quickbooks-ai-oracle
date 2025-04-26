// @ts-nocheck

"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { oauthClient } from "@/services/intuit/client";
import OAuthClient from "intuit-oauth";

export type IntuitTokens = {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	x_refresh_token_expires_in: number;
	token_type: string;
	createdAt?: number;
};

// Generate a random state value for OAuth security
function generateRandomState() {
	return Math.random().toString(36).substring(2, 15);
}

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

// Store tokens in Clerk user public metadata
export async function storeTokens(tokens: IntuitTokens) {
	const tokensWithTimestamp = {
		...tokens,
		createdAt: Date.now(),
	};

	const { userId } = await auth();
	if (!userId) throw new Error("No authenticated user");

	// Use clerkClient pattern from docs
	const client = await clerkClient();
	await client.users.updateUser(userId, {
		publicMetadata: {
			qbTokens: tokensWithTimestamp,
		},
	});
}

// Retrieve tokens from Clerk user metadata
export async function getTokens(): Promise<IntuitTokens | null> {
	const { userId, ...rest } = await auth();

	if (!userId) return null;

	const client = await clerkClient();
	const user = await client.users.getUser(userId);

	const tokens = user.publicMetadata.qbTokens as IntuitTokens | undefined;

	return tokens || null;
}

// Refresh tokens if needed (15 minutes before expiry)
export async function refreshTokensIfNeeded(): Promise<IntuitTokens | null> {
	function tokensNeedRefresh(tokens: IntuitTokens): boolean {
		if (!tokens.createdAt) return true;
		const expiryTime = tokens.createdAt + tokens.expires_in * 1000;
		const refreshWindow = 15 * 60 * 1000; // 15 minutes
		const needsRefresh = Date.now() > expiryTime - refreshWindow;
		
		console.log("Token refresh check:", {
			currentTime: new Date().toISOString(),
			expiryTime: new Date(expiryTime).toISOString(),
			timeUntilExpiry: (expiryTime - Date.now()) / 1000 / 60 + " minutes",
			needsRefresh
		});
		
		return needsRefresh;
	}

	console.log("Starting token refresh check...");
	const tokens = await getTokens();
	
	if (!tokens) {
		console.log("No tokens found in storage");
		return null;
	}
	
	console.log("Current tokens:", {
		access_token: tokens.access_token ? tokens.access_token.substring(0, 10) + "..." : "undefined",
		refresh_token: tokens.refresh_token ? tokens.refresh_token.substring(0, 10) + "..." : "undefined",
		token_type: tokens.token_type,
		expires_in: tokens.expires_in,
		createdAt: tokens.createdAt ? new Date(tokens.createdAt).toISOString() : "undefined"
	});

	if (tokensNeedRefresh(tokens)) {
		console.log("Tokens need refresh, attempting refresh...");
		try {
			// Set the token in the client first
			oauthClient.setToken({
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
				token_type: tokens.token_type,
				expires_in: tokens.expires_in,
				x_refresh_token_expires_in: tokens.x_refresh_token_expires_in,
				createdAt: tokens.createdAt,
			});
			console.log("Token set in OAuth client");

			// Try using the standard refresh method first
			let newTokens: IntuitTokens;
			try {
				console.log("Attempting standard token refresh...");
				const refreshResponse: {
					getJson(): IntuitTokens;
				} = await oauthClient.refresh();
				newTokens = refreshResponse.getJson();
				console.log("Standard refresh successful");
			} catch (refreshError) {
				// If standard refresh fails, try the refreshUsingToken method
				console.log("Standard refresh failed with error:", refreshError);
				console.log("Trying refreshUsingToken with refresh_token");
				const refreshResponse: {
					getJson(): IntuitTokens;
				} = await oauthClient.refreshUsingToken(tokens.refresh_token);
				newTokens = refreshResponse.getJson();
				console.log("refreshUsingToken successful");
			}
			
			console.log("New tokens received:", {
				access_token: newTokens.access_token ? newTokens.access_token.substring(0, 10) + "..." : "undefined",
				refresh_token: newTokens.refresh_token ? newTokens.refresh_token.substring(0, 10) + "..." : "undefined",
				expires_in: newTokens.expires_in,
			});
			
			oauthClient.setToken(newTokens);
			await storeTokens(newTokens);
			console.log("New tokens stored successfully");
			return newTokens;
		} catch (error) {
			console.error("Error refreshing tokens:", error);
			console.error("Error details:", {
				name: error.name,
				message: error.message,
				status: error.status,
				response: error.response?.data || "No response data",
				stack: error.stack
			});

			// If we get a 400 error, the refresh token may be expired
			// We should clear the tokens and redirect to re-authenticate
			if (error.status === 400) {
				console.log("Refresh token might be expired, clearing tokens");
				await clearTokens();
			}

			return null;
		}
	}
	console.log("Using existing tokens (no refresh needed)");
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

"use server";
import { oauthClient } from "@/services";
import {
	type IntuitTokens,
	type TokenHistory,
	type TokenResult,
	TokenStatus,
} from "@/services/intuit/auth/types";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function storeTokens(tokens: IntuitTokens, isRotation = false) {
	const tokensWithTimestamp = {
		...tokens,
		createdAt: Date.now(),
	};

	const { userId } = await auth();
	if (!userId) throw new Error("No authenticated user");

	// Use clerkClient pattern from docs
	const client = await clerkClient();
	const user = await client.users.getUser(userId);

	// Get existing token history if any
	const existingTokens = user.publicMetadata.qbTokenHistory as
		| TokenHistory
		| undefined;

	let tokenHistory: TokenHistory;

	if (isRotation && existingTokens) {
		// Perform token rotation - save current as previous
		tokenHistory = {
			current: tokensWithTimestamp,
			previous: existingTokens.current,
			rotationCount: (existingTokens.rotationCount || 0) + 1,
			lastRotationAt: Date.now(),
		};
		console.log("Token rotation performed, previous token saved as backup");
	} else {
		// Regular update without rotation
		tokenHistory = {
			current: tokensWithTimestamp,
			previous: existingTokens?.previous,
			rotationCount: existingTokens?.rotationCount || 0,
			lastRotationAt: existingTokens?.lastRotationAt,
		};
	}

	await client.users.updateUser(userId, {
		publicMetadata: {
			qbTokenHistory: tokenHistory,
			qbTokens: tokensWithTimestamp, // Keep for backward compatibility
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

// Get token history if available
export async function getTokenHistory(): Promise<TokenHistory | null> {
	const { userId } = await auth();

	if (!userId) return null;

	const client = await clerkClient();
	const user = await client.users.getUser(userId);

	const tokenHistory = user.publicMetadata.qbTokenHistory as
		| TokenHistory
		| undefined;

	return tokenHistory || null;
}

// Refresh tokens if needed (15 minutes before expiry)
export async function refreshTokensIfNeeded(
	forceRefresh = false,
): Promise<TokenResult> {
	function tokensNeedRefresh(tokens: IntuitTokens): boolean {
		if (!tokens.createdAt) return true;
		const expiryTime = tokens.createdAt + tokens.expires_in * 1000;
		const refreshWindow = 15 * 60 * 1000; // 15 minutes
		const needsRefresh =
			forceRefresh || Date.now() > expiryTime - refreshWindow;

		console.log("Token refresh check:", {
			currentTime: new Date().toISOString(),
			expiryTime: new Date(expiryTime).toISOString(),
			timeUntilExpiry: `${(expiryTime - Date.now()) / 1000 / 60} minutes`,
			needsRefresh,
			forceRefresh,
		});

		return needsRefresh;
	}

	console.log("Starting token refresh check...");
	const tokens = await getTokens();

	if (!tokens) {
		console.log("No tokens found in storage");
		return { status: TokenStatus.NONE, tokens: null };
	}

	console.log("Current tokens:", {
		access_token: tokens.access_token
			? `${tokens.access_token.substring(0, 10)}...`
			: "undefined",
		refresh_token: tokens.refresh_token
			? `${tokens.refresh_token.substring(0, 10)}...`
			: "undefined",
		token_type: tokens.token_type,
		expires_in: tokens.expires_in,
		createdAt: tokens.createdAt
			? new Date(tokens.createdAt).toISOString()
			: "undefined",
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
				access_token: newTokens.access_token
					? `${newTokens.access_token.substring(0, 10)}...`
					: "undefined",
				refresh_token: newTokens.refresh_token
					? `${newTokens.refresh_token.substring(0, 10)}...`
					: "undefined",
				expires_in: newTokens.expires_in,
			});

			// Check if refresh token has changed - if so, it's a rotation
			const isRotation = newTokens.refresh_token !== tokens.refresh_token;
			const status = isRotation ? TokenStatus.ROTATED : TokenStatus.VALID;

			oauthClient.setToken(newTokens);
			await storeTokens(newTokens, isRotation);
			console.log(`New tokens stored successfully (rotation: ${isRotation})`);
			return { status, tokens: newTokens };
		} catch (error) {
			console.error("Error refreshing tokens:", error);
			console.error("Error details:", {
				name: error.name,
				message: error.message,
				status: error.status,
				response: error.response?.data || "No response data",
				stack: error.stack,
			});

			// Fallback to previous token if available
			const tokenHistory = await getTokenHistory();
			if (tokenHistory?.previous && error.status === 400) {
				try {
					console.log("Attempting refresh with previous token");
					// Try refreshing with the previous token
					oauthClient.setToken({
						access_token: tokenHistory.previous.access_token,
						refresh_token: tokenHistory.previous.refresh_token,
						token_type: tokenHistory.previous.token_type,
						expires_in: tokenHistory.previous.expires_in,
						x_refresh_token_expires_in:
							tokenHistory.previous.x_refresh_token_expires_in,
						createdAt: tokenHistory.previous.createdAt,
					});

					const refreshResponse = await oauthClient.refreshUsingToken(
						tokenHistory.previous.refresh_token,
					);
					const newTokens = refreshResponse.getJson();

					// Store as rotation since we're getting a fresh token
					await storeTokens(newTokens, true);
					console.log("Fallback to previous token successful");
					return { status: TokenStatus.ROTATED, tokens: newTokens };
				} catch (fallbackError) {
					// Both current and previous tokens failed
					console.log(
						"Both current and previous tokens failed:",
						fallbackError,
					);
				}
			}

			// If we get a 400 error, the refresh token may be expired
			if (error.status === 400) {
				console.log("Refresh token might be expired, clearing tokens");
				await clearTokens();
				return { status: TokenStatus.REFRESH_EXPIRED, tokens: null };
			}

			return { status: TokenStatus.ACCESS_EXPIRED, tokens: null };
		}
	}
	console.log("Using existing tokens (no refresh needed)");
	return { status: TokenStatus.VALID, tokens };
}

// Clear tokens from Clerk user metadata without revoking them
export async function clearTokens(): Promise<boolean> {
	const { userId } = await auth();
	if (!userId) return false;

	try {
		// Use clerkClient pattern from docs
		const client = await clerkClient();
		await client.users.updateUser(userId, {
			publicMetadata: {
				qbTokens: null,
				qbTokenHistory: null,
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
		const cleared = await clearTokens();
		return cleared;
	} catch (error) {
		console.error("Error revoking tokens:", error);
		await clearTokens(); // Still try to clear tokens on error
		return false;
	}
}

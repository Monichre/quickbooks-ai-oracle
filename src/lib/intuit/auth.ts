"use server";
// import { cookies } from "next/headers";
import { encrypt, decrypt } from "./encryption";
import { oauthClient } from "@/lib/intuit/client";

// Constants
const TOKEN_COOKIE_NAME = "qb_tokens";
const TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Initialize OAuth client

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
		scope: (process.env.QB_SCOPES || "com.intuit.quickbooks.accounting").split(
			",",
		),
		state: generateRandomState(),
	});
}

// Generate a random state value for OAuth security
function generateRandomState() {
	return Math.random().toString(36).substring(2, 15);
}

// Store tokens securely in cookies
export async function storeTokens(tokens: IntuitTokens) {
	// Add creation timestamp
	const tokensWithTimestamp = {
		...tokens,
		createdAt: Date.now(),
	};

	const encryptedTokens = encrypt(JSON.stringify(tokensWithTimestamp));

	// Store in HTTP-only cookie via API route
	await fetch("/api/auth/set-cookie", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: TOKEN_COOKIE_NAME,
			value: encryptedTokens,
			maxAge: TOKEN_COOKIE_MAX_AGE,
		}),
	});
}

// Retrieve tokens from cookies
export async function getTokens(): Promise<IntuitTokens | null> {
	try {
		// Get cookie via API route
		const response = await fetch(
			`/api/auth/get-cookie?name=${TOKEN_COOKIE_NAME}`,
		);
		if (!response.ok) return null;

		const { value } = await response.json();
		if (!value) return null;

		const decryptedTokens = decrypt(value);
		return JSON.parse(decryptedTokens) as IntuitTokens;
	} catch (error) {
		console.error("Error getting tokens:", error);
		return null;
	}
}

// Refresh tokens if needed
export async function refreshTokensIfNeeded(): Promise<IntuitTokens | null> {
	// Check if tokens need to be refreshed (15 minutes before expiry)
	function tokensNeedRefresh(tokens: IntuitTokens): boolean {
		if (!tokens.createdAt) return true;

		const expiryTime = tokens.createdAt + tokens.expires_in * 1000;
		const refreshWindow = 15 * 60 * 1000; // 15 minutes in milliseconds
		return Date.now() > expiryTime - refreshWindow;
	}

	const tokens = await getTokens();

	if (!tokens) return null;

	if (tokensNeedRefresh(tokens)) {
		try {
			const refreshResponse = await oauthClient.refreshUsingToken(
				tokens.refresh_token,
			);
			const newTokens = refreshResponse.getJson();
			await storeTokens(newTokens);
			return newTokens;
		} catch (error) {
			console.error("Error refreshing tokens:", error);
			return null;
		}
	}

	return tokens;
}

// Revoke tokens
export async function revokeTokens(): Promise<boolean> {
	const tokens = await getTokens();

	if (!tokens) return false;

	try {
		await oauthClient.revoke({ token: tokens.access_token });

		// Delete cookie via API route
		await fetch(`/api/auth/delete-cookie?name=${TOKEN_COOKIE_NAME}`, {
			method: "DELETE",
		});

		return true;
	} catch (error) {
		console.error("Error revoking tokens:", error);
		return false;
	}
}

// Check if the user is authenticated with Intuit
export async function isAuthenticated(): Promise<boolean> {
	const tokens = await refreshTokensIfNeeded();
	return !!tokens;
}

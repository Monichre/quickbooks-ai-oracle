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
		state: "test ",
	});
}

// Generate a random state value for OAuth security
function generateRandomState() {
	return Math.random().toString(36).substring(2, 15);
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
	const { userId } = await auth();
	if (!userId) return null;

	const client = await clerkClient();
	const user = await client.users.getUser(userId);
	const tokens = user.publicMetadata.qbTokens as IntuitTokens | undefined;

	console.log("🚀 ~ getTokens ~ tokens:", tokens);

	return tokens || null;
}

// Refresh tokens if needed (15 minutes before expiry)
export async function refreshTokensIfNeeded(): Promise<IntuitTokens | null> {
	function tokensNeedRefresh(tokens: IntuitTokens): boolean {
		if (!tokens.createdAt) return true;
		const expiryTime = tokens.createdAt + tokens.expires_in * 1000;
		const refreshWindow = 15 * 60 * 1000; // 15 minutes
		return Date.now() > expiryTime - refreshWindow;
	}

	const tokens = await getTokens();

	console.log("🚀 ~ refreshTokensIfNeeded ~ tokens:", tokens);

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
// const refreshTokens = async () => {
// 	const tokensNeedRefresh = oauthClient.isAccessTokenValid();
// 	// const tokens = await getTokens();
// 	// if (!tokens) return null;

// 	if (tokensNeedRefresh) {
// 		try {
// 			const refreshResponse = await oauthClient.refresh().then(authResponse => authResponse.getToken())
// 			// const newTokens = refreshResponse.getJson();
// 			// await storeTokens(newTokens);
// 			// return newTokens;
// 		} catch (error) {
// 			console.error("Error refreshing tokens:", error);
// 			return null;
// 		}
// 	}
// 	return tokens;
// // }
// }
// Revoke tokens and remove them from Clerk user metadata
export async function revokeTokens(): Promise<boolean> {
	const tokens = await getTokens();
	if (!tokens) return false;

	try {
		await oauthClient.revoke({ token: tokens.access_token });

		const { userId } = await auth();
		if (!userId) return false;

		// Use clerkClient pattern from docs
		const client = await clerkClient();
		await client.users.updateUser(userId, {
			publicMetadata: {
				qbTokens: null,
			},
		});

		return true;
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

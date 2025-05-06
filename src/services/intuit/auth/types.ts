export type IntuitTokens = {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	x_refresh_token_expires_in: number;
	token_type: string;
	createdAt?: number;
};

export enum TokenStatus {
	VALID = "valid",
	ACCESS_EXPIRED = "access_expired", // Just access token expired but refresh token valid
	REFRESH_EXPIRED = "refresh_expired", // Refresh token expired
	REVOKED = "revoked", // Tokens were deliberately revoked
	ROTATED = "rotated", // Token was successfully rotated
	NONE = "none", // No tokens found
}

export type TokenResult = {
	status: TokenStatus;
	tokens: IntuitTokens | null;
};

export type TokenHistory = {
	current: IntuitTokens;
	previous?: IntuitTokens; // Keep one previous token set as fallback
	rotationCount: number;
	lastRotationAt?: number;
};

"use server";

import { redirectToAuth, refreshTokensIfNeeded } from "@/services/intuit/auth";
import {
	QuickbooksConfigError,
	QuickbooksAuthError,
	QuickbooksApiError,
} from "./quickbooks-errors";
import { TokenStatus } from "@/services/intuit/auth";

// Type for object-based arguments
export type QuickbooksRequestArgs<D = Record<string, unknown>> = {
	endpoint: string;
	method?: "GET" | "POST" | "PUT" | "DELETE";
	data?: D;
	timeout?: number; // Added timeout parameter
};

// Environment validation
const validateEnvironment = () => {
	const {
		NEXT_PUBLIC_INTUIT_API_BASE_URL,

		INTUIT_BASE_URL,
		INTUIT_COMPANY_ID: COMPANY_ID,
		QB_ENVIRONMENT = "sandbox",
	} = process.env;

	console.log("🚀 ~ validateEnvironment ~ process.env:", process.env);

	const BASE_URL =
		process.env.NEXT_PUBLIC_INTUIT_API_BASE_URL || process.env.INTUIT_BASE_URL;

	console.log("🚀 ~ validateEnvironment ~ BASE_URL:", BASE_URL);

	if (!BASE_URL) {
		throw new QuickbooksConfigError(
			"Environment variable NEXT_PUBLIC_INTUIT_API_BASE_URL is required",
		);
	}

	if (!COMPANY_ID) {
		throw new QuickbooksConfigError(
			"Environment variable INTUIT_COMPANY_ID is required",
		);
	}

	return { BASE_URL, COMPANY_ID, QB_ENVIRONMENT };
};

// Default timeout in ms
const DEFAULT_TIMEOUT = 30000;

// Parse API response with improved error handling
const parseResponse = async <T>(response: Response): Promise<T> => {
	console.log("🚀 ~ response:", response);

	// Check status first before attempting to parse
	if (!response.ok) {
		const errorText = await response.text();

		console.log("🚀 ~ errorText:", errorText);

		let errorData: unknown;

		try {
			// Try to parse error body if possible
			errorData = JSON.parse(errorText);

			console.log("🚀 ~ errorData:", errorData);
		} catch {
			// If error body isn't valid JSON, use text directly
			errorData = errorText;

			console.log("🚀 ~ errorData:", errorData);
		}

		// Check for auth-related errors (401, 403)
		if (response.status === 401 || response.status === 403) {
			// Force token refresh on auth errors
			console.log("Auth error detected, forcing token refresh");
			const tokenResult = await refreshTokensIfNeeded(true);

			if (tokenResult.status === TokenStatus.REFRESH_EXPIRED) {
				await redirectToAuth();
			}
		}

		throw new QuickbooksApiError(
			response.status,
			response.statusText,
			errorData,
		);
	}

	// Only parse successful responses
	const text = await response.text();

	console.log("🚀 ~ text:", text);

	try {
		const parsedText = JSON.parse(text) as T;

		console.log("🚀 ~ parsedText:", parsedText);

		return parsedText;
	} catch (err) {
		throw new Error(
			`Invalid JSON response from QuickBooks API: ${text.substring(0, 100)}...`,
		);
	}
};

// Function overloads to support all calling patterns
// Overload 1: Full positional parameters with timeout
export async function quickbooksRequest<T, D = Record<string, unknown>>(
	endpoint: string,
	method: "GET" | "POST" | "PUT" | "DELETE",
	data: D,
	timeout?: number,
): Promise<T>;

// Overload 2: Endpoint and data (common case)
export async function quickbooksRequest<T, D = Record<string, unknown>>(
	endpoint: string,
	data: D,
): Promise<T>;

// Overload 3: Just endpoint (for GET requests)
export async function quickbooksRequest<T>(endpoint: string): Promise<T>;

// Overload 4: Object parameter
export async function quickbooksRequest<T, D = Record<string, unknown>>(
	args: QuickbooksRequestArgs<D>,
): Promise<T>;

// Implementation that handles all overloads
export async function quickbooksRequest<T, D = Record<string, unknown>>(
	endpointOrArgs: string | QuickbooksRequestArgs<D>,
	methodOrData?: "GET" | "POST" | "PUT" | "DELETE" | D,
	data?: D,
	timeout?: number,
): Promise<T> {
	let endpoint: string;
	let requestMethod: "GET" | "POST" | "PUT" | "DELETE";
	let requestData: D | undefined;
	let requestTimeout: number = DEFAULT_TIMEOUT;

	if (typeof endpointOrArgs === "string") {
		endpoint = endpointOrArgs;

		// Handle the case where the second parameter is the data (not a method)
		if (methodOrData && typeof methodOrData !== "string") {
			requestMethod = "GET"; // Default to GET
			requestData = methodOrData as D;
		} else {
			requestMethod =
				(methodOrData as "GET" | "POST" | "PUT" | "DELETE") || "GET";
			requestData = data;
		}

		// Use provided timeout or default
		if (timeout !== undefined) {
			requestTimeout = timeout;
		}
	} else {
		// Using object parameter
		endpoint = endpointOrArgs.endpoint;
		requestMethod = endpointOrArgs.method || "GET";
		requestData = endpointOrArgs.data;

		// Use provided timeout or default
		if (endpointOrArgs.timeout !== undefined) {
			requestTimeout = endpointOrArgs.timeout;
		}
	}

	const env = validateEnvironment();

	// Ensure tokens are fresh
	const tokenResult = await refreshTokensIfNeeded();

	// Handle token status
	if (tokenResult.status === TokenStatus.REFRESH_EXPIRED) {
		console.log(
			"Refresh token has expired, redirecting to authentication flow",
		);
		await redirectToAuth();
	}

	if (
		tokenResult.status !== TokenStatus.VALID &&
		tokenResult.status !== TokenStatus.ROTATED &&
		!tokenResult.tokens
	) {
		throw new QuickbooksAuthError("Not authenticated with QuickBooks");
	}

	const tokens = tokenResult.tokens;

	const API_ROOT = `${env.BASE_URL}/v3/company/${env.COMPANY_ID}`;
	const url = `${API_ROOT}/${endpoint}`;

	// Build request options
	const headers: Record<string, string> = {
		Authorization: `Bearer ${tokens.access_token}`,
		"Content-Type": "application/json",
		Accept: "application/json",
	};

	// AbortController for timeout
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

	try {
		const response = await fetch(url, {
			method: requestMethod,
			headers,
			body:
				requestMethod !== "GET" && requestData
					? JSON.stringify(requestData)
					: undefined,
			signal: controller.signal,
		});

		console.log("🚀 ~ response:", response);

		return await parseResponse<T>(response);
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") {
			throw new Error(
				`QuickBooks API request timed out after ${requestTimeout}ms`,
			);
		}

		// Handle network errors that might be due to expired tokens
		if (
			error instanceof Error &&
			(error.message.includes("network") ||
				error.message.includes("authentication required") ||
				error.message.includes("failed") ||
				error.message.includes("expired"))
		) {
			// Force token refresh and retry once
			console.log(
				"Network or auth error, attempting token refresh:",
				error.message,
			);
			const tokenResult = await refreshTokensIfNeeded(true); // Force refresh

			if (tokenResult.status === TokenStatus.REFRESH_EXPIRED) {
				await redirectToAuth();
			}

			if (
				(tokenResult.status === TokenStatus.VALID ||
					tokenResult.status === TokenStatus.ROTATED) &&
				tokenResult.tokens
			) {
				// Retry the request with new token
				console.log("Retrying request with fresh token");
				const retryResponse = await fetch(url, {
					method: requestMethod,
					headers: {
						...headers,
						Authorization: `Bearer ${tokenResult.tokens.access_token}`,
					},
					body:
						requestMethod !== "GET" && requestData
							? JSON.stringify(requestData)
							: undefined,
				});

				return await parseResponse<T>(retryResponse);
			}
		}

		throw error;
	} finally {
		clearTimeout(timeoutId);
	}
}

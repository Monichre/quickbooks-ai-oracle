// @ts-nocheckw

import { refreshTokensIfNeeded } from "../auth";

// Check for required environment variables
if (!process.env.QB_ENVIRONMENT) {
	console.warn("QB_ENVIRONMENT is not set. Defaulting to 'sandbox'.");
}

console.log("🚀 ~ process.env.QB_COMPANY_ID:", process.env.QB_COMPANY_ID);
console.log(
	"🚀 ~ process.env.INTUIT_COMPANY_ID:",
	process.env.INTUIT_COMPANY_ID,
);
if (!process.env.QB_COMPANY_ID && !process.env.INTUIT_COMPANY_ID) {
	console.error(
		"Missing company ID! Please set QB_COMPANY_ID or INTUIT_SANDBOX_COMPANY_ID",
	);
}

// Base URL for QuickBooks API

// Company ID from env
const companyId = process.env.INTUIT_COMPANY_ID;

console.log("🚀 ~ companyId:", companyId);
const apiRoot = `${process.env.INTUIT_API_BASE_URL}/v3/company/${companyId}`;

console.log("🚀 ~ apiRoot:", apiRoot);

console.log("🚀 ~ apiRoot:", apiRoot);
if (
	!process.env.NEXT_PUBLIC_INTUIT_API_BASE_URL ||
	!process.env.INTUIT_API_BASE_URL
) {
	console.error(
		"Missing INTUIT_BASE_URL! Please set INTUIT_BASE_URL environment variable",
	);
	throw new Error("INTUIT_BASE_URL environment variable is required");
}

// Validate company ID before any requests
// if (!companyId) {
// 	throw new Error("QuickBooks company ID not found in environment variables");
// }

/**
 * Makes authenticated requests to the QuickBooks API
 * @param endpoint - The API endpoint to call
 * @param method - HTTP method (GET, POST, etc)
 * @param data - Optional data to send with the request
 * @returns Promise with the API response
 */
export async function quickbooksRequest<T, D = Record<string, unknown>>(
	endpoint: string,
	method = "GET",
	data?: D,
): Promise<T> {
	const companyId = process.env.INTUIT_COMPANY_ID;
	const apiRoot = `${process.env.NEXT_PUBLIC_INTUIT_API_BASE_URL}/v3/company/${companyId}`;
	if (
		!process.env.NEXT_PUBLIC_INTUIT_API_BASE_URL ||
		!process.env.INTUIT_API_BASE_URL
	) {
		console.error(
			"Missing INTUIT_BASE_URL! Please set INTUIT_BASE_URL environment variable",
		);
		throw new Error("INTUIT_BASE_URL environment variable is required");
	}
	// Refresh tokens if needed
	const tokens = await refreshTokensIfNeeded();

	console.log("🚀 ~ tokens:", tokens);

	if (!tokens) {
		throw new Error("Not authenticated with QuickBooks");
	}

	// Full API URL
	const url = `${apiRoot}/${endpoint}`;

	console.log(`Making QuickBooks API request to: ${url}`);
	console.log(`Using token: ${tokens.access_token.substring(0, 10)}...`);
	console.log(`Company ID: ${companyId}`);
	console.log(`Environment: ${process.env.QB_ENVIRONMENT || "undefined"}`);

	// API request options
	const options: RequestInit = {
		method,
		headers: {
			Authorization: `Bearer ${tokens.access_token}`,
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	};

	if (data && method !== "GET") {
		// Add body data for non-GET requests
		options.body = JSON.stringify(data);
	}

	// Make the request
	const response = await fetch(url, options);
	console.log("🚀 ~ response:", response);
	const res = await response.json();

	console.log("🚀 ~ res:", res);

	if (!response.ok) {
		// Handle non-successful responses
		const errorData = await response.json().catch(() => null);

		console.log("🚀 ~ errorData:", errorData);

		// Log detailed error information
		console.error("QuickBooks API error details:", {
			status: response.status,
			statusText: response.statusText,
			url,
			errorData,
			headers: Object.fromEntries(response.headers.entries()),
		});

		throw new Error(
			`QuickBooks API error: ${response.status} ${response.statusText}`,
			{ cause: errorData },
		);
	}

	// Parse and return the JSON response
	return res;
}

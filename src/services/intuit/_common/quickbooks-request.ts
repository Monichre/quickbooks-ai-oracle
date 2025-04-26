import { refreshTokensIfNeeded } from "../auth";

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
export type QuickbooksRequestArgs<D = Record<string, unknown>> = {
	endpoint: string;
	method?: "GET" | "POST" | "PUT" | "DELETE";
	data?: D;
};

export async function quickbooksRequest<T, D = Record<string, unknown>>(
	endpoint: string,
	method = "GET",
	data?: D,
): Promise<T> {
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
	if (
		!process.env.NEXT_PUBLIC_INTUIT_API_BASE_URL ||
		!process.env.INTUIT_API_BASE_URL ||
		!process.env.INTUIT_BASE_URL ||
		!process.env.NEXT_PUBLIC_INTUIT_BASE_URL
	) {
		console.error(
			"Missing INTUIT_BASE_URL! Please set INTUIT_BASE_URL environment variable",
		);
		// throw new Error("INTUIT_BASE_URL environment variable is required");
	}
	if (
		!process.env.NEXT_PUBLIC_INTUIT_API_BASE_URL ||
		!process.env.INTUIT_API_BASE_URL
	) {
		console.error(
			"Missing INTUIT_BASE_URL! Please set INTUIT_BASE_URL environment variable",
		);
		// throw new Error("INTUIT_BASE_URL environment variable is required");
	}
	const companyId = process.env.INTUIT_COMPANY_ID;
	const apiRoot = `${process.env.NEXT_PUBLIC_INTUIT_API_BASE_URL}/v3/company/${companyId}`;

	// Refresh tokens if needed
	const tokens = await refreshTokensIfNeeded();

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
			Accept: "application/json, text/plain, */*",
			"Content-Type": method === "GET" ? "text/plain" : "application/json",
		},
	};

	if (data && method !== "GET") {
		// Add body data for non-GET requests
		options.body = JSON.stringify(data);
	}
	console.log("🚀 ~ options.body:", options.body);

	// Make the request
	console.log("🚀 ~ Making request to:", url);
	console.log("🚀 ~ With options:", {
		method: options.method,
		headers: options.headers,
		body: options.body ? JSON.parse(options.body) : undefined
	});
	
	let response;
	try {
		response = await fetch(url, options);
		console.log(`🚀 ~${endpoint} response status:`, response.status);
		console.log(`🚀 ~${endpoint} response headers:`, Object.fromEntries(response.headers.entries()));
	} catch (err) {
		console.error("🚀 ~ Network error:", err);
		throw new Error(`Network error connecting to QuickBooks API: ${err.message}`);
	}
	
	let res;
	try {
		const textResponse = await response.text();
		console.log(`🚀 ~${endpoint} raw response:`, textResponse.substring(0, 500) + (textResponse.length > 500 ? '...' : ''));
		
		try {
			res = JSON.parse(textResponse);
			console.log("🚀 ~ parsed response:", res);
		} catch (parseErr) {
			console.error("🚀 ~ JSON parse error:", parseErr);
			throw new Error(`Invalid JSON response from QuickBooks API: ${textResponse.substring(0, 100)}...`);
		}
	} catch (err) {
		console.error("🚀 ~ Error reading response body:", err);
		throw new Error(`Error reading QuickBooks API response: ${err.message}`);
	}

	if (!response.ok) {
		// Handle non-successful responses
		console.error("QuickBooks API error details:", {
			status: response.status,
			statusText: response.statusText,
			url,
			errorData: res,
			headers: Object.fromEntries(response.headers.entries()),
		});

		throw new Error(
			`QuickBooks API error: ${response.status} ${response.statusText}`,
			{ cause: res },
		);
	}

	// Parse and return the JSON response
	return res;
}

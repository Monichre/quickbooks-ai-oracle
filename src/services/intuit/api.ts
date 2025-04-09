// import { refreshTokensIfNeeded } from "./auth";

// // At the top of the file, add these constants
// const INTUIT_API_BASE_URL =
// 	process.env.INTUIT_API_BASE_URL ||
// 	process.env.NEXT_PUBLIC_INTUIT_API_BASE_URL ||
// 	(process.env.NODE_ENV === "development"
// 		? "https://sandbox-quickbooks.api.intuit.com" // Only use default in local development
// 		: undefined);

// // Ensure we have a base URL - if not in development and no env var, we'll throw an error later
// const INTUIT_COMPANY_ID =
// 	process.env.INTUIT_COMPANY_ID || process.env.QB_COMPANY_ID;

// // Check for required environment variables
// const QB_ENVIRONMENT =
// 	process.env.QB_ENVIRONMENT ||
// 	process.env.NEXT_PUBLIC_QB_ENVIRONMENT ||
// 	"sandbox"; // Default to sandbox if not specified

// if (!QB_ENVIRONMENT) {
// 	console.warn("QB_ENVIRONMENT is not set. Defaulting to 'sandbox'.");
// }

// console.log("🚀 ~ process.env.QB_COMPANY_ID:", process.env.QB_COMPANY_ID);
// console.log(
// 	"🚀 ~ process.env.INTUIT_COMPANY_ID:",
// 	process.env.INTUIT_COMPANY_ID,
// );
// // if (!process.env.QB_COMPANY_ID && !process.env.INTUIT_COMPANY_ID) {
// // 	console.error(
// // 		"Missing company ID! Please set QB_COMPANY_ID or INTUIT_SANDBOX_COMPANY_ID",
// // 	);
// // }

// // Log the company ID that will be used
// console.log("🚀 ~ companyId:", INTUIT_COMPANY_ID);

// // Only define apiRoot inside the function where it's used

// /**
//  * Properly encodes a QuickBooks query component for URL usage
//  * This is necessary because QuickBooks requires specific encoding for query parameters
//  */
// function encodeQueryComponent(queryEndpoint: string): string {
// 	// Split the endpoint into the base part and the query part
// 	const [base, queryPart] = queryEndpoint.split("?query=");

// 	if (!queryPart) {
// 		return queryEndpoint; // No query to encode
// 	}

// 	// Encode just the query part, preserving QuickBooks SQL-like syntax
// 	const encodedQuery = encodeURIComponent(queryPart);

// 	// Reconstruct the endpoint
// 	return `${base}?query=${encodedQuery}`;
// }

// /**
//  * Makes authenticated requests to the QuickBooks API
//  * @param endpoint - The API endpoint to call
//  * @param method - HTTP method (GET, POST, etc)
//  * @param data - Optional data to send with the request
//  * @returns Promise with the API response
//  */
// // export async function quickbooksRequest<T, D = Record<string, unknown>>(
// // 	endpoint: string,
// // 	method = "GET",
// // 	data?: D,
// // ): Promise<T> {
// // 	console.log("🚀 ~ endpoint:", endpoint);

// // 	const companyId = INTUIT_COMPANY_ID;

// // 	if (!companyId) {
// // 		throw new Error("QuickBooks company ID not found in environment variables");
// // 	}

// // 	if (!INTUIT_API_BASE_URL) {
// // 		throw new Error(
// // 			"QuickBooks API base URL not found in environment variables",
// // 		);
// // 	}

// // 	const apiRoot = `${INTUIT_API_BASE_URL}/v3/company/${companyId}`;

// // 	console.log("🚀 ~ apiRoot:", apiRoot);

// // 	// Always force a token refresh for API operations to ensure we have valid tokens
// // 	// This is more aggressive than the standard refresh behavior
// // 	const tokens = await refreshTokensIfNeeded(true);

// // 	console.log("🚀 ~ tokens:", tokens);

// // 	if (!tokens) {
// // 		throw new Error("Not authenticated with QuickBooks");
// // 	}

// // 	// Full API URL
// // 	const url = `${apiRoot}/${endpoint}`;

// // 	console.log("🚀 ~ url:", url);

// // 	console.log(`Making QuickBooks API request to: ${url}`);
// // 	console.log(`Using token: ${tokens.access_token.substring(0, 10)}...`);
// // 	console.log(`Company ID: ${companyId}`);
// // 	console.log(`Environment: ${QB_ENVIRONMENT}`);

// // 	// Prepare the final URL with proper encoding for query parameters
// // 	let finalUrl = url;
// // 	if (endpoint.startsWith("query?")) {
// // 		// For query endpoints, we need to properly encode the query part
// // 		const [base, ...rest] = endpoint.split("?query=");
// // 		const queryPart = rest.join("?query="); // Handle any rare cases with multiple ?query= strings

// // 		if (queryPart) {
// // 			// Encode the query part, accounting for QuickBooks specific syntax
// // 			const encodedQuery = encodeURIComponent(queryPart);
// // 			// Add minorversion parameter which is required by QuickBooks API
// // 			finalUrl = `${apiRoot}/${base}?query=${encodedQuery}&minorversion=75`;
// // 			console.log("🚀 ~ encoded URL:", finalUrl);
// // 		}
// // 	} else {
// // 		// For non-query endpoints, still add the minorversion parameter
// // 		finalUrl = url.includes("?")
// // 			? `${url}&minorversion=75`
// // 			: `${url}?minorversion=75`;
// // 	}

// // 	console.log("🚀 ~ final URL with minorversion:", finalUrl);

// // 	// API request options
// // 	const options: RequestInit = {
// // 		method,
// // 		headers: {
// // 			Authorization: `Bearer ${tokens.access_token}`,
// // 			Accept: "application/json",
// // 			"Content-Type": "application/json",
// // 		},
// // 	};

// // 	if (data && method !== "GET") {
// // 		// Add body data for non-GET requests
// // 		options.body = JSON.stringify(data);
// // 	}

// // 	// Make the request using the properly encoded URL
// // 	const response = await fetch(finalUrl, options);
// // 	console.log("🚀 ~ response status:", response.status);

// // 	if (!response.ok) {
// // 		// Handle non-successful responses
// // 		const errorData = await response.json().catch(() => null);

// // 		console.log("🚀 ~ errorData:", errorData);

// // 		// Check specifically for 003200 error (ApplicationAuthenticationFailed)
// // 		interface IntuitErrorObject {
// // 			code: string;
// // 			message?: string;
// // 			detail?: string;
// // 			element?: string;
// // 		}

// // 		const is003200Error =
// // 			errorData?.Fault?.Error?.some(
// // 				(e: IntuitErrorObject) => e.code === "003200",
// // 			) || JSON.stringify(errorData).includes("003200");

// // 		// Log detailed error information
// // 		console.error("QuickBooks API error details:", {
// // 			status: response.status,
// // 			statusText: response.statusText,
// // 			url: finalUrl,
// // 			errorData,
// // 			is003200Error,
// // 			headers: Object.fromEntries(response.headers.entries()),
// // 		});

// // 		// Special handling for auth errors - force new auth if we get 003200
// // 		if (response.status === 401 || is003200Error) {
// // 			// For authentication failures, we should force a new authentication
// // 			console.error("Authentication error detected. Forcing reauthentication.");

// // 			// Try to refresh tokens one more time
// // 			const freshTokens = await refreshTokensIfNeeded(true);

// // 			if (!freshTokens) {
// // 				throw new Error(
// // 					"Authentication failed with QuickBooks. Please reconnect your account.",
// // 				);
// // 			}

// // 			// If we got fresh tokens, retry the request once
// // 			console.log("Retrying request with fresh tokens");

// // 			// Update authorization header with new token
// // 			options.headers = {
// // 				...options.headers,
// // 				Authorization: `Bearer ${freshTokens.access_token}`,
// // 			};

// // 			// Retry the request
// // 			const retryResponse = await fetch(finalUrl, options);

// // 			if (!retryResponse.ok) {
// // 				// If retry fails, give up and throw error
// // 				const retryErrorData = await retryResponse.json().catch(() => null);
// // 				throw new Error(
// // 					`QuickBooks API error after token refresh: ${retryResponse.status} ${retryResponse.statusText}`,
// // 					{ cause: retryErrorData },
// // 				);
// // 			}

// // 			// Parse and return successful retry response
// // 			return await retryResponse.json();
// // 		}

// // 		throw new Error(
// // 			`QuickBooks API error: ${response.status} ${response.statusText}`,
// // 			{ cause: errorData },
// // 		);
// // 	}

// // 	// Parse and return the JSON response
// // 	const res = await response.json();
// // 	console.log("🚀 ~ response successful");

// // 	return res;
// // }
// export async function quickbooksRequest<T, D = Record<string, unknown>>(
// 	endpoint: string,
// 	method = "GET",
// 	data?: D,
// ): Promise<T> {
// 	const companyId = process.env.INTUIT_COMPANY_ID;
// 	const apiRoot = `${process.env.NEXT_PUBLIC_INTUIT_BASE_URL}/v3/company/${companyId}`;
// 	// Refresh tokens if needed

// 	console.log("🚀 ~ apiRoot:", apiRoot);

// 	const tokens = await refreshTokensIfNeeded();

// 	console.log("🚀 ~ tokens:", tokens);

// 	if (!tokens) {
// 		throw new Error("Not authenticated with QuickBooks");
// 	}

// 	// Full API URL
// 	const url = `${apiRoot}/${endpoint}`;

// 	console.log("🚀 ~ url:", url);

// 	console.log(`Making QuickBooks API request to: ${url}`);
// 	console.log(`Using token: ${tokens.access_token.substring(0, 10)}...`);
// 	console.log(`Company ID: ${companyId}`);
// 	console.log(`Environment: ${process.env.QB_ENVIRONMENT || "undefined"}`);

// 	// API request options
// 	const options: RequestInit = {
// 		method,
// 		headers: {
// 			Authorization: `Bearer ${tokens.access_token}`,
// 			Accept: "application/json",
// 			"Content-Type": "application/json",
// 		},
// 	};

// 	if (data && method !== "GET") {
// 		// Add body data for non-GET requests
// 		options.body = JSON.stringify(data);
// 	}

// 	// Make the request
// 	const response = await fetch(url, options);
// 	console.log("🚀 ~ response:", response);
// 	const res = await response.json();

// 	console.log("🚀 ~ res:", res);

// 	if (!response.ok) {
// 		// Handle non-successful responses
// 		const errorData = await response.json().catch(() => null);

// 		console.log("🚀 ~ errorData:", errorData);

// 		// Log detailed error information
// 		console.error("QuickBooks API error details:", {
// 			status: response.status,
// 			statusText: response.statusText,
// 			url,
// 			errorData,
// 			headers: Object.fromEntries(response.headers.entries()),
// 		});

// 		throw new Error(
// 			`QuickBooks API error: ${response.status} ${response.statusText}`,
// 			{ cause: errorData },
// 		);
// 	}

// 	// Parse and return the JSON response
// 	return res;
// }
// /**
//  * Builds a complete QuickBooks query string with proper formatting and validation
//  * @param entity - The QuickBooks entity to query (Customer, Vendor, Invoice, etc.)
//  * @param params - Object containing query parameters
//  * @param fields - Optional specific fields to select (defaults to '*' for all fields)
//  * @returns Properly formatted complete query string ready for the API
//  */
// // export function buildQueryString(
// // 	entity: string,
// // 	params: Record<string, string | number | boolean | undefined> = {},
// // 	fields = "*",
// // ): string {
// // 	if (!entity) {
// // 		throw new Error("Entity name is required for QuickBooks query");
// // 	}

// // 	// Validate entity name to prevent SQL injection
// // 	if (!/^[A-Za-z]+$/.test(entity)) {
// // 		throw new Error(
// // 			`Invalid entity name: ${entity}. Must contain only letters.`,
// // 		);
// // 	}

// // 	// Validate fields
// // 	if (fields !== "*" && !/^[A-Za-z,\s]+$/.test(fields)) {
// // 		throw new Error(
// // 			`Invalid fields: ${fields}. Must contain only letters, commas and spaces.`,
// // 		);
// // 	}

// // 	const queryParts: string[] = [];

// // 	// Handle where conditions
// // 	for (const [key, value] of Object.entries(params)) {
// // 		if (value !== undefined) {
// // 			// Skip pagination and sorting parameters
// // 			if (!["limit", "offset", "asc", "desc"].includes(key)) {
// // 				// Validate key to prevent SQL injection
// // 				if (!/^[A-Za-z_]+$/.test(key)) {
// // 					throw new Error(
// // 						`Invalid parameter name: ${key}. Must contain only letters and underscores.`,
// // 					);
// // 				}

// // 				if (typeof value === "string") {
// // 					// Escape single quotes in string values to prevent SQL injection
// // 					const escapedValue = value.replace(/'/g, "''");
// // 					queryParts.push(`${key} = '${escapedValue}'`);
// // 				} else if (typeof value === "number" || typeof value === "boolean") {
// // 					queryParts.push(`${key} = ${value}`);
// // 				}
// // 			}
// // 		}
// // 	}

// // 	// Build the base query
// // 	let query = `select ${fields} from ${entity}`;

// // 	// Add the WHERE clause if we have conditions
// // 	if (queryParts.length > 0) {
// // 		query += ` WHERE ${queryParts.join(" AND ")}`;
// // 	}

// // 	// Handle sorting
// // 	if (params.asc) {
// // 		// Validate asc field
// // 		if (typeof params.asc === "string" && !/^[A-Za-z_]+$/.test(params.asc)) {
// // 			throw new Error(
// // 				`Invalid sort field: ${params.asc}. Must contain only letters and underscores.`,
// // 			);
// // 		}
// // 		query += ` ORDERBY ${params.asc} ASC`;
// // 	} else if (params.desc) {
// // 		// Validate desc field
// // 		if (typeof params.desc === "string" && !/^[A-Za-z_]+$/.test(params.desc)) {
// // 			throw new Error(
// // 				`Invalid sort field: ${params.desc}. Must contain only letters and underscores.`,
// // 			);
// // 		}
// // 		query += ` ORDERBY ${params.desc} DESC`;
// // 	}

// // 	// Handle limit parameter (MAXRESULTS in QuickBooks API)
// // 	if (params.limit !== undefined) {
// // 		// Validate limit is a positive number
// // 		const limit = Number(params.limit);
// // 		if (Number.isNaN(limit) || limit <= 0) {
// // 			throw new Error(
// // 				`Invalid limit: ${params.limit}. Must be a positive number.`,
// // 			);
// // 		}
// // 		query += ` MAXRESULTS ${limit}`;
// // 	}

// // 	// Return the complete query string for the endpoint
// // 	return `query?query=${encodeURIComponent(query)}`;
// // }

// /**
//  * QuickBooks Query API Endpoint
//  *
//  * GET /v3/company/{companyId}/query?query=<selectStatement>&minorversion=75
//  *
//  * Content type: text/plain
//  * Production Base URL: https://quickbooks.api.intuit.com
//  * Sandbox Base URL: https://sandbox-quickbooks.api.intuit.com
//  *
//  * Used for executing SQL-like queries against QuickBooks entities.
//  */

// /**
//  * Builds a QuickBooks query string from the provided parameters
//  * @param params - Object containing query parameters
//  * @returns Formatted query string
//  */
// export function buildQueryString(
// 	params: Record<string, string | number | boolean | undefined>,
// ): string {
// 	const queryParts: string[] = [];

// 	// Handle where conditions
// 	for (const [key, value] of Object.entries(params)) {
// 		if (value !== undefined) {
// 			// Skip pagination and sorting parameters
// 			if (
// 				!["limit", "offset", "asc", "desc"].includes(key) &&
// 				typeof value === "string"
// 			) {
// 				queryParts.push(`${key} = '${value}'`);
// 			}
// 		}
// 	}

// 	// Add the WHERE clause if we have conditions
// 	let query = queryParts.length > 0 ? ` WHERE ${queryParts.join(" AND ")}` : "";

// 	// Handle sorting
// 	if (params.asc) {
// 		query += ` ORDERBY ${params.asc} ASC`;
// 	} else if (params.desc) {
// 		query += ` ORDERBY ${params.desc} DESC`;
// 	}

// 	// Handle pagination
// 	if (params.limit) {
// 		query += ` MAXRESULTS ${params.limit}`;
// 	}
// 	if (params.offset) {
// 		query += ` STARTPOSITION ${params.offset}`;
// 	}

// 	return query;
// }
// // Re-export all entity APIs
// export * from "./vendor/vendor.api";
// export * from "./item/item.api";
// export * from "./customer/customer.api";
// export * from "./company-info/company-info.api";
// export * from "./account/account.api";
// export * from "./purchase/purchase.api";
// export * from "./purchase-order/purchase-order.api";
// export * from "./invoice/invoice.api";
// export * from "./product/product.api";
// export * from "./payment/payment.api";
// export * from "./bill/bill.api";
// @ts-nocheckw

import { refreshTokensIfNeeded } from "./auth";

// Check for required environment variables
if (!process.env.QB_ENVIRONMENT) {
	console.warn("QB_ENVIRONMENT is not set. Defaulting to 'sandbox'.");
}

console.log("🚀 ~ process.env.QB_COMPANY_ID:", process.env.QB_COMPANY_ID);
console.log(
	"🚀 ~ process.env.INTUIT_COMPANY_ID:",
	process.env.INTUIT_COMPANY_ID,
);
// if (!process.env.QB_COMPANY_ID && !process.env.INTUIT_COMPANY_ID) {
// 	console.error(
// 		"Missing company ID! Please set QB_COMPANY_ID or INTUIT_SANDBOX_COMPANY_ID",
// 	);
// }

// Base URL for QuickBooks API

// Company ID from env
const companyId = process.env.INTUIT_COMPANY_ID;

console.log("🚀 ~ companyId:", companyId);

const root =
	process.env.INTUIT_API_BASE_URL ||
	process.env.NEXT_PUBLIC_INTUIT_BASE_URL ||
	"https://sandbox-quickbooks.api.intuit.com";
const apiRoot = `${root}/v3/company/${companyId}`;

console.log("🚀 ~ apiRoot:", apiRoot);

console.log("🚀 ~ apiRoot:", apiRoot);

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
	// const companyId = process.env.INTUIT_COMPANY_ID;
	// const apiRoot = `${process.env.INTUIT_API_BASE_URL}/v3/company/${companyId}`;
	// Refresh tokens if needed
	const tokens = await refreshTokensIfNeeded();

	console.log("🚀 ~ tokens:", tokens);

	if (!tokens) {
		throw new Error("Not authenticated with QuickBooks");
	}

	// Full API URL
	const url = `${apiRoot}/${endpoint}`;

	console.log("🚀 ~ url:", url);

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

/**
 * QuickBooks Query API Endpoint
 *
 * GET /v3/company/{companyId}/query?query=<selectStatement>&minorversion=75
 *
 * Content type: text/plain
 * Production Base URL: https://quickbooks.api.intuit.com
 * Sandbox Base URL: https://sandbox-quickbooks.api.intuit.com
 *
 * Used for executing SQL-like queries against QuickBooks entities.
 */

/**
 * Builds a QuickBooks query string from the provided parameters
 * @param params - Object containing query parameters
 * @returns Formatted query string
 */
export function buildQueryString(
	params: Record<string, string | number | boolean | undefined>,
): string {
	const queryParts: string[] = [];

	// Handle where conditions
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) {
			// Skip pagination and sorting parameters
			if (
				!["limit", "offset", "asc", "desc"].includes(key) &&
				typeof value === "string"
			) {
				queryParts.push(`${key} = '${value}'`);
			}
		}
	}

	// Add the WHERE clause if we have conditions
	let query = queryParts.length > 0 ? ` WHERE ${queryParts.join(" AND ")}` : "";

	// Handle sorting
	if (params.asc) {
		query += ` ORDERBY ${params.asc} ASC`;
	} else if (params.desc) {
		query += ` ORDERBY ${params.desc} DESC`;
	}

	// Handle pagination
	if (params.limit) {
		query += ` MAXRESULTS ${params.limit}`;
	}
	if (params.offset) {
		query += ` STARTPOSITION ${params.offset}`;
	}

	return query;
}

// Re-export all entity APIs
export * from "./vendor/vendor.api";
export * from "./item/item.api";
export * from "./customer/customer.api";
export * from "./company-info/company-info.api";
export * from "./account/account.api";
export * from "./purchase/purchase.api";
export * from "./purchase-order/purchase-order.api";
export * from "./invoice/invoice.api";
export * from "./product/product.api";

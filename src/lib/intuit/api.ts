import { refreshTokensIfNeeded } from "./auth";
import {
	CompanyInfo,
	type CompanyInfoResponse,
	type Customer,
	type Purchase,
	type PurchaseOrder,
	type QueryParams,
	type Vendor,
} from "./types";

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

const apiRoot = `${process.env.INTUIT_BASE_URL}/v3/company/${companyId}`;

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
	const companyId = process.env.INTUIT_COMPANY_ID;
	const apiRoot = `${process.env.NEXT_PUBLIC_INTUIT_BASE_URL}/v3/company/${companyId}`;
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

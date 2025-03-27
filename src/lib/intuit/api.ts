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

if (!process.env.QB_COMPANY_ID && !process.env.INTUIT_COMPANY_ID) {
	console.error(
		"Missing company ID! Please set QB_COMPANY_ID or INTUIT_SANDBOX_COMPANY_ID",
	);
}

// Base URL for QuickBooks API

// Company ID from env
const companyId = process.env.INTUIT_COMPANY_ID;
const apiRoot = `${process.env.INTUIT_BASE_URL}/v3/company/${companyId}`;

// Validate company ID before any requests
if (!companyId) {
	throw new Error("QuickBooks company ID not found in environment variables");
}

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

	// Add body data for non-GET requests
	if (data && method !== "GET") {
		options.body = JSON.stringify(data);
	}

	// Make the request
	const response = await fetch(url, options);
	console.log("🚀 ~ response:", response);
	const res = await response.json();

	console.log("🚀 ~ res:", res);

	// Handle non-successful responses
	if (!response.ok) {
		const errorData = await response.json().catch(() => null);

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

/**
 * Retrieves company information from QuickBooks
 * @returns Promise with the company information
 */
export async function getCompanyInfo() {
	return quickbooksRequest<CompanyInfoResponse>(
		"query?query=select * from CompanyInfo",
	);
}

// Customer CRUD operations

/**
 * Creates a new customer in QuickBooks
 * @param customerData - Customer data to create
 * @returns Promise with the created customer
 */
export async function createCustomer(customerData: Customer) {
	return quickbooksRequest<{ Customer: Customer }, { Customer: Customer }>(
		"customer",
		"POST",
		{ Customer: customerData },
	);
}

/**
 * Retrieves a customer by ID from QuickBooks
 * @param customerId - ID of the customer to retrieve
 * @returns Promise with the customer data
 */
export async function getCustomer(customerId: string) {
	return quickbooksRequest<{ Customer: Customer }>(`customer/${customerId}`);
}

/**
 * Queries customers in QuickBooks with optional filters
 * @param params - Query parameters and filters
 * @returns Promise with the list of customers matching the query
 */
export async function findCustomers(params: QueryParams = {}) {
	const queryString = buildQueryString(params);
	return quickbooksRequest<{ QueryResponse: { Customer: Customer[] } }>(
		`query?query=select * from Customer${queryString}`,
	);
}

/**
 * Updates an existing customer in QuickBooks
 * @param customerData - Customer data with Id and SyncToken
 * @returns Promise with the updated customer
 */
export async function updateCustomer(
	customerData: Customer & { Id: string; SyncToken: string },
) {
	return quickbooksRequest<{ Customer: Customer }, { Customer: Customer }>(
		"customer",
		"POST",
		{ Customer: customerData },
	);
}

// Vendor CRUD operations

/**
 * Creates a new vendor in QuickBooks
 * @param vendorData - Vendor data to create
 * @returns Promise with the created vendor
 */
export async function createVendor(vendorData: Vendor) {
	return quickbooksRequest<{ Vendor: Vendor }, { Vendor: Vendor }>(
		"vendor",
		"POST",
		{ Vendor: vendorData },
	);
}

/**
 * Retrieves a vendor by ID from QuickBooks
 * @param vendorId - ID of the vendor to retrieve
 * @returns Promise with the vendor data
 */
export async function getVendor(vendorId: string) {
	return quickbooksRequest<{ Vendor: Vendor }>(`vendor/${vendorId}`);
}

/**
 * Queries vendors in QuickBooks with optional filters
 * @param params - Query parameters and filters
 * @returns Promise with the list of vendors matching the query
 */
export async function findVendors(params: QueryParams = {}) {
	const queryString = buildQueryString(params);
	return quickbooksRequest<{ QueryResponse: { Vendor: Vendor[] } }>(
		`query?query=select * from Vendor${queryString}`,
	);
}

/**
 * Updates an existing vendor in QuickBooks
 * @param vendorData - Vendor data with Id and SyncToken
 * @returns Promise with the updated vendor
 */
export async function updateVendor(
	vendorData: Vendor & { Id: string; SyncToken: string },
) {
	return quickbooksRequest<{ Vendor: Vendor }, { Vendor: Vendor }>(
		"vendor",
		"POST",
		{ Vendor: vendorData },
	);
}

// Purchase CRUD operations

/**
 * Creates a new purchase in QuickBooks
 * @param purchaseData - Purchase data to create
 * @returns Promise with the created purchase
 */
export async function createPurchase(purchaseData: Purchase) {
	return quickbooksRequest<{ Purchase: Purchase }, { Purchase: Purchase }>(
		"purchase",
		"POST",
		{ Purchase: purchaseData },
	);
}

/**
 * Retrieves a purchase by ID from QuickBooks
 * @param purchaseId - ID of the purchase to retrieve
 * @returns Promise with the purchase data
 */
export async function getPurchase(purchaseId: string) {
	return quickbooksRequest<{ Purchase: Purchase }>(`purchase/${purchaseId}`);
}

/**
 * Queries purchases in QuickBooks with optional filters
 * @param params - Query parameters and filters
 * @returns Promise with the list of purchases matching the query
 */
export async function findPurchases(params: QueryParams = {}) {
	const queryString = buildQueryString(params);
	return quickbooksRequest<{ QueryResponse: { Purchase: Purchase[] } }>(
		`query?query=select * from Purchase${queryString}`,
	);
}

/**
 * Updates an existing purchase in QuickBooks
 * @param purchaseData - Purchase data with Id and SyncToken
 * @returns Promise with the updated purchase
 */
export async function updatePurchase(
	purchaseData: Purchase & { Id: string; SyncToken: string },
) {
	return quickbooksRequest<{ Purchase: Purchase }, { Purchase: Purchase }>(
		"purchase",
		"POST",
		{ Purchase: purchaseData },
	);
}

/**
 * Deletes a purchase in QuickBooks
 * @param purchaseId - ID of the purchase to delete
 * @param syncToken - SyncToken of the purchase to delete
 * @returns Promise with the deletion result
 */
export async function deletePurchase(purchaseId: string, syncToken: string) {
	return quickbooksRequest<
		{ Purchase: Purchase },
		{ Id: string; SyncToken: string }
	>("purchase?operation=delete", "POST", {
		Id: purchaseId,
		SyncToken: syncToken,
	});
}

// PurchaseOrder CRUD operations

/**
 * Creates a new purchase order in QuickBooks
 * @param poData - Purchase order data to create
 * @returns Promise with the created purchase order
 */
export async function createPurchaseOrder(poData: PurchaseOrder) {
	return quickbooksRequest<
		{ PurchaseOrder: PurchaseOrder },
		{ PurchaseOrder: PurchaseOrder }
	>("purchaseorder", "POST", { PurchaseOrder: poData });
}

/**
 * Retrieves a purchase order by ID from QuickBooks
 * @param purchaseOrderId - ID of the purchase order to retrieve
 * @returns Promise with the purchase order data
 */
export async function getPurchaseOrder(purchaseOrderId: string) {
	return quickbooksRequest<{ PurchaseOrder: PurchaseOrder }>(
		`purchaseorder/${purchaseOrderId}`,
	);
}

/**
 * Queries purchase orders in QuickBooks with optional filters
 * @param params - Query parameters and filters
 * @returns Promise with the list of purchase orders matching the query
 */
export async function findPurchaseOrders(params: QueryParams = {}) {
	const queryString = buildQueryString(params);
	return quickbooksRequest<{
		QueryResponse: { PurchaseOrder: PurchaseOrder[] };
	}>(`query?query=select * from PurchaseOrder${queryString}`);
}

/**
 * Updates an existing purchase order in QuickBooks
 * @param poData - Purchase order data with Id and SyncToken
 * @returns Promise with the updated purchase order
 */
export async function updatePurchaseOrder(
	poData: PurchaseOrder & { Id: string; SyncToken: string },
) {
	return quickbooksRequest<
		{ PurchaseOrder: PurchaseOrder },
		{ PurchaseOrder: PurchaseOrder }
	>("purchaseorder", "POST", { PurchaseOrder: poData });
}

/**
 * Deletes a purchase order in QuickBooks
 * @param purchaseOrderId - ID of the purchase order to delete
 * @param syncToken - SyncToken of the purchase order to delete
 * @returns Promise with the deletion result
 */
export async function deletePurchaseOrder(
	purchaseOrderId: string,
	syncToken: string,
) {
	return quickbooksRequest<
		{ PurchaseOrder: PurchaseOrder },
		{ Id: string; SyncToken: string }
	>("purchaseorder?operation=delete", "POST", {
		Id: purchaseOrderId,
		SyncToken: syncToken,
	});
}

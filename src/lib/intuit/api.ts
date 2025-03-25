import { refreshTokensIfNeeded } from "./auth";

// Base URL for QuickBooks API
const baseUrl =
	process.env.QB_ENVIRONMENT === "sandbox"
		? "https://sandbox-quickbooks.api.intuit.com/v3/company/"
		: "https://quickbooks.api.intuit.com/v3/company/";

// Company ID from env
const companyId = process.env.INTUIT_SANDBOX_COMPANY_ID;

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

	if (!tokens) {
		throw new Error("Not authenticated with QuickBooks");
	}

	// Full API URL
	const url = `${baseUrl}${companyId}/${endpoint}`;

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

	// Handle non-successful responses
	if (!response.ok) {
		const errorData = await response.json().catch(() => null);

		throw new Error(
			`QuickBooks API error: ${response.status} ${response.statusText}`,
			{ cause: errorData },
		);
	}

	// Parse and return the JSON response
	return response.json();
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

// Common interface for query parameters
export interface QueryParams {
	limit?: number;
	offset?: number;
	asc?: string;
	desc?: string;
	[key: string]: string | number | boolean | undefined;
}

/**
 * Company information type definition
 */
export type CompanyInfo = {
	Id?: string;
	SyncToken?: string;
	CompanyName: string;
	LegalName?: string;
	CompanyAddr?: {
		Line1?: string;
		Line2?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	CustomerCommunicationAddr?: {
		Line1?: string;
		Line2?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	LegalAddr?: {
		Line1?: string;
		Line2?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	PrimaryPhone?: { FreeFormNumber: string };
	CompanyEmail?: { Address: string };
	WebAddr?: { URI: string };
	SupportedLanguages?: string;
	Country?: string;
	Email?: { Address: string };
	FiscalYearStartMonth?: string;
};

/**
 * Retrieves company information from QuickBooks
 * @returns Promise with the company information
 */
export async function getCompanyInfo() {
	return quickbooksRequest<{ CompanyInfo: CompanyInfo }>(
		`companyinfo/${companyId}`,
	);
}

// Type definitions based on QuickBooks API

/**
 * Customer entity type definition
 */
export type Customer = {
	Id?: string;
	SyncToken?: string;
	DisplayName: string;
	Title?: string;
	GivenName?: string;
	MiddleName?: string;
	FamilyName?: string;
	Suffix?: string;
	CompanyName?: string;
	Active?: boolean;
	Notes?: string;
	Balance?: number;
	PrimaryEmailAddr?: { Address: string };
	PrimaryPhone?: { FreeFormNumber: string };
	Mobile?: { FreeFormNumber: string };
	WebAddr?: { URI: string };
	BillAddr?: {
		Line1?: string;
		Line2?: string;
		Line3?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	ShipAddr?: {
		Line1?: string;
		Line2?: string;
		Line3?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	Taxable?: boolean;
	DefaultTaxCodeRef?: { value: string; name?: string };
	PreferredDeliveryMethod?: string;
};

/**
 * Vendor entity type definition
 */
export type Vendor = {
	Id?: string;
	SyncToken?: string;
	DisplayName: string;
	Title?: string;
	GivenName?: string;
	MiddleName?: string;
	FamilyName?: string;
	Suffix?: string;
	CompanyName?: string;
	Active?: boolean;
	Vendor1099?: boolean;
	Balance?: number;
	AcctNum?: string;
	PrintOnCheckName?: string;
	PrimaryEmailAddr?: { Address: string };
	PrimaryPhone?: { FreeFormNumber: string };
	Mobile?: { FreeFormNumber: string };
	WebAddr?: { URI: string };
	BillAddr?: {
		Line1?: string;
		Line2?: string;
		Line3?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	TermRef?: { value: string; name?: string };
	TaxIdentifier?: string;
};

/**
 * Purchase entity type definition
 */
export type Purchase = {
	Id?: string;
	SyncToken?: string;
	PaymentType: "Cash" | "Check" | "CreditCard";
	AccountRef: { value: string; name?: string };
	EntityRef?: { value: string; name?: string; type?: string };
	Line: Array<{
		Id?: string;
		DetailType: "AccountBasedExpenseLineDetail" | "ItemBasedExpenseLineDetail";
		Amount: number;
		Description?: string;
		AccountBasedExpenseLineDetail?: {
			AccountRef: { value: string; name?: string };
			TaxCodeRef?: { value: string };
			BillableStatus?: string;
			ClassRef?: { value: string; name?: string };
		};
		ItemBasedExpenseLineDetail?: {
			ItemRef: { value: string; name?: string };
			UnitPrice: number;
			Qty: number;
			TaxCodeRef?: { value: string };
			BillableStatus?: string;
			ClassRef?: { value: string; name?: string };
		};
	}>;
	TxnDate?: string;
	CurrencyRef?: { value: string; name?: string };
	PrivateNote?: string;
	DocNumber?: string;
	TxnTaxDetail?: {
		TotalTax: number;
		TaxLine: Array<{
			Amount: number;
			DetailType: string;
			TaxLineDetail: {
				TaxRateRef: { value: string; name?: string };
				PercentBased?: boolean;
				TaxPercent?: number;
				NetAmountTaxable?: number;
				TaxInclusiveAmount?: number;
			};
		}>;
	};
	Credit?: boolean;
	DepartmentRef?: { value: string; name?: string };
};

/**
 * PurchaseOrder entity type definition
 */
export type PurchaseOrder = {
	Id?: string;
	SyncToken?: string;
	APAccountRef: { value: string; name?: string };
	VendorRef: { value: string; name?: string };
	Line: Array<{
		Id?: string;
		DetailType: "AccountBasedExpenseLineDetail" | "ItemBasedExpenseLineDetail";
		Amount: number;
		Description?: string;
		ItemBasedExpenseLineDetail?: {
			ItemRef: { value: string; name?: string };
			UnitPrice: number;
			Qty: number;
			TaxCodeRef?: { value: string };
			BillableStatus?: string;
			ClassRef?: { value: string; name?: string };
		};
	}>;
	POStatus?: "Open" | "Closed";
	TxnDate?: string;
	CurrencyRef?: { value: string; name?: string };
	PrivateNote?: string;
	Memo?: string;
	DocNumber?: string;
	ShipAddr?: {
		Line1?: string;
		Line2?: string;
		Line3?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	ShipMethodRef?: { value: string; name?: string };
	EmailStatus?: "NotSet" | "NeedToSend" | "EmailSent";
	POEmail?: { Address: string };
};

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

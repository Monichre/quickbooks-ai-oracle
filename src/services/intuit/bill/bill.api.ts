import { quickbooksRequest, buildQueryString } from "../api";
import type {
	Bill,
	BillCreateRequest,
	BillResponse,
	BillUpdateRequest,
	BillQueryResponse,
	QueryParams,
} from "../types";

// Bill API types
// (Types moved to src/services/intuit/types.ts)

/**
 * Creates a new bill in QuickBooks
 *
 * @param bill - The bill data to create
 * @returns Promise with created bill data
 */
export async function createBill(
	bill: BillCreateRequest,
): Promise<BillResponse> {
	return quickbooksRequest<BillResponse, BillCreateRequest>(
		"bill", // Removed minorversion=75 for consistency
		"POST",
		bill,
	);
}

/**
 * Retrieves a bill by ID from QuickBooks
 *
 * @param billId - The ID of the bill to retrieve
 * @returns Promise with bill data
 */
export async function getBill(billId: string): Promise<BillResponse> {
	return quickbooksRequest<BillResponse>(`bill/${billId}`, "GET"); // Removed minorversion=75
}

/**
 * Updates an existing bill in QuickBooks
 *
 * @param bill - The bill data to update (must include Id and SyncToken)
 * @returns Promise with updated bill data
 */
export async function updateBill(
	bill: BillUpdateRequest,
): Promise<BillResponse> {
	return quickbooksRequest<BillResponse, BillUpdateRequest>(
		"bill", // Removed minorversion=75
		"POST",
		bill,
	);
}

/**
 * Deletes a bill in QuickBooks
 *
 * @param billId - The ID of the bill to delete
 * @param syncToken - The sync token of the bill
 * @returns Promise with deletion confirmation
 */
export async function deleteBill(
	billId: string,
	syncToken: string,
): Promise<BillResponse> {
	// Changed approach to match other delete operations
	return quickbooksRequest<BillResponse, { Id: string; SyncToken: string }>(
		"bill?operation=delete",
		"POST",
		{ Id: billId, SyncToken: syncToken },
	);
}

/**
 * Queries bills in QuickBooks with optional filters
 *
 * @param params - Query parameters and filters
 * @returns Promise with the list of bills matching the query
 */
export async function findBills(params: QueryParams = {}) {
	const queryString = buildQueryString(params);
	return quickbooksRequest<{ QueryResponse: { Bill: Bill[] } }>(
		`query?query=select * from Bill${queryString}`,
	);
}

/**
 * Get all bills from QuickBooks
 *
 * @returns Promise with all bills
 */
export async function getAllBills(): Promise<{
	QueryResponse: { Bill: Bill[] };
}> {
	// Updated to use findBills and return the appropriate type
	return findBills();
}

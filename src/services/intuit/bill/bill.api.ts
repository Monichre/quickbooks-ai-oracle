import { quickbooksRequest, buildQueryString } from "../api";
import type {
	Bill,
	BillCreateRequest,
	BillUpdateRequest,
	BillDeleteRequest,
	BillQueryParams,
	BillQueryResponse,
} from "./bill.types";

/**
 * Create a new bill in QuickBooks
 * @param bill The bill data to create
 * @returns Promise with the created bill
 */
export async function createBill(bill: BillCreateRequest): Promise<Bill> {
	return quickbooksRequest<Bill, BillCreateRequest>("bill", "POST", bill);
}

/**
 * Update an existing bill in QuickBooks
 * @param bill The bill data to update (must include Id and SyncToken)
 * @returns Promise with the updated bill
 */
export async function updateBill(bill: BillUpdateRequest): Promise<Bill> {
	return quickbooksRequest<Bill, BillUpdateRequest>("bill", "POST", bill);
}

/**
 * Delete a bill from QuickBooks
 * @param billToDelete The bill info to delete (must include Id and SyncToken)
 * @returns Promise with the deletion response
 */
export async function deleteBill(
	billToDelete: BillDeleteRequest,
): Promise<{ success: boolean }> {
	const { Id, SyncToken } = billToDelete;
	return quickbooksRequest<
		{ success: boolean },
		{ Id: string; SyncToken: string; operation: string }
	>("bill", "POST", { Id, SyncToken, operation: "delete" });
}

/**
 * Get a specific bill by ID
 * @param billId The ID of the bill to retrieve
 * @returns Promise with the bill data
 */
export async function getBill(billId: string): Promise<BillQueryResponse> {
	return quickbooksRequest<BillQueryResponse>(`bill/${billId}`);
}

/**
 * Query bills with optional filtering parameters
 * @param params Optional query parameters
 * @returns Promise with the bills query response
 */
export async function findBills(
	params: BillQueryParams = {},
): Promise<BillQueryResponse> {
	const queryString = buildQueryString(params);
	const endpoint = `query?query=select * from Bill${queryString}`;

	return quickbooksRequest<BillQueryResponse>(endpoint);
}

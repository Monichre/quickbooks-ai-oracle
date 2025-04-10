import { quickbooksRequest } from "../api";
import { buildQueryString } from "../api";
import type { Purchase, QueryParams } from "../types";

/**
 * Response type for QuickBooks purchase operations
 */
export type PurchaseResponse = {
	Purchase: Purchase;
};

/**
 * Response type for QuickBooks purchase query operations
 */
export type PurchaseQueryResponse = {
	QueryResponse: {
		Purchase: Purchase[];
		startPosition?: number;
		maxResults?: number;
		totalCount?: number;
	};
};

/**
 * Creates a new purchase in QuickBooks
 * @param purchaseData - Purchase data to create
 * @returns Promise with the created purchase
 */
export async function createPurchase(
	purchaseData: Purchase,
): Promise<PurchaseResponse> {
	return quickbooksRequest<PurchaseResponse, { Purchase: Purchase }>(
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
export async function getPurchase(
	purchaseId: string,
): Promise<PurchaseResponse> {
	return quickbooksRequest<PurchaseResponse>(`purchase/${purchaseId}`);
}

/**
 * Queries purchases in QuickBooks with optional filters
 * @param params - Query parameters and filters
 * @returns Promise with the list of purchases matching the query
 */
export async function findPurchases(
	params: QueryParams = {},
): Promise<PurchaseQueryResponse> {
	const queryString = buildQueryString(params);
	return quickbooksRequest<PurchaseQueryResponse>(
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
): Promise<PurchaseResponse> {
	return quickbooksRequest<PurchaseResponse, { Purchase: Purchase }>(
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
export async function deletePurchase(
	purchaseId: string,
	syncToken: string,
): Promise<PurchaseResponse> {
	return quickbooksRequest<PurchaseResponse, { Id: string; SyncToken: string }>(
		"purchase?operation=delete",
		"POST",
		{
			Id: purchaseId,
			SyncToken: syncToken,
		},
	);
}

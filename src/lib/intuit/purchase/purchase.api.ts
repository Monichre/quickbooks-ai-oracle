import { quickbooksRequest } from "../api";
import { buildQueryString } from "../api";
import type { Purchase, QueryParams } from "../types";

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

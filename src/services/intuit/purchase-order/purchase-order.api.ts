import { quickbooksRequest } from "../api";
import { buildQueryString } from "../api";
import type { PurchaseOrder, QueryParams } from "../types";

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

import { quickbooksRequest } from "../api";
import { buildQueryString } from "../api";
import type { Item, QueryParams } from "../types";

/**
 * Creates a new item in QuickBooks
 * @param itemData - Item data to create
 * @returns Promise with the created item
 */
export async function createItem(itemData: Item) {
	return quickbooksRequest<{ Item: Item }, { Item: Item }>("item", "POST", {
		Item: itemData,
	});
}

/**
 * Retrieves an item by ID from QuickBooks
 * @param itemId - ID of the item to retrieve
 * @returns Promise with the item data
 */
export async function getItem(itemId: string) {
	return quickbooksRequest<{ Item: Item }>(`item/${itemId}`);
}

/**
 * Queries items in QuickBooks with optional filters
 * @param params - Query parameters and filters
 * @returns Promise with the list of items matching the query
 */
export async function findItems(params: QueryParams = {}) {
	const queryString = buildQueryString(params);
	return quickbooksRequest<{ QueryResponse: { Item: Item[] } }>(
		`query?query=select * from Item${queryString}`,
	);
}

/**
 * Updates an existing item in QuickBooks
 * @param itemData - Item data with Id and SyncToken
 * @returns Promise with the updated item
 */
export async function updateItem(
	itemData: Item & { Id: string; SyncToken: string },
) {
	return quickbooksRequest<{ Item: Item }, { Item: Item }>("item", "POST", {
		Item: itemData,
	});
}

/**
 * Deletes an item in QuickBooks
 * @param itemId - ID of the item to delete
 * @param syncToken - SyncToken of the item to delete
 * @returns Promise with the deletion result
 */
export async function deleteItem(itemId: string, syncToken: string) {
	return quickbooksRequest<{ Item: Item }, { Id: string; SyncToken: string }>(
		"item?operation=delete",
		"POST",
		{
			Id: itemId,
			SyncToken: syncToken,
		},
	);
}

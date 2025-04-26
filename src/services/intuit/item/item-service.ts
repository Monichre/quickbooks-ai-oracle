import { quickbooksRequest } from "../_common/quickbooks-request";
import type { ItemQueryResponse, ItemResponse, Item } from "./item.types";

/**
 * Fetch all items from QuickBooks
 */
export async function fetchItems(): Promise<{ Items: Item[] }> {
	try {
		// Use the query endpoint to get all items
		const query = "SELECT * FROM Item MAXRESULTS 1000";
		const queryParams = new URLSearchParams({ query });
		const endpoint = `query?${queryParams}`;

		const response = await quickbooksRequest<ItemQueryResponse>({
			endpoint,
			method: "GET",
		});

		if (response?.QueryResponse?.Item) {
			return {
				Items: response.QueryResponse.Item,
			};
		}

		// If query endpoint doesn't work, return empty array
		return { Items: [] };
	} catch (error) {
		console.error("Error fetching items:", error);
		throw error;
	}
}

/**
 * Fetch a specific item by ID
 */
export async function fetchItemById(itemId: string): Promise<Item | null> {
	try {
		const endpoint = `item/${itemId}`;
		const response = await quickbooksRequest<ItemResponse>({
			endpoint,
			method: "GET",
		});

		if (response?.Item) {
			return response.Item;
		}

		return null;
	} catch (error) {
		console.error(`Error fetching item with ID ${itemId}:`, error);
		throw error;
	}
}

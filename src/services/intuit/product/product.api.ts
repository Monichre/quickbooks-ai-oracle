import { quickbooksRequest } from "../api";
import { buildQueryString } from "../api";
import type { Product, QueryParams } from "../types";

/**
 * Creates a new product in QuickBooks
 * @param productData - Product data to create
 * @returns Promise with the created product
 */
export async function createProduct(productData: Product) {
	return quickbooksRequest<{ Item: Product }, { Item: Product }>(
		"item",
		"POST",
		{ Item: productData },
	);
}

/**
 * Retrieves a product by ID from QuickBooks
 * @param productId - ID of the product to retrieve
 * @returns Promise with the product data
 */
export async function getProduct(productId: string) {
	return quickbooksRequest<{ Item: Product }>(`item/${productId}`);
}

/**
 * Queries products in QuickBooks with optional filters
 * @param params - Query parameters and filters
 * @returns Promise with the list of products matching the query
 */
export async function findProducts(params: QueryParams = {}) {
	const queryString = buildQueryString(params);
	return quickbooksRequest<{ QueryResponse: { Item: Product[] } }>(
		`query?query=select * from Item${queryString}`,
	);
}

/**
 * Updates an existing product in QuickBooks
 * @param productData - Product data with Id and SyncToken
 * @returns Promise with the updated product
 */
export async function updateProduct(
	productData: Product & { Id: string; SyncToken: string },
) {
	return quickbooksRequest<{ Item: Product }, { Item: Product }>(
		"item",
		"POST",
		{ Item: productData },
	);
}

/**
 * Deletes a product in QuickBooks
 * @param productId - ID of the product to delete
 * @param syncToken - SyncToken of the product to delete
 * @returns Promise with the deletion result
 */
export async function deleteProduct(productId: string, syncToken: string) {
	return quickbooksRequest<
		{ Item: Product },
		{ Id: string; SyncToken: string }
	>("item?operation=delete", "POST", {
		Id: productId,
		SyncToken: syncToken,
	});
}

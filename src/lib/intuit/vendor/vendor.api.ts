import { quickbooksRequest } from "../api";
import { buildQueryString } from "../api";
import type { QueryParams, Vendor } from "../types";

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

/**
 * Deletes a vendor in QuickBooks
 * @param vendorId - ID of the vendor to delete
 * @param syncToken - SyncToken of the vendor to delete
 * @returns Promise with the deletion result
 */
export async function deleteVendor(vendorId: string, syncToken: string) {
	return quickbooksRequest<
		{ Vendor: Vendor },
		{ Id: string; SyncToken: string }
	>("vendor?operation=delete", "POST", {
		Id: vendorId,
		SyncToken: syncToken,
	});
}

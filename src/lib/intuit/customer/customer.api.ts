import { quickbooksRequest } from "../api";
import { buildQueryString } from "../api";
import type { Customer, QueryParams } from "../types";

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

/**
 * Deletes a customer in QuickBooks
 * @param customerId - ID of the customer to delete
 * @param syncToken - SyncToken of the customer to delete
 * @returns Promise with the deletion result
 */
export async function deleteCustomer(customerId: string, syncToken: string) {
	return quickbooksRequest<
		{ Customer: Customer },
		{ Id: string; SyncToken: string }
	>("customer?operation=delete", "POST", {
		Id: customerId,
		SyncToken: syncToken,
	});
}

import { quickbooksRequest } from "../api";
import { buildQueryString } from "../api";
import type { Account, QueryParams } from "../types";

/**
 * Creates a new account in QuickBooks
 * @param accountData - Account data to create
 * @returns Promise with the created account
 */
export async function createAccount(accountData: Account) {
	return quickbooksRequest<{ Account: Account }, { Account: Account }>(
		"account",
		"POST",
		{ Account: accountData },
	);
}

/**
 * Retrieves an account by ID from QuickBooks
 * @param accountId - ID of the account to retrieve
 * @returns Promise with the account data
 */
export async function getAccount(accountId: string) {
	return quickbooksRequest<{ Account: Account }>(`account/${accountId}`);
}

/**
 * Queries accounts in QuickBooks with optional filters
 * @param params - Query parameters and filters
 * @returns Promise with the list of accounts matching the query
 */
export async function findAccounts(params: QueryParams = {}) {
	const queryString = buildQueryString(params);

	console.log("🚀 ~ findAccounts ~ queryString:", queryString);

	return quickbooksRequest<{ QueryResponse: { Account: Account[] } }>(
		`query?query=select * from Account${queryString}`,
	);
}

/**
 * Updates an existing account in QuickBooks
 * @param accountData - Account data with Id and SyncToken
 * @returns Promise with the updated account
 */
export async function updateAccount(
	accountData: Account & { Id: string; SyncToken: string },
) {
	return quickbooksRequest<{ Account: Account }, { Account: Account }>(
		"account",
		"POST",
		{ Account: accountData },
	);
}

/**
 * Deletes an account in QuickBooks
 * @param accountId - ID of the account to delete
 * @param syncToken - SyncToken of the account to delete
 * @returns Promise with the deletion result
 */
export async function deleteAccount(accountId: string, syncToken: string) {
	return quickbooksRequest<
		{ Account: Account },
		{ Id: string; SyncToken: string }
	>("account?operation=delete", "POST", {
		Id: accountId,
		SyncToken: syncToken,
	});
}

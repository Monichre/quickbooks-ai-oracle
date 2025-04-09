import { quickbooksRequest } from "../api";
import type {
	AccountListDetailReport,
	AccountListDetailQueryParams,
	AccountDetail,
	AccountTotals,
	ReportRow,
} from "./account-list-detail.types";
import { isHeaderRow, isDataRow } from "./account-list-detail.types";

/**
 * Fetches the AccountListDetail report from QuickBooks
 * @param params Query parameters for the report
 * @returns Promise with the AccountListDetail report
 */
export async function getAccountListDetailReport(
	params: AccountListDetailQueryParams = {},
): Promise<AccountListDetailReport> {
	// Construct URL with query parameters
	let url = "reports/AccountListDetail";

	// Add query parameters
	const queryParams: string[] = [];
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) {
			queryParams.push(`${key}=${encodeURIComponent(String(value))}`);
		}
	}

	if (queryParams.length > 0) {
		url += `?${queryParams.join("&")}`;
	}

	return quickbooksRequest<AccountListDetailReport>(url);
}

/**
 * Parses the AccountListDetail report and extracts account information in a more usable format
 * @param report The raw AccountListDetail report
 * @returns An array of account details with structured information
 */
export function parseAccountListDetailReport(report: AccountListDetailReport): {
	accounts: AccountDetail[];
	totals: AccountTotals;
} {
	const accounts: AccountDetail[] = [];
	const totals: AccountTotals = {
		totalAssets: 0,
		totalLiabilities: 0,
		totalEquity: 0,
	};

	for (const row of report.Rows.Row) {
		if (isDataRow(row)) {
			// Regular account row
			const colData = row.ColData;
			if (colData.length >= 4 && colData[0].id) {
				accounts.push({
					id: colData[0].id,
					name: colData[0].value,
					type: colData[1].value,
					detailType: colData[2].value,
					balance: Number.parseFloat(colData[3].value) || 0,
				});
			}
		} else if (isHeaderRow(row)) {
			// Total row
			const colData = row.Header.ColData;
			if (colData.length >= 4) {
				const title = colData[0].value;
				const balance = Number.parseFloat(colData[3].value) || 0;

				if (title.includes("Total Assets")) {
					totals.totalAssets = balance;
				} else if (title.includes("Total Liabilities")) {
					totals.totalLiabilities = balance;
				} else if (title.includes("Total Equity")) {
					totals.totalEquity = balance;
				}
			}
		}
	}

	return { accounts, totals };
}

/**
 * Gets account details by type
 * @param accounts Array of account details
 * @param type The account type to filter by
 * @returns Filtered array of accounts
 */
export function getAccountsByType(
	accounts: AccountDetail[],
	type: string,
): AccountDetail[] {
	return accounts.filter((account) => account.type === type);
}

/**
 * Gets a specific account by ID
 * @param accounts Array of account details
 * @param id The account ID to find
 * @returns The matching account or undefined
 */
export function getAccountById(
	accounts: AccountDetail[],
	id: string,
): AccountDetail | undefined {
	return accounts.find((account) => account.id === id);
}

/**
 * Gets all accounts with a positive balance
 * @param accounts Array of account details
 * @returns Accounts with positive balances
 */
export function getAccountsWithPositiveBalance(
	accounts: AccountDetail[],
): AccountDetail[] {
	return accounts.filter((account) => account.balance > 0);
}

/**
 * Gets all accounts with a negative balance
 * @param accounts Array of account details
 * @returns Accounts with negative balances
 */
export function getAccountsWithNegativeBalance(
	accounts: AccountDetail[],
): AccountDetail[] {
	return accounts.filter((account) => account.balance < 0);
}

/**
 * Helper utility to fetch and parse the AccountListDetail report in one step
 * @param params Query parameters for the report
 * @returns Promise with parsed accounts and totals
 */
export async function getAccountListDetail(
	params: AccountListDetailQueryParams = {},
): Promise<{ accounts: AccountDetail[]; totals: AccountTotals }> {
	const report = await getAccountListDetailReport(params);
	return parseAccountListDetailReport(report);
}

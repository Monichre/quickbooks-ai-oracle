import { quickbooksRequest } from "../api";
import { buildQueryString } from "../api";
import type { CompanyInfo, CompanyInfoResponse, QueryParams } from "../types";

/**
 * Retrieves company information from QuickBooks
 * @returns Promise with the company information
 */
export async function getCompanyInfo() {
	return quickbooksRequest<CompanyInfoResponse>(
		"query?query=select * from CompanyInfo",
	);
}

/**
 * Retrieves a specific company info by ID from QuickBooks
 * @param companyInfoId - ID of the company info to retrieve
 * @returns Promise with the company info data
 */
export async function getCompanyInfoById(companyInfoId: string) {
	return quickbooksRequest<{ CompanyInfo: CompanyInfo }>(
		`companyinfo/${companyInfoId}`,
	);
}

/**
 * Queries company info in QuickBooks with optional filters
 * @param params - Query parameters and filters
 * @returns Promise with the list of company infos matching the query
 */
export async function findCompanyInfos(params: QueryParams = {}) {
	const queryString = buildQueryString(params);
	return quickbooksRequest<CompanyInfoResponse>(
		`query?query=select * from CompanyInfo${queryString}`,
	);
}

/**
 * Updates an existing company info in QuickBooks
 * @param companyInfoData - Company info data with Id and SyncToken
 * @returns Promise with the updated company info
 */
export async function updateCompanyInfo(
	companyInfoData: CompanyInfo & { Id: string; SyncToken: string },
) {
	return quickbooksRequest<
		{ CompanyInfo: CompanyInfo },
		{ CompanyInfo: CompanyInfo }
	>("companyinfo", "POST", { CompanyInfo: companyInfoData });
}

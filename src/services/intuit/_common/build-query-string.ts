/**
 * QuickBooks Query API Endpoint
 *
 * GET /v3/company/{companyId}/query?query=<selectStatement>&minorversion=75
 *
 * Content type: text/plain
 * Production Base URL: https://quickbooks.api.intuit.com
 * Sandbox Base URL: https://sandbox-quickbooks.api.intuit.com
 *
 * Used for executing SQL-like queries against QuickBooks entities.
 */

/**
 * Builds a QuickBooks query string from the provided parameters
 * @param params - Object containing query parameters
 * @returns Formatted query string
 */

export function buildQueryString(
	params: Record<string, string | number | boolean | undefined>,
): string {
	const queryParts: string[] = [];

	// Handle where conditions
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) {
			// Skip pagination and sorting parameters
			if (
				!["limit", "offset", "asc", "desc"].includes(key) &&
				typeof value === "string"
			) {
				queryParts.push(`${key} = '${value}'`);
			}
		}
	}

	// Add the WHERE clause if we have conditions
	let query = queryParts.length > 0 ? ` WHERE ${queryParts.join(" AND ")}` : "";

	// Handle sorting
	if (params.asc) {
		query += ` ORDERBY ${params.asc} ASC`;
	} else if (params.desc) {
		query += ` ORDERBY ${params.desc} DESC`;
	}

	// Handle pagination
	if (params.limit) {
		query += ` MAXRESULTS ${params.limit}`;
	}
	if (params.offset) {
		query += ` STARTPOSITION ${params.offset}`;
	}

	return query;
}

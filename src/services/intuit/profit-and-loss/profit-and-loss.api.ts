import { quickbooksRequest } from "../api";
import type {
	ProfitAndLossReport,
	ProfitAndLossQueryParams,
	ReportRow,
	FinancialSummary,
	IncomeItem,
	ExpenseItem,
	CogsItem,
	SectionRow,
} from "./profit-and-loss.types";
import { isDataRow, isSummaryRow, isSectionRow } from "./profit-and-loss.types";

/**
 * Fetches the ProfitAndLoss report from QuickBooks
 * @param params Query parameters for the report
 * @returns Promise with the ProfitAndLoss report
 */
export async function getProfitAndLossReport(
	params: ProfitAndLossQueryParams = {},
): Promise<ProfitAndLossReport> {
	// Construct URL with query parameters
	let url = "reports/ProfitAndLoss";

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

	return quickbooksRequest<ProfitAndLossReport>(url);
}

/**
 * Recursively processes section rows to extract financial data
 * @param rows Array of report rows to process
 * @param sectionType The type of financial section being processed
 * @param result The result object to populate
 */
function processSection(
	rows: ReportRow[],
	sectionType: "income" | "expense" | "cogs",
	result: FinancialSummary,
): void {
	for (const row of rows) {
		if (isDataRow(row)) {
			// Regular data row
			const colData = row.ColData;
			if (colData.length >= 2) {
				const item = {
					id: colData[0].id,
					name: colData[0].value,
					amount: Number.parseFloat(colData[1].value) || 0,
				};

				switch (sectionType) {
					case "income":
						result.incomeItems.push(item as IncomeItem);
						break;
					case "expense":
						result.expenseItems.push(item as ExpenseItem);
						break;
					case "cogs":
						result.cogsItems.push(item as CogsItem);
						break;
				}
			}
		} else if (isSectionRow(row) && row.Rows?.Row) {
			// Process nested rows
			processSection(row.Rows.Row, sectionType, result);
		}
	}
}

/**
 * Parses the ProfitAndLoss report and extracts financial information in a more usable format
 * @param report The raw ProfitAndLoss report
 * @returns A structured financial summary
 */
export function parseProfitAndLossReport(
	report: ProfitAndLossReport,
): FinancialSummary {
	const result: FinancialSummary = {
		totalIncome: 0,
		totalCogs: 0,
		grossProfit: 0,
		totalExpenses: 0,
		netIncome: 0,
		incomeItems: [],
		cogsItems: [],
		expenseItems: [],
	};

	const mainRows = report.Rows.Row;

	// Process each section
	for (const row of mainRows) {
		if (isSectionRow(row)) {
			const sectionName = row.Header.ColData[0].value;

			// Process income section
			if (sectionName === "Income" && row.Rows?.Row) {
				processSection(row.Rows.Row, "income", result);

				// Get total income from summary
				if (row.Summary?.ColData && row.Summary.ColData.length >= 2) {
					result.totalIncome =
						Number.parseFloat(row.Summary.ColData[1].value) || 0;
				}
			}

			// Process COGS section
			else if (sectionName === "Cost of Goods Sold" && row.Rows?.Row) {
				processSection(row.Rows.Row, "cogs", result);

				// Get total COGS from summary
				if (row.Summary?.ColData && row.Summary.ColData.length >= 2) {
					result.totalCogs =
						Number.parseFloat(row.Summary.ColData[1].value) || 0;
				}
			}

			// Process expenses section
			else if (sectionName === "Expenses" && row.Rows?.Row) {
				processSection(row.Rows.Row, "expense", result);

				// Get total expenses from summary
				if (row.Summary?.ColData && row.Summary.ColData.length >= 2) {
					result.totalExpenses =
						Number.parseFloat(row.Summary.ColData[1].value) || 0;
				}
			}
		}
		// Extract gross profit and net income from summary rows
		else if (isSummaryRow(row)) {
			const rowName = row.Summary.ColData[0].value;
			const amount = Number.parseFloat(row.Summary.ColData[1].value) || 0;

			if (rowName === "Gross Profit") {
				result.grossProfit = amount;
			} else if (rowName === "Net Income") {
				result.netIncome = amount;
			}
		}
	}

	return result;
}

/**
 * Gets income items with amounts above a certain threshold
 * @param summary Financial summary
 * @param threshold Minimum amount threshold
 * @returns Filtered array of income items
 */
export function getSignificantIncomeItems(
	summary: FinancialSummary,
	threshold: number,
): IncomeItem[] {
	return summary.incomeItems.filter((item) => item.amount >= threshold);
}

/**
 * Gets expense items with amounts above a certain threshold
 * @param summary Financial summary
 * @param threshold Minimum amount threshold
 * @returns Filtered array of expense items
 */
export function getSignificantExpenseItems(
	summary: FinancialSummary,
	threshold: number,
): ExpenseItem[] {
	return summary.expenseItems.filter((item) => item.amount >= threshold);
}

/**
 * Calculates expense as a percentage of income
 * @param summary Financial summary
 * @returns Expense ratio (0-1)
 */
export function getExpenseRatio(summary: FinancialSummary): number {
	if (summary.totalIncome === 0) {
		return 0;
	}
	return summary.totalExpenses / summary.totalIncome;
}

/**
 * Calculates profit margin
 * @param summary Financial summary
 * @returns Profit margin as a decimal (0-1)
 */
export function getProfitMargin(summary: FinancialSummary): number {
	if (summary.totalIncome === 0) {
		return 0;
	}
	return summary.netIncome / summary.totalIncome;
}

/**
 * Helper utility to fetch and parse the ProfitAndLoss report in one step
 * @param params Query parameters for the report
 * @returns Promise with parsed financial summary
 */
export async function getProfitAndLoss(
	params: ProfitAndLossQueryParams = {},
): Promise<FinancialSummary> {
	const report = await getProfitAndLossReport(params);
	return parseProfitAndLossReport(report);
}

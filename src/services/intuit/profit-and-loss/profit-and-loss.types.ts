/**
 * Type definitions for QuickBooks ProfitAndLoss Report API
 */

/**
 * Interface for report header option
 */
export interface ReportOption {
	Name: string;
	Value: string;
}

/**
 * Interface for report header
 */
export interface ReportHeader {
	Time: string;
	ReportName: string;
	ReportBasis: string;
	StartPeriod: string;
	EndPeriod: string;
	Currency: string;
	Option: ReportOption[];
}

/**
 * Interface for report column
 */
export interface ReportColumn {
	ColTitle: string;
	ColType: string;
}

/**
 * Interface for report columns
 */
export interface ReportColumns {
	Column: ReportColumn[];
}

/**
 * Interface for column data
 */
export interface ColumnData {
	value: string;
	id?: string;
	href?: string;
}

/**
 * Interface for data row (account/transaction line)
 */
export interface DataRow {
	ColData: ColumnData[];
}

/**
 * Interface for summary row
 */
export interface SummaryRow {
	Summary: {
		ColData: ColumnData[];
	};
}

/**
 * Interface for section with nested rows
 */
export interface SectionRow {
	Header: {
		ColData: ColumnData[];
	};
	Rows?: {
		Row: ReportRow[];
	};
	Summary?: {
		ColData: ColumnData[];
	};
}

/**
 * Type for row - can be DataRow, SummaryRow, or SectionRow
 */
export type ReportRow = DataRow | SummaryRow | SectionRow;

/**
 * Interface for report rows
 */
export interface ReportRows {
	Row: ReportRow[];
}

/**
 * Interface for the ProfitAndLoss report
 */
export interface ProfitAndLossReport {
	Header: ReportHeader;
	Columns: ReportColumns;
	Rows: ReportRows;
}

/**
 * Interface for the ProfitAndLoss query parameters
 */
export interface ProfitAndLossQueryParams {
	start_date?: string;
	end_date?: string;
	accounting_method?: "Accrual" | "Cash";
	date_macro?: string;
	minorversion?: number;
	[key: string]: string | number | undefined;
}

/**
 * Helper type guard to check if a row is a data row
 */
export function isDataRow(row: ReportRow): row is DataRow {
	return "ColData" in row && !("Header" in row) && !("Summary" in row);
}

/**
 * Helper type guard to check if a row is a summary row
 */
export function isSummaryRow(row: ReportRow): row is SummaryRow {
	return "Summary" in row && !("Header" in row);
}

/**
 * Helper type guard to check if a row is a section row
 */
export function isSectionRow(row: ReportRow): row is SectionRow {
	return "Header" in row;
}

/**
 * Interface for a simplified income item
 */
export interface IncomeItem {
	id?: string;
	name: string;
	amount: number;
}

/**
 * Interface for a simplified expense item
 */
export interface ExpenseItem {
	id?: string;
	name: string;
	amount: number;
}

/**
 * Interface for a simplified cost of goods sold item
 */
export interface CogsItem {
	id?: string;
	name: string;
	amount: number;
}

/**
 * Interface for financial summary data parsed from the report
 */
export interface FinancialSummary {
	totalIncome: number;
	totalCogs: number;
	grossProfit: number;
	totalExpenses: number;
	netIncome: number;
	incomeItems: IncomeItem[];
	cogsItems: CogsItem[];
	expenseItems: ExpenseItem[];
}

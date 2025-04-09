/**
 * Type definitions for QuickBooks AccountListDetail Report API
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
 * Interface for column metadata
 */
export interface ColumnMetaData {
	Name: string;
	Value: string;
}

/**
 * Interface for report column
 */
export interface ReportColumn {
	ColTitle: string;
	ColType: string;
	MetaData?: ColumnMetaData[];
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
 * Interface for regular row
 */
export interface DataRow {
	ColData: ColumnData[];
}

/**
 * Interface for header row
 */
export interface HeaderRow {
	Header: {
		ColData: ColumnData[];
	};
}

/**
 * Type for row - can be either a data row or a header row
 */
export type ReportRow = DataRow | HeaderRow;

/**
 * Interface for report rows
 */
export interface ReportRows {
	Row: ReportRow[];
}

/**
 * Interface for the AccountListDetail report
 */
export interface AccountListDetailReport {
	Header: ReportHeader;
	Columns: ReportColumns;
	Rows: ReportRows;
}

/**
 * Interface for the AccountListDetail query parameters
 */
export interface AccountListDetailQueryParams {
	start_date?: string;
	end_date?: string;
	accounting_method?: "Accrual" | "Cash";
	date_macro?: string;
	minorversion?: number;
	[key: string]: string | number | undefined;
}

/**
 * Helper type guard to check if a row is a header row
 */
export function isHeaderRow(row: ReportRow): row is HeaderRow {
	return "Header" in row;
}

/**
 * Helper type guard to check if a row is a data row
 */
export function isDataRow(row: ReportRow): row is DataRow {
	return "ColData" in row;
}

/**
 * Interface for a simplified account structure parsed from the report
 */
export interface AccountDetail {
	id: string;
	name: string;
	type: string;
	detailType: string;
	balance: number;
}

/**
 * Interface for account totals by type
 */
export interface AccountTotals {
	totalAssets: number;
	totalLiabilities: number;
	totalEquity: number;
}

/**
 * Type definitions for QuickBooks Bills API
 */

// Define the ReferenceType that's used throughout the API
interface ReferenceType {
	value: string;
	name?: string;
}

/**
 * Interface for Line items in a Bill
 */
export interface BillLine {
	Id?: string;
	DetailType: "ItemBasedExpenseLine" | "AccountBasedExpenseLine";
	Amount: number;
	Description?: string;

	// For ItemBasedExpenseLine
	ItemBasedExpenseLineDetail?: {
		ItemRef: ReferenceType;
		TaxCodeRef?: ReferenceType;
		Qty?: number;
		UnitPrice?: number;
	};

	// For AccountBasedExpenseLine
	AccountBasedExpenseLineDetail?: {
		AccountRef: ReferenceType;
		TaxCodeRef?: ReferenceType;
		ClassRef?: ReferenceType;
		MarkupInfo?: {
			PercentBased?: boolean;
			Percent?: number;
			PriceLevelRef?: ReferenceType;
		};
	};
}

/**
 * Interface for LinkedTxn in a Bill
 */
export interface LinkedTxn {
	TxnId: string;
	TxnType: "PurchaseOrder" | "BillPaymentCheck" | "ReimburseCharge";
	TxnLineId?: string;
}

/**
 * Interface for ModificationMetaData
 */
export interface ModificationMetaData {
	CreateTime: string;
	LastUpdatedTime: string;
}

/**
 * Interface for TxnTaxDetail
 */
export interface TxnTaxDetail {
	TxnTaxCodeRef?: ReferenceType;
	TotalTax?: number;
	TaxLine?: Array<{
		DetailType: string;
		Amount: number;
		TaxLineDetail: {
			TaxRateRef: ReferenceType;
			PercentBased?: boolean;
			TaxPercent?: number;
			NetAmountTaxable?: number;
		};
	}>;
}

/**
 * Interface for the Bill entity
 */
export interface Bill {
	Id?: string;
	VendorRef: ReferenceType;
	Line: BillLine[];
	SyncToken?: string;
	CurrencyRef?: ReferenceType;
	GlobalTaxCalculation?: "TaxExcluded" | "TaxInclusive" | "NotApplicable";
	TxnDate?: string;
	APAccountRef?: ReferenceType;
	SalesTermRef?: ReferenceType;
	LinkedTxn?: LinkedTxn[];
	TotalAmt?: number;
	AccountLocation?:
		| "WithinFrance"
		| "FranceOverseas"
		| "OutsideFranceWithEU"
		| "OutsideEU";
	DueDate?: string;
	ModificationMetaData?: ModificationMetaData;
	DocNumber?: string;
	PrivateNote?: string;
	TxnTaxDetail?: TxnTaxDetail;
	ExchangeRate?: number;
	DepartmentRef?: ReferenceType;
	TPAR?: boolean;
	HomeBalance?: number;
	RecurringRef?: ReferenceType;
	Balance?: number;
}

/**
 * Interface for the Bill create/update request
 */
export interface BillCreateRequest {
	VendorRef: ReferenceType;
	Line: BillLine[];
	CurrencyRef?: ReferenceType;
	APAccountRef?: ReferenceType;
	TxnDate?: string;
	DueDate?: string;
	DocNumber?: string;
	PrivateNote?: string;
}

/**
 * Interface for the Bill update request
 */
export interface BillUpdateRequest extends BillCreateRequest {
	Id: string;
	SyncToken: string;
}

/**
 * Interface for the Bill delete request
 */
export interface BillDeleteRequest {
	Id: string;
	SyncToken: string;
}

/**
 * Interface for the Bill query parameters
 */
export interface BillQueryParams {
	limit?: number;
	offset?: number;
	asc?: string;
	desc?: string;
	TxnDate?: string;
	DueDate?: string;
	DocNumber?: string;
	VendorRef?: string;
	[key: string]: string | number | boolean | undefined;
}

/**
 * Interface for the Bill query response
 */
export interface BillQueryResponse {
	QueryResponse: {
		Bill?: Bill[];
		startPosition?: number;
		maxResults?: number;
		totalCount?: number;
	};
	time?: string;
}

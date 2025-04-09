/**
 * Type definitions for QuickBooks Estimates API
 */

// Define the ReferenceType that's used throughout the API
interface ReferenceType {
	value: string;
	name?: string;
}

/**
 * Interface for Line items in an Estimate
 */
export interface EstimateLine {
	Id?: string;
	LineNum?: number;
	Description?: string;
	Amount: number;
	DetailType:
		| "SalesItemLineDetail"
		| "SubTotalLineDetail"
		| "DiscountLineDetail"
		| "GroupLineDetail";

	// For SalesItemLineDetail
	SalesItemLineDetail?: {
		ItemRef: ReferenceType;
		TaxCodeRef?: ReferenceType;
		UnitPrice?: number;
		Qty?: number;
		ServiceDate?: string;
	};

	// For SubTotalLineDetail
	SubTotalLineDetail?: Record<string, unknown>;

	// For DiscountLineDetail
	DiscountLineDetail?: {
		DiscountPercent?: number;
		PercentBased?: boolean;
		DiscountAccountRef?: ReferenceType;
	};
}

/**
 * Interface for LinkedTxn in an Estimate
 */
export interface LinkedTxn {
	TxnId: string;
	TxnType: string;
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
 * Interface for the Estimate entity
 */
export interface Estimate {
	Id?: string;
	SyncToken?: string;
	CustomerId?: string;
	CustomerRef: ReferenceType;
	CustomerMemo?: { value: string };
	TxnDate?: string;
	Line: EstimateLine[];
	TxnTaxDetail?: TxnTaxDetail;
	CurrencyRef?: ReferenceType;
	ClassRef?: ReferenceType;
	ExchangeRate?: number;
	ShipAddr?: {
		Id?: string;
		Line1?: string;
		Line2?: string;
		Line3?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	BillAddr?: {
		Id?: string;
		Line1?: string;
		Line2?: string;
		Line3?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	ShipFromAddr?: {
		Id?: string;
		Line1?: string;
		Line2?: string;
		Line3?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	DueDate?: string;
	ExpirationDate?: string;
	AcceptedBy?: string;
	AcceptedDate?: string;
	TotalAmt?: number;
	PrintStatus?: "NotSet" | "NeedToPrint" | "PrintComplete";
	EmailStatus?: "NotSet" | "NeedToSend" | "EmailSent";
	BillEmail?: { Address?: string };
	DeliveryInfo?: {
		DeliveryType?: "Email" | "Print";
		DeliveryTime?: string;
	};
	DocNumber?: string;
	PrivateNote?: string;
	LinkedTxn?: LinkedTxn[];
	GlobalTaxCalculation?: "TaxExcluded" | "TaxInclusive" | "NotApplicable";
	TxnStatus?: "Pending" | "Accepted" | "Closed" | "Rejected";
	ApplyTaxAfterDiscount?: boolean;
	ModificationMetaData?: ModificationMetaData;
	RecurDataRef?: ReferenceType;
}

/**
 * Interface for the Estimate create/update request
 */
export interface EstimateCreateRequest {
	CustomerRef: ReferenceType;
	Line: EstimateLine[];
	TxnDate?: string;
	CurrencyRef?: ReferenceType;
	ExpirationDate?: string;
	DocNumber?: string;
	PrivateNote?: string;
	BillAddr?: {
		Line1?: string;
		Line2?: string;
		Line3?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	ShipAddr?: {
		Line1?: string;
		Line2?: string;
		Line3?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	CustomerMemo?: { value: string };
}

/**
 * Interface for the Estimate update request
 */
export interface EstimateUpdateRequest extends EstimateCreateRequest {
	Id: string;
	SyncToken: string;
}

/**
 * Interface for the Estimate delete request
 */
export interface EstimateDeleteRequest {
	Id: string;
	SyncToken: string;
}

/**
 * Interface for the Estimate query parameters
 */
export interface EstimateQueryParams {
	limit?: number;
	offset?: number;
	asc?: string;
	desc?: string;
	TxnDate?: string;
	CustomerRef?: string;
	DocNumber?: string;
	TxnStatus?: string;
	[key: string]: string | number | boolean | undefined;
}

/**
 * Interface for the Estimate query response
 */
export interface EstimateQueryResponse {
	QueryResponse: {
		Estimate?: Estimate[];
		startPosition?: number;
		maxResults?: number;
		totalCount?: number;
	};
	time?: string;
}

/**
 * Type definitions for QuickBooks Payments API
 */

// Define the common reference type
interface ReferenceType {
	value: string;
	name?: string;
}

/**
 * Interface for Line items in a Payment
 */
export interface PaymentLine {
	Amount: number;
	LinkedTxn?: Array<{
		TxnId: string;
		TxnType: string;
		TxnLineId?: string;
	}>;
}

/**
 * Interface for the Payment entity
 */
export interface Payment {
	Id?: string;
	SyncToken?: string;
	CustomerRef: ReferenceType;
	TotalAmt: number;
	CurrencyRef?: ReferenceType;
	Line: PaymentLine[];
	TxnDate?: string;
	PaymentMethodRef?: ReferenceType;
	DepositToAccountRef?: ReferenceType;
	UnappliedAmt?: number;
	ProcessPayment?: boolean;
	domain?: string;
	MetaData?: {
		CreateTime?: string;
		LastUpdatedTime?: string;
	};
	sparse?: boolean;
}

/**
 * Interface for the Payment create request
 */
export interface PaymentCreateRequest {
	CustomerRef: ReferenceType;
	TotalAmt: number;
	Line: PaymentLine[];
	TxnDate?: string;
	PaymentMethodRef?: ReferenceType;
	DepositToAccountRef?: ReferenceType;
	ProcessPayment?: boolean;
}

/**
 * Interface for the Payment update request
 */
export interface PaymentUpdateRequest extends PaymentCreateRequest {
	Id: string;
	SyncToken: string;
	sparse?: boolean;
}

/**
 * Interface for the Payment delete/void request
 */
export interface PaymentDeleteRequest {
	Id: string;
	SyncToken: string;
}

/**
 * Interface for the Payment query parameters
 */
export interface PaymentQueryParams {
	limit?: number;
	offset?: number;
	asc?: string;
	desc?: string;
	TxnDate?: string;
	CustomerRef?: string;
	[key: string]: string | number | boolean | undefined;
}

/**
 * Interface for the Payment query response
 */
export interface PaymentQueryResponse {
	QueryResponse: {
		Payment?: Payment[];
		startPosition?: number;
		maxResults?: number;
		totalCount?: number;
	};
	time?: string;
}

import { quickbooksRequest, buildQueryString } from "../api";

// Define Payment types based on the API documentation
interface LinkedTransaction {
	TxnId: string;
	TxnType: string;
}

interface PaymentLine {
	Amount: number;
	LinkedTxn?: LinkedTransaction[];
}

export interface Payment {
	Id?: string;
	SyncToken?: string;
	CustomerRef: {
		value: string;
		name?: string;
	};
	TotalAmt: number;
	CurrencyRef?: {
		value: string;
		name?: string;
	};
	Line: PaymentLine[];
	TxnDate?: string;
	PaymentMethodRef?: {
		value: string;
		name?: string;
	};
	DepositToAccountRef?: {
		value: string;
		name?: string;
	};
	UnappliedAmt?: number;
	ProcessPayment?: boolean;
	MetaData?: {
		CreateTime: string;
		LastUpdatedTime: string;
	};
}

export interface PaymentResponse {
	Payment: Payment;
	time: string;
}

/**
 * Create a new payment
 * @param payment - Payment object to create
 * @returns Created payment
 */
export async function createPayment(
	payment: Payment,
): Promise<PaymentResponse> {
	return quickbooksRequest<PaymentResponse, Payment>(
		"payment",
		"POST",
		payment,
	);
}

/**
 * Get a payment by ID
 * @param paymentId - ID of the payment to retrieve
 * @returns Payment object
 */
export async function getPayment(paymentId: string): Promise<PaymentResponse> {
	return quickbooksRequest<PaymentResponse>(`payment/${paymentId}`);
}

/**
 * Query payments based on conditions
 * @param params - Query parameters
 * @returns List of matching payments
 */
export async function queryPayments(
	params: Record<string, string | number | boolean | undefined>,
): Promise<{
	QueryResponse: {
		Payment: Payment[];
		startPosition: number;
		maxResults: number;
		totalCount: number;
	};
}> {
	const queryString = buildQueryString(params);
	const query = `select * from Payment${queryString}`;
	return quickbooksRequest<{
		QueryResponse: {
			Payment: Payment[];
			startPosition: number;
			maxResults: number;
			totalCount: number;
		};
	}>(`query?query=${encodeURIComponent(query)}`);
}

/**
 * Update an existing payment
 * @param payment - Payment object with updated fields (must include Id and SyncToken)
 * @returns Updated payment
 */
export async function updatePayment(
	payment: Payment,
): Promise<PaymentResponse> {
	if (!payment.Id || !payment.SyncToken) {
		throw new Error("Payment must include Id and SyncToken for updates");
	}

	return quickbooksRequest<PaymentResponse, Payment>("payment", "POST", {
		...payment,
		sparse: false,
	});
}

/**
 * Delete a payment
 * @param paymentId - ID of the payment to delete
 * @param syncToken - Current SyncToken of the payment
 * @returns Deleted payment response
 */
export async function deletePayment(
	paymentId: string,
	syncToken: string,
): Promise<PaymentResponse> {
	return quickbooksRequest<PaymentResponse, { Id: string; SyncToken: string }>(
		"payment?operation=delete",
		"POST",
		{
			Id: paymentId,
			SyncToken: syncToken,
		},
	);
}

/**
 * Void a payment
 * @param paymentId - ID of the payment to void
 * @param syncToken - Current SyncToken of the payment
 * @returns Voided payment response
 */
export async function voidPayment(
	paymentId: string,
	syncToken: string,
): Promise<PaymentResponse> {
	return quickbooksRequest<PaymentResponse, { Id: string; SyncToken: string }>(
		"payment?operation=void",
		"POST",
		{
			Id: paymentId,
			SyncToken: syncToken,
		},
	);
}
